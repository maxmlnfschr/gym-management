import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/features/shared/stores/authStore';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { setUser, setInitialized } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Current session state:', {
          hasSession: !!session,
          user: session?.user,
          token: session?.access_token ? `${session.access_token.substring(0, 20)}...` : null,
          expiresAt: session?.expires_at
        });
        setUser(session?.user ?? null);
        setInitialized(true);
      } catch (error) {
        console.error('Auth initialization error:', error);
        setInitialized(true);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event);
      console.log('Session after event:', {
        hasSession: !!session,
        user: session?.user,
        token: session?.access_token ? `${session.access_token.substring(0, 20)}...` : null,
        expiresAt: session?.expires_at
      });
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setUser, setInitialized]);

  return <>{children}</>;
};