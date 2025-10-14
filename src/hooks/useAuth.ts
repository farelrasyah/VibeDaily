import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        console.log('Current user:', data.user);
        setUser(data.user);
      } catch (error) {
        console.error('Auth error:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    getUser();

    try {
      const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
        console.log('Auth state change:', event, session?.user);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      return () => listener.subscription.unsubscribe();
    } catch (error) {
      console.error('Auth listener error:', error);
      return () => {};
    }
  }, []);

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.href, // Redirect back to current page
      },
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return { user, loading, signInWithGoogle, signOut };
};