import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface CommentReply {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  comment_id: string;
  username?: string;
  avatar_url?: string;
}

export const useCommentReplies = (commentId: string) => {
  const [replies, setReplies] = useState<CommentReply[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch replies
  const fetchReplies = async () => {
    if (!commentId) {
      console.log('useCommentReplies: commentId is empty, skipping fetch');
      return;
    }

    console.log('useCommentReplies: Fetching replies for commentId:', commentId);

    try {
      const { data, error } = await supabase
        .from('comment_replies')
        .select('*')
        .eq('comment_id', commentId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('useCommentReplies: Error fetching replies:', error);
        setError(error.message);
      } else {
        console.log('useCommentReplies: Fetched replies:', data?.length || 0, 'items');
        setReplies(data || []);
      }
    } catch (err) {
      console.error('useCommentReplies: Failed to fetch replies:', err);
      setError('Failed to fetch replies');
    }
  };

  // Add reply
  const addReply = async (content: string) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return setError('Login required');

    setLoading(true);
    console.log('useCommentReplies: Starting addReply for commentId:', commentId);

    // Create optimistic reply object
    const optimisticReply: CommentReply = {
      id: `temp-${Date.now()}`, // Temporary ID
      comment_id: commentId,
      user_id: user.user.id,
      content,
      username: user.user.user_metadata?.name || user.user.user_metadata?.full_name || user.user.email || 'Anonymous',
      avatar_url: user.user.user_metadata?.picture || user.user.user_metadata?.avatar_url || user.user.user_metadata?.avatar || null,
      created_at: new Date().toISOString(),
    };

    console.log('useCommentReplies: Adding optimistic reply:', optimisticReply);

    // Optimistic update: add to local state immediately
    setReplies(prev => {
      const exists = prev.some(reply => reply.id === optimisticReply.id);
      if (!exists) {
        return [...prev, optimisticReply].sort((a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      }
      return prev;
    });

    try {
      const { data, error } = await supabase
        .from('comment_replies')
        .insert({
          comment_id: commentId,
          user_id: user.user.id,
          content,
          username: user.user.user_metadata?.name || user.user.user_metadata?.full_name || user.user.email || 'Anonymous',
          avatar_url: user.user.user_metadata?.picture || user.user.user_metadata?.avatar_url || user.user.user_metadata?.avatar || null,
        })
        .select()
        .single();

      if (error) {
        console.error('useCommentReplies: Error inserting reply:', error);
        setError(error.message);
        // Remove optimistic reply on error
        setReplies(prev => prev.filter(reply => reply.id !== optimisticReply.id));
      } else {
        console.log('useCommentReplies: Reply inserted successfully:', data);
        // Replace optimistic reply with real data
        setReplies(prev => {
          const filtered = prev.filter(reply => reply.id !== optimisticReply.id);
          return [...filtered, data].sort((a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        });
      }
    } catch (err) {
      console.error('useCommentReplies: Failed to add reply:', err);
      setError('Failed to add reply');
      // Remove optimistic reply on error
      setReplies(prev => prev.filter(reply => reply.id !== optimisticReply.id));
    } finally {
      setLoading(false);
    }
  };

  // Delete reply
  const deleteReply = async (replyId: string) => {
    try {
      const { error } = await supabase
        .from('comment_replies')
        .delete()
        .eq('id', replyId);

      if (error) {
        setError(error.message);
      } else {
        setReplies(prev => prev.filter(reply => reply.id !== replyId));
      }
    } catch (err) {
      setError('Failed to delete reply');
    }
  };

  useEffect(() => {
    console.log('useCommentReplies: Setting up for commentId:', commentId);
    if (!commentId) {
      console.log('useCommentReplies: No commentId provided, skipping setup');
      return;
    }

    fetchReplies();

    // Subscribe to realtime changes with unique channel name
    const channelName = `comment-replies-${commentId}-${Date.now()}`;
    console.log('useCommentReplies: Creating channel:', channelName);

    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'comment_replies',
        filter: `comment_id=eq.${commentId}`
      }, (payload) => {
        console.log('useCommentReplies: Real-time event received:', payload);
        console.log('useCommentReplies: Event type:', payload.eventType);
        console.log('useCommentReplies: Payload data:', payload.new || payload.old);

        if (payload.eventType === 'INSERT') {
          console.log('useCommentReplies: Adding reply via real-time:', payload.new);
          setReplies(prev => {
            // Check if reply already exists to avoid duplicates
            const exists = prev.some(reply => reply.id === payload.new.id);
            if (!exists) {
              console.log('useCommentReplies: Reply added to state:', payload.new.id);
              return [...prev, payload.new as CommentReply].sort((a, b) =>
                new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
              );
            }
            console.log('useCommentReplies: Reply already exists, skipping:', payload.new.id);
            return prev;
          });
        } else if (payload.eventType === 'DELETE') {
          console.log('useCommentReplies: Deleting reply via real-time:', payload.old.id);
          setReplies(prev => prev.filter(reply => reply.id !== payload.old.id));
        }
      })
      .subscribe((status, err) => {
        console.log('useCommentReplies: Subscription status:', status);
        if (err) {
          console.error('useCommentReplies: Subscription error:', err);
        }
        if (status === 'SUBSCRIBED') {
          console.log('useCommentReplies: Successfully subscribed to real-time updates');
        } else if (status === 'CLOSED') {
          console.log('useCommentReplies: Subscription closed');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('useCommentReplies: Channel error:', err);
        }
      });

    return () => {
      console.log('useCommentReplies: Unsubscribing from channel:', channelName);
      supabase.removeChannel(channel);
    };
  }, [commentId]);

  return { replies, loading, error, addReply, deleteReply };
};