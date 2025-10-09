import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

interface Like {
  id: string;
  user_id: string;
  article_id: string;
  created_at: string;
}

export const useLikes = (articleId: string) => {
  const [likes, setLikes] = useState<Like[]>([]);
  const [userLiked, setUserLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  // Fetch likes untuk article ini
  const fetchLikes = async () => {
    console.log('Fetching likes for article:', articleId);
    setLoading(true);
    const { data, error } = await supabase
      .from('likes')
      .select('*')
      .eq('article_id', articleId);

    if (error) {
      console.error('Error fetching likes:', error);
      setError(error.message);
    } else {
      console.log('Fetched likes:', data);
      // Only update if we don't have optimistic updates
      const hasOptimistic = likes.some(like => like.id.startsWith('temp-'));
      if (!hasOptimistic) {
        setLikes(data || []);
        // Cek apakah user sudah like
        const { data: user } = await supabase.auth.getUser();
        if (user.user) {
          setUserLiked(data?.some(like => like.user_id === user.user.id) || false);
        }
      }
    }
    setLoading(false);
  };

  // Toggle like (add/remove) with optimistic updates
  const toggleLike = async () => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      setError('Login required');
      return false;
    }

    const isLiked = likes.some(like => like.user_id === user.user.id);
    const currentUserId = user.user.id;

    console.log('Toggle like - current likes:', likes.length, 'isLiked:', isLiked);

    // Optimistic update
    if (isLiked) {
      // Remove like optimistically
      setLikes(prev => prev.filter(like => like.user_id !== currentUserId));
      setUserLiked(false);
      console.log('Optimistic remove - likes now:', likes.length - 1);
    } else {
      // Add like optimistically
      const optimisticLike: Like = {
        id: `temp-${Date.now()}`,
        user_id: currentUserId,
        article_id: articleId,
        created_at: new Date().toISOString(),
      };
      setLikes(prev => [...prev, optimisticLike]);
      setUserLiked(true);
      console.log('Optimistic add - likes now:', likes.length + 1);
    }

    try {
      if (isLiked) {
        // Remove like from database
        const likeToRemove = likes.find(like => like.user_id === currentUserId);
        if (likeToRemove && !likeToRemove.id.startsWith('temp-')) {
          const { error } = await supabase
            .from('likes')
            .delete()
            .eq('id', likeToRemove.id);

          if (error) throw error;
        }
      } else {
        // Add like to database
        const { error } = await supabase
          .from('likes')
          .insert([{
            user_id: currentUserId,
            article_id: articleId,
          }]);

        if (error) throw error;
      }
    } catch (error: any) {
      // Revert optimistic update on error
      setError(error.message);
      // Revert likes
      if (isLiked) {
        setLikes(prev => [...prev, likes.find(like => like.user_id === currentUserId)!]);
        setUserLiked(true);
      } else {
        setLikes(prev => prev.filter(like => !like.id.startsWith('temp-')));
        setUserLiked(false);
      }
      return false;
    }

    return true;
  };

  // Realtime subscription
  useEffect(() => {
    fetchLikes();

    const newChannel = supabase
      .channel(`likes-${articleId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'likes'
      }, async (payload) => {
        console.log('Realtime like event:', payload.eventType, payload);

        // Filter by article_id on client side
        if (payload.new && (payload.new as Like).article_id !== articleId) return;
        if (payload.old && (payload.old as Like).article_id !== articleId) return;

        if (payload.eventType === 'INSERT') {
          const newLike = payload.new as Like;
          console.log('New like inserted:', newLike);
          setLikes(prev => {
            // Remove any temp likes from same user and add the real one
            const filtered = prev.filter(like =>
              !(like.user_id === newLike.user_id && like.id.startsWith('temp-'))
            );
            console.log('Updated likes after insert:', [...filtered, newLike]);
            return [...filtered, newLike];
          });
          // Update userLiked if this is the current user
          const { data: user } = await supabase.auth.getUser();
          if (user.user && newLike.user_id === user.user.id) {
            setUserLiked(true);
          }
        } else if (payload.eventType === 'DELETE') {
          const deletedLike = payload.old as Like;
          console.log('Like deleted:', deletedLike);
          setLikes(prev => {
            const filtered = prev.filter(like => like.id !== deletedLike.id);
            console.log('Updated likes after delete:', filtered);
            return filtered;
          });
          // Update userLiked if this is the current user
          const { data: user } = await supabase.auth.getUser();
          if (user.user && deletedLike.user_id === user.user.id) {
            setUserLiked(false);
          }
        }
      })
      .subscribe();

    setChannel(newChannel);
    return () => {
      supabase.removeChannel(newChannel);
    };
  }, [articleId]);

  return {
    likes,
    likeCount: likes.length,
    userLiked,
    loading,
    error,
    toggleLike
  };
};