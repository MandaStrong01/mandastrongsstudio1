import { useAuth as useAuthContext } from '../contexts/AuthContext';

export function useAuth() {
  const authContext = useAuthContext();

  const isAuthenticated = !!authContext.user;

  const profile = authContext.user ? {
    id: authContext.user.id,
    email: authContext.user.email,
    plan: authContext.subscription?.tier || 'free',
    name: authContext.user.user_metadata?.name || authContext.user.email?.split('@')[0] || 'User'
  } : null;

  const signUp = async (email: string, password: string, name: string) => {
    const result = await authContext.signUp(email, password);
    if (!result.error && name) {
      await authContext.refreshUserData();
    }
    return result;
  };

  const getPlanDisplayName = () => {
    if (!authContext.subscription) {
      return 'Free';
    }
    const tier = authContext.subscription.tier.toLowerCase();
    if (tier === 'studio') return 'Studio';
    if (tier === 'pro') return 'Pro';
    if (tier === 'admin') return 'Admin';
    return 'Free';
  };

  return {
    user: authContext.user,
    loading: authContext.loading,
    isAuthenticated,
    isAdmin: authContext.isAdmin,
    profile,
    subscription: authContext.subscription,
    signIn: authContext.signIn,
    signUp,
    signOut: authContext.signOut,
    refreshUserData: authContext.refreshUserData,
    getPlanDisplayName
  };
}
