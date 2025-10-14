import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// For build time, use dummy values if environment variables are not available
const url = supabaseUrl || 'https://dummy.supabase.co';
const key = supabaseAnonKey || 'dummy-key';

export const supabase = createClient(url, key);