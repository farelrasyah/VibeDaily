import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles?: { username: string; avatar_url: string }; // Jika ada tabel profiles
}

export const useComments = (articleId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  // Fetch komentar dengan pagination
  const fetchComments = async (limit = 10, offset = 0) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('comments')
      .select('*, profiles(username, avatar_url)') // Join dengan tabel profiles jika ada
      .eq('article_id', articleId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) setError(error.message);
    else setComments(data || []);
    setLoading(false);
  };

  // Tambah komentar (dengan auth)
  const addComment = async (content: string) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return setError('Login required');

    const optimisticComment: Comment = {
      id: 'temp-' + Date.now(),
      content,
      created_at: new Date().toISOString(),
      user_id: user.user.id,
    };
    setComments([optimisticComment, ...comments]); // Optimistik update

    const { data, error } = await supabase
      .from('comments')
      .insert([{ article_id: articleId, user_id: user.user.id, content }])
      .select();

    if (error) {
      setError(error.message);
      setComments(comments); // Revert jika gagal
    } else {
      setComments([data[0], ...comments.filter(c => !c.id.startsWith('temp-'))]);
    }
  };

  // Edit komentar (cek pemilik)
  const editComment = async (id: string, newContent: string) => {
    const { data, error } = await supabase
      .from('comments')
      .update({ content: newContent })
      .eq('id', id)
      .select();

    if (error) setError(error.message);
    else setComments(comments.map(c => c.id === id ? data[0] : c));
  };

  // Hapus komentar (cek pemilik)
  const deleteComment = async (id: string) => {
    const { error } = await supabase.from('comments').delete().eq('id', id);
    if (error) setError(error.message);
    else setComments(comments.filter(c => c.id !== id));
  };

  // Realtime subscription
  useEffect(() => {
    fetchComments();

    const newChannel = supabase
      .channel(`comments-${articleId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'comments', filter: `article_id=eq.${articleId}` }, (payload) => {
        if (payload.eventType === 'INSERT') setComments(prev => [payload.new as Comment, ...prev]);
        else if (payload.eventType === 'UPDATE') setComments(prev => prev.map(c => c.id === payload.new.id ? payload.new as Comment : c));
        else if (payload.eventType === 'DELETE') setComments(prev => prev.filter(c => c.id !== payload.old.id));
      })
      .subscribe();

    setChannel(newChannel);
    return () => {
      supabase.removeChannel(newChannel);
    };
  }, [articleId]);

  return { comments, loading, error, addComment, editComment, deleteComment, fetchComments };
};