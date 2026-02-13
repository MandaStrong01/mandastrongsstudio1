import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface SubscriptionInfo {
  tier: string;
  maxDuration: number;
  status: string;
  features: Record<string, any>;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  subscription: SubscriptionInfo | null;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);

  const loadUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      setIsAdmin(data?.role === 'admin');
    } catch (error) {
      console.error('Error loading user role:', error);
      setIsAdmin(false);
    }
  };

  const loadUserSubscription = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select(`
          status,
          expires_at,
          subscription_tiers (
            name,
            max_duration_minutes,
            features
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'active')
        .maybeSingle();

      if (error) throw error;

      if (data && data.subscription_tiers) {
        const tier = data.subscription_tiers as any;
        setSubscription({
          tier: tier.name,
          maxDuration: tier.max_duration_minutes,
          status: data.status,
          features: tier.features || {}
        });
      } else {
        setSubscription(null);
      }
    } catch (error) {
      console.error('Error loading subscription:', error);
      setSubscription(null);
    }
  };

  const refreshUserData = async () => {
    if (user) {
      await Promise.all([
        loadUserRole(user.id),
        loadUserSubscription(user.id)
      ]);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Auth session error:', error);
          setUser(null);
          setIsAdmin(false);
          setSubscription(null);
        } else {
          const currentUser = session?.user ?? null;
          setUser(currentUser);

          if (currentUser) {
            await Promise.all([
              loadUserRole(currentUser.id),
              loadUserSubscription(currentUser.id)
            ]);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
        setIsAdmin(false);
        setSubscription(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        try {
          const currentUser = session?.user ?? null;
          setUser(currentUser);

          if (currentUser) {
            await Promise.all([
              loadUserRole(currentUser.id),
              loadUserSubscription(currentUser.id)
            ]);
          } else {
            setIsAdmin(false);
            setSubscription(null);
          }
        } catch (error) {
          console.error('Auth state change error:', error);
          setUser(null);
          setIsAdmin(false);
          setSubscription(null);
        }
      })();
    });

    return () => authSubscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;

      if (data.user) {
        await supabase
          .from('user_roles')
          .insert({ user_id: data.user.id, role: 'free' });
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
    setSubscription(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAdmin,
      subscription,
      signIn,
      signUp,
      signOut,
      refreshUserData
    }}>
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
