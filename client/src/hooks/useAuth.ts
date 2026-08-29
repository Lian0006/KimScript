import { useAuth as useSupabaseAuth } from '../contexts/AuthContext';

export function useAuth() {
  const { user, loading, signUp, signIn, signOut, resetPassword } = useSupabaseAuth();

  return {
    user,
    isLoading: loading,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };
}
