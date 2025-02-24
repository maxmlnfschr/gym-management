import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/features/shared/stores/authStore';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { setUser, setInitialized, initialized } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        
        if (!session?.user && 
            !location.pathname.includes('/login') && 
            !location.pathname.includes('/register')) {
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        navigate('/login', { replace: true });
      } finally {
        setInitialized(true);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      
      if (event === 'SIGNED_OUT') {
        navigate('/login', { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, setInitialized, navigate, location.pathname]);

  if (!initialized) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
};