import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Bookmark {
  id: string;
  user_id: string;
  article_id: string;
  created_at: string;
}

export const useBookmarks = (articleId: string) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cek apakah article sudah di-bookmark user
  const checkBookmarkStatus = async () => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      setIsBookmarked(false);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', user.user.id)
      .eq('article_id', articleId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      setError(error.message);
    } else {
      setIsBookmarked(!!data);
    }
    setLoading(false);
  };

  // Toggle bookmark (add/remove)
  const toggleBookmark = async () => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      setError('Login required');
      return false;
    }

    if (isBookmarked) {
      // Remove bookmark
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', user.user.id)
        .eq('article_id', articleId);

      if (error) {
        setError(error.message);
        return false;
      }
    } else {
      // Add bookmark
      const { error } = await supabase
        .from('bookmarks')
        .insert([{
          user_id: user.user.id,
          article_id: articleId,
        }]);

      if (error) {
        setError(error.message);
        return false;
      }
    }

    // Update local state
    setIsBookmarked(!isBookmarked);
    return true;
  };

  // Check status saat mount dan saat user berubah
  useEffect(() => {
    checkBookmarkStatus();
  }, [articleId]);

  // Listen to auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkBookmarkStatus();
    });

    return () => subscription.unsubscribe();
  }, [articleId]);

  return {
    isBookmarked,
    loading,
    error,
    toggleBookmark
  };
};