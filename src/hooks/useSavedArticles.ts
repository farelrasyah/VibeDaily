import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { NewsArticle } from '@/types/news.types';

export const useSavedArticles = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSavedArticles = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        setArticles([]);
        setLoading(false);
        return;
      }

      // Get all bookmarked article IDs for the current user
      const { data: bookmarks, error: bookmarksError } = await supabase
        .from('bookmarks')
        .select('article_id')
        .eq('user_id', user.user.id);

      if (bookmarksError) {
        setError(bookmarksError.message);
        setLoading(false);
        return;
      }

      if (!bookmarks || bookmarks.length === 0) {
        setArticles([]);
        setLoading(false);
        return;
      }

      // Get article details from our API for each bookmarked article
      const articlePromises = bookmarks.map(async (bookmark) => {
        try {
          const response = await fetch(`/api/article/${bookmark.article_id}`);
          if (response.ok) {
            const data = await response.json();
            console.log(`✅ Fetched saved article ${bookmark.article_id}:`, data.article?.title);
            return data.article; // Return the article object directly
          } else {
            console.error(`❌ Failed to fetch article ${bookmark.article_id}:`, response.status, response.statusText);
            return null;
          }
        } catch (err) {
          console.error(`❌ Error fetching article ${bookmark.article_id}:`, err);
          return null;
        }
      });

      const articlesData = await Promise.all(articlePromises);
      const validArticles = articlesData.filter(article => article !== null && article.title); // Filter out nulls and articles without title

      console.log(`✅ Successfully loaded ${validArticles.length} saved articles out of ${bookmarks.length} bookmarks`);
      setArticles(validArticles);
    } catch (err) {
      setError('Failed to fetch saved articles');
      console.error('Error fetching saved articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedArticles();
  }, []);

  return { articles, loading, error, refetch: fetchSavedArticles };
};