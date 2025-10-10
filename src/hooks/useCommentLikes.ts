import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export const useCommentLikes = (commentId: string) => {
  const [likesCount, setLikesCount] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch likes count and user like status
  const fetchLikes = async () => {
    try {
      // Get current user
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      // Get likes count
      const { count } = await supabase
        .from('comment_likes')
        .select('*', { count: 'exact', head: true })
        .eq('comment_id', commentId);

      // Check if user liked
      const { data: userLike } = await supabase
        .from('comment_likes')
        .select('id')
        .eq('comment_id', commentId)
        .eq('user_id', user.user.id)
        .single();

      setLikesCount(count || 0);
      setUserLiked(!!userLike);
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  };

  // Toggle like
  const toggleLike = async () => {
    if (loading) return;

    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return;

    setLoading(true);

    try {
      if (userLiked) {
        // Unlike
        const { error } = await supabase
          .from('comment_likes')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', user.user.id);

        if (!error) {
          setLikesCount(prev => prev - 1);
          setUserLiked(false);
        }
      } else {
        // Like
        const { error } = await supabase
          .from('comment_likes')
          .insert({
            comment_id: commentId,
            user_id: user.user.id
          });

        if (!error) {
          setLikesCount(prev => prev + 1);
          setUserLiked(true);
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLikes();

    // Subscribe to realtime changes
    const channel = supabase
      .channel(`comment-likes-${commentId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'comment_likes',
        filter: `comment_id=eq.${commentId}`
      }, () => {
        fetchLikes(); // Refetch on any change
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [commentId]);

  return { likesCount, userLiked, loading, toggleLike };
};