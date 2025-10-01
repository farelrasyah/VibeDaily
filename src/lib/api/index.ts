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

  /**
   * Get single article by ID or URL
   */
  async getArticleById(id: string): Promise<NewsArticle | null> {
    try {
      console.log('🔍 Searching for article with ID:', id);
      
      // First check if the ID looks like a URL (for backward compatibility)
      if (id.startsWith('http')) {
        console.log('📎 ID looks like URL, searching by URL...');
        return await this.getArticleByUrl(id);
      }

      // Try to get all articles and find by ID
      console.log('📰 Fetching all articles to find by ID...');
      const allArticles = await this.getMixedNews(200); // Get more articles to find the one
      console.log(`📊 Total articles fetched: ${allArticles.length}`);
      
      // Log sample of article IDs for debugging
      console.log('🔍 Sample article IDs:', allArticles.slice(0, 5).map(a => ({ id: a.id, title: a.title.substring(0, 50) })));
      
      const article = allArticles.find(article => article.id === id);
      
      if (article) {
        console.log('✅ Article found by ID!', article.title);
        return article;
      }

      console.log('❌ Article not found by ID, trying search...');
      // If not found, try searching by partial match
      const searchResults = await this.searchArticleById(id);
      return searchResults.length > 0 ? searchResults[0] : null;
    } catch (error) {
      console.error('Get article by ID error:', error);
      return null;
    }
  }

  /**
   * Get article by original URL (for backward compatibility)
   */
  private async getArticleByUrl(url: string): Promise<NewsArticle | null> {
    try {
      const [indonesiaResult, internationalResult] = await Promise.allSettled([
        beritaIndo.getAllIndonesiaNews(),
        newsApiOrg.getTopHeadlines({ country: 'us', pageSize: 100 }),
      ]);

      // Search in Indonesia articles
      if (indonesiaResult.status === 'fulfilled' && indonesiaResult.value.success) {
        const found = indonesiaResult.value.data.find(article => article.url === url);
        if (found) return found;
      }

      // Search in international articles
      if (internationalResult.status === 'fulfilled' && internationalResult.value.success) {
        const found = internationalResult.value.data.find(article => article.url === url);
        if (found) return found;
      }

      return null;
    } catch (error) {
      console.error('Get article by URL error:', error);
      return null;
    }
  }

  /**
   * Search article by partial ID match
   */
  private async searchArticleById(id: string): Promise<NewsArticle[]> {
    try {
      const [indonesiaResult, internationalResult] = await Promise.allSettled([
        beritaIndo.getAllIndonesiaNews(),
        newsApiOrg.getTopHeadlines({ country: 'us', pageSize: 100 }),
      ]);

      const allArticles: NewsArticle[] = [];

      if (indonesiaResult.status === 'fulfilled' && indonesiaResult.value.success) {
        allArticles.push(...indonesiaResult.value.data);
      }

      if (internationalResult.status === 'fulfilled' && internationalResult.value.success) {
        allArticles.push(...internationalResult.value.data);
      }

      // Find articles with similar ID or title containing keywords from ID
      const keywords = id.replace(/-/g, ' ').split(' ').filter(word => word.length > 2);
      
      return allArticles.filter(article => {
        // Exact ID match
        if (article.id === id) return true;
        
        // Partial ID match
        if (article.id.includes(id) || id.includes(article.id)) return true;
        
        // Title keyword match
        return keywords.some(keyword => 
          article.title.toLowerCase().includes(keyword.toLowerCase())
        );
      });
    } catch (error) {
      console.error('Search article by ID error:', error);
      return [];
    }
  }
}

export const newsService = new NewsService();

// Export individual services
export { newsApiOrg, beritaIndo };
