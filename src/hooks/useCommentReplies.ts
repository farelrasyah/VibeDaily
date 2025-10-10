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
    try {
      const { data, error } = await supabase
        .from('comment_replies')
        .select('*')
        .eq('comment_id', commentId)
        .order('created_at', { ascending: true });

      if (error) {
        setError(error.message);
      } else {
        setReplies(data || []);
      }
    } catch (err) {
      setError('Failed to fetch replies');
    }
  };

  // Add reply
  const addReply = async (content: string) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return setError('Login required');

    setLoading(true);

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
        setError(error.message);
      } else {
        setReplies(prev => [...prev, data]);
      }
    } catch (err) {
      setError('Failed to add reply');
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
    fetchReplies();

    // Subscribe to realtime changes
    const channel = supabase
      .channel(`comment-replies-${commentId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'comment_replies',
        filter: `comment_id=eq.${commentId}`
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setReplies(prev => [...prev, payload.new as CommentReply]);
        } else if (payload.eventType === 'DELETE') {
          setReplies(prev => prev.filter(reply => reply.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [commentId]);

  return { replies, loading, error, addReply, deleteReply };
};