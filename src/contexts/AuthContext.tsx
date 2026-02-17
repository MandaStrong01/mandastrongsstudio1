import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface UserPlan {
  type: 'free' | 'basic' | 'pro' | 'studio';
  amount: number;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  userPlan: UserPlan;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userPlan, setUserPlan] = useState<UserPlan>({ type: 'free', amount: 50, isAdmin: false });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        updateUserPlan(session.user);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        setUser(session?.user ?? null);
        if (session?.user) {
          updateUserPlan(session.user);
        }
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  const updateUserPlan = (user: User) => {
    const isAdmin = user.email?.toLowerCase() === 'admin' ||
                    user.email?.toLowerCase().includes('admin') ||
                    user.user_metadata?.role === 'admin';

    if (isAdmin) {
      setUserPlan({ type: 'studio', amount: 50, isAdmin: true });
    } else {
      const planType = user.user_metadata?.plan || 'free';
      const amount = planType === 'basic' ? 20 : planType === 'pro' ? 30 : planType === 'studio' ? 50 : 0;
      setUserPlan({ type: planType, amount, isAdmin: false });
    }
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, userPlan, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
