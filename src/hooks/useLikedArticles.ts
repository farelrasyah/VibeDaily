import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { NewsArticle } from '@/types/news.types';

export const useLikedArticles = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLikedArticles = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        setArticles([]);
        setLoading(false);
        return;
      }

      // Get all liked article IDs for the current user
      const { data: likes, error: likesError } = await supabase
        .from('likes')
        .select('article_id')
        .eq('user_id', user.user.id);

      if (likesError) {
        setError(likesError.message);
        setLoading(false);
        return;
      }

      if (!likes || likes.length === 0) {
        setArticles([]);
        setLoading(false);
        return;
      }

      // Get article details from our API for each liked article
      const articlePromises = likes.map(async (like) => {
        try {
          const response = await fetch(`/api/article/${like.article_id}`);
          if (response.ok) {
            const data = await response.json();
            console.log(`✅ Fetched article ${like.article_id}:`, data.article?.title);
            return data.article; // Return the article object directly
          } else {
            console.error(`❌ Failed to fetch article ${like.article_id}:`, response.status, response.statusText);
            return null;
          }
        } catch (err) {
          console.error(`❌ Error fetching article ${like.article_id}:`, err);
          return null;
        }
      });

      const articlesData = await Promise.all(articlePromises);
      const validArticles = articlesData.filter(article => article !== null && article.title); // Filter out nulls and articles without title

      console.log(`✅ Successfully loaded ${validArticles.length} liked articles out of ${likes.length} likes`);
      setArticles(validArticles);
    } catch (err) {
      setError('Failed to fetch liked articles');
      console.error('Error fetching liked articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLikedArticles();
  }, []);

  return { articles, loading, error, refetch: fetchLikedArticles };
};