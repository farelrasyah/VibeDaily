import { useState, useEffect } from 'react';

export const useSupabaseCheck = () => {
  const [isSupabaseAvailable, setIsSupabaseAvailable] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if Supabase environment variables are available
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    const available = !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://dummy.supabase.co');
    setIsSupabaseAvailable(available);
    setLoading(false);
  }, []);

  return { isSupabaseAvailable, loading };
};