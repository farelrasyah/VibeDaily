import { newsApiOrg } from './newsapi-org';
import { beritaIndo } from './berita-indo';
import { NewsArticle } from '@/types/news.types';

/**
 * Unified News Service
 * Facade untuk simplify penggunaan kedua API
 */
class NewsService {
  /**
   * Get mixed news (Indonesia + International)
   */
  async getMixedNews(limit: number = 20): Promise<NewsArticle[]> {
    try {
      const [indonesiaResult, internationalResult] = await Promise.allSettled([
        beritaIndo.getAllIndonesiaNews(),
        newsApiOrg.getTopHeadlines({ country: 'us', pageSize: 10 }),
      ]);

      const articles: NewsArticle[] = [];

      if (indonesiaResult.status === 'fulfilled' && indonesiaResult.value.success) {
        articles.push(...indonesiaResult.value.data.slice(0, limit / 2));
      }

      if (internationalResult.status === 'fulfilled' && internationalResult.value.success) {
        articles.push(...internationalResult.value.data.slice(0, limit / 2));
      }

      // Shuffle and limit
      return articles
        .sort(() => Math.random() - 0.5)
        .slice(0, limit);
    } catch (error) {
      console.error('Mixed news error:', error);
      return [];
    }
  }

  /**
   * Get news by language
   */
  async getNewsByLanguage(
    language: 'id' | 'en',
    limit: number = 20
  ): Promise<NewsArticle[]> {
    try {
      if (language === 'id') {
        const result = await beritaIndo.getAllIndonesiaNews();
        return result.success ? result.data.slice(0, limit) : [];
      } else {
        const result = await newsApiOrg.getTopHeadlines({
          country: 'us',
          pageSize: limit,
        });
        return result.success ? result.data : [];
      }
    } catch (error) {
      console.error('Get news by language error:', error);
      return [];
    }
  }

  /**
   * Search across both APIs
   */
  async searchAllNews(query: string, limit: number = 20): Promise<NewsArticle[]> {
    try {
      const [indonesiaResult, internationalResult] = await Promise.allSettled([
        beritaIndo.getAllIndonesiaNews(),
        newsApiOrg.searchNews({ query, pageSize: limit }),
      ]);

      const articles: NewsArticle[] = [];

      if (indonesiaResult.status === 'fulfilled' && indonesiaResult.value.success) {
        // Filter Indonesia news by query
        const filtered = indonesiaResult.value.data.filter((article) =>
          article.title.toLowerCase().includes(query.toLowerCase())
        );
        articles.push(...filtered);
      }

      if (internationalResult.status === 'fulfilled' && internationalResult.value.success) {
        articles.push(...internationalResult.value.data);
      }

      return articles.slice(0, limit);
    } catch (error) {
      console.error('Search all news error:', error);
      return [];
    }
  }

  /**
   * Get trending news (combine both APIs)
   */
  async getTrendingNews(limit: number = 10): Promise<NewsArticle[]> {
    try {
      const [indonesiaResult, internationalResult] = await Promise.allSettled([
        beritaIndo.getTrendingNews(),
        newsApiOrg.getTopHeadlines({ country: 'us', pageSize: 5 }),
      ]);

      const articles: NewsArticle[] = [];

      if (indonesiaResult.status === 'fulfilled' && indonesiaResult.value.success) {
        articles.push(...indonesiaResult.value.data.slice(0, limit / 2));
      }

      if (internationalResult.status === 'fulfilled' && internationalResult.value.success) {
        articles.push(...internationalResult.value.data.slice(0, limit / 2));
      }

      return articles.slice(0, limit);
    } catch (error) {
      console.error('Trending news error:', error);
      return [];
    }
  }
}

export const newsService = new NewsService();

// Export individual services
export { newsApiOrg, beritaIndo };
