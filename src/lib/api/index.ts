import { newsApiOrg } from './newsapi-org';
import { beritaIndo } from './berita-indo';
import { NewsArticle } from '@/types/news.types';

// Simple in-memory cache for articles
const articleCache = new Map<string, NewsArticle>();
const cacheExpiry = new Map<string, number>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

/**
 * Unified News Service
 * Facade untuk simplify penggunaan kedua API
 */
class NewsService {
  /**
   * Get mixed news (Indonesia + International) from multiple sources
   */
  async getMixedNews(limit: number = 20): Promise<NewsArticle[]> {
    try {
      // For larger limits, prioritize Indonesian articles since that's where the missing articles likely are
      const indonesiaLimit = Math.max(Math.floor(limit * 0.8), limit - 20); // 80% Indonesian, minimum all but 20
      
      // Fetch from multiple international sources
      const [indonesiaResult, usResult, ukResult, generalResult] = await Promise.allSettled([
        beritaIndo.getAllIndonesiaNews(),
        newsApiOrg.getTopHeadlines({ country: 'us', pageSize: 8 }),
        newsApiOrg.getTopHeadlines({ country: 'gb', pageSize: 4 }),
        newsApiOrg.getTopHeadlines({ pageSize: 8 }), // General top headlines
      ]);

      const articles: NewsArticle[] = [];

      // Add Indonesian articles (prioritized for larger searches)
      if (indonesiaResult.status === 'fulfilled' && indonesiaResult.value.success) {
        const indonesianArticles = indonesiaResult.value.data.slice(0, indonesiaLimit);
        articles.push(...indonesianArticles);
        console.log(`Added ${indonesianArticles.length} Indonesian articles`);
        
        // Cache all Indonesian articles since they're more likely to be requested
        indonesianArticles.forEach(article => {
          if (!articleCache.has(article.id)) {
            articleCache.set(article.id, article);
            cacheExpiry.set(article.id, Date.now() + CACHE_DURATION);
          }
        });
      }

      // Add international articles from various sources
      const internationalArticles: NewsArticle[] = [];
      
      if (usResult.status === 'fulfilled' && usResult.value.success) {
        internationalArticles.push(...usResult.value.data.slice(0, 4));
      }
      if (ukResult.status === 'fulfilled' && ukResult.value.success) {
        internationalArticles.push(...ukResult.value.data.slice(0, 2));
      }
      if (generalResult.status === 'fulfilled' && generalResult.value.success) {
        internationalArticles.push(...generalResult.value.data.slice(0, 4));
      }

      // Shuffle international articles and add up to remaining limit
      const remainingLimit = limit - articles.length;
      const shuffledInternational = internationalArticles
        .sort(() => Math.random() - 0.5)
        .slice(0, remainingLimit);
      
      articles.push(...shuffledInternational);
      console.log(`Added ${shuffledInternational.length} international articles`);

      // Final shuffle and return
      const finalArticles = articles
        .sort(() => Math.random() - 0.5)
        .slice(0, limit);

      // Cache all articles for future lookups
      finalArticles.forEach(article => {
        if (!articleCache.has(article.id)) {
          articleCache.set(article.id, article);
          cacheExpiry.set(article.id, Date.now() + CACHE_DURATION);
        }
      });

      console.log(`✅ Mixed news: returning ${finalArticles.length} articles total`);
      return finalArticles;
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
   * Get trending news from multiple sources
   */
  async getTrendingNews(limit: number = 10): Promise<NewsArticle[]> {
    try {
      const halfLimit = Math.floor(limit / 2);
      
      // Fetch trending from multiple international sources
      const [indonesiaResult, usResult, generalResult, techResult] = await Promise.allSettled([
        beritaIndo.getTrendingNews(),
        newsApiOrg.getTopHeadlines({ country: 'us', pageSize: 4 }),
        newsApiOrg.getTopHeadlines({ pageSize: 4 }),
        newsApiOrg.getTopHeadlines({ category: 'technology', pageSize: 3 }),
      ]);

      const articles: NewsArticle[] = [];

      // Add Indonesian trending articles
      if (indonesiaResult.status === 'fulfilled' && indonesiaResult.value.success) {
        articles.push(...indonesiaResult.value.data.slice(0, halfLimit));
      }

      // Combine international trending articles
      const internationalArticles: NewsArticle[] = [];
      
      if (usResult.status === 'fulfilled' && usResult.value.success) {
        internationalArticles.push(...usResult.value.data);
      }
      if (generalResult.status === 'fulfilled' && generalResult.value.success) {
        internationalArticles.push(...generalResult.value.data);
      }
      if (techResult.status === 'fulfilled' && techResult.value.success) {
        internationalArticles.push(...techResult.value.data);
      }

      // Add international articles
      const remainingLimit = limit - articles.length;
      const shuffledInternational = internationalArticles
        .sort(() => Math.random() - 0.5)
        .slice(0, remainingLimit);
      
      articles.push(...shuffledInternational);

      // Sort by publish date (most recent first)
      return articles
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        .slice(0, limit);
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
      
      // Check cache first
      const cached = articleCache.get(id);
      const cacheTime = cacheExpiry.get(id);
      if (cached && cacheTime && Date.now() < cacheTime) {
        console.log('💾 Article found in cache!', cached.title);
        return cached;
      }
      
      // First check if the ID looks like a URL (for backward compatibility)
      if (id.startsWith('http') || id.includes('%3A%2F%2F')) {
        console.log('📎 ID looks like URL, searching by URL...');
        // Decode URL if it's encoded
        const decodedUrl = id.includes('%3A%2F%2F') ? decodeURIComponent(id) : id;
        console.log('🔗 Decoded URL:', decodedUrl);
        const article = await this.getArticleByUrl(decodedUrl);
        if (article) {
          // Cache the result
          articleCache.set(id, article);
          cacheExpiry.set(id, Date.now() + CACHE_DURATION);
        }
        return article;
      }

      // Try multiple fetch attempts with different limits to increase chances
      const fetchAttempts = [200, 300, 400]; // Increased limits to get more article coverage
      
      for (let attempt = 0; attempt < fetchAttempts.length; attempt++) {
        console.log(`📰 Fetching articles (attempt ${attempt + 1}/${fetchAttempts.length}) with limit ${fetchAttempts[attempt]}...`);
        
        const allArticles = await this.getMixedNews(fetchAttempts[attempt]);
        console.log(`📊 Total articles fetched: ${allArticles.length}`);
        
        // Cache all articles for future lookups
        allArticles.forEach(article => {
          if (!articleCache.has(article.id)) {
            articleCache.set(article.id, article);
            cacheExpiry.set(article.id, Date.now() + CACHE_DURATION);
          }
        });
        
        // Log sample of article IDs for debugging
        if (attempt === 0) {
          console.log('🔍 Sample article IDs:', allArticles.slice(0, 5).map(a => ({ id: a.id, title: a.title.substring(0, 50) })));
        }
        
        // First try exact ID match
        let article = allArticles.find(article => article.id === id);
        
        if (article) {
          console.log('✅ Article found by exact ID!', article.title);
          return article;
        }

        // Try to match legacy ID patterns by extracting the meaningful part
        console.log(`❌ No exact ID match found in attempt ${attempt + 1}, trying legacy ID pattern...`);
        
        const idParts = id.split('-');
        if (idParts.length > 1) {
          // Extract the main slug without the hash (last part)
          const slugWithoutHash = idParts.slice(0, -1).join('-');
          
          article = allArticles.find(article => {
            const articleParts = article.id.split('-');
            if (articleParts.length > 1) {
              const articleSlugWithoutHash = articleParts.slice(0, -1).join('-');
              return articleSlugWithoutHash === slugWithoutHash;
            }
            return false;
          });
          
          if (article) {
            console.log('✅ Article found by legacy ID pattern!', article.title);
            // Cache with the requested ID
            articleCache.set(id, article);
            cacheExpiry.set(id, Date.now() + CACHE_DURATION);
            return article;
          }
        }
      }

      // Final attempt: search in cache for similar articles
      console.log('🔍 Searching in cache for similar articles...');
      for (const [cachedId, cachedArticle] of articleCache.entries()) {
        // Try exact match first
        if (cachedId === id) {
          console.log('✅ Article found in cache!', cachedArticle.title);
          return cachedArticle;
        }
        
        // Try slug match
        const idParts = id.split('-');
        const cachedIdParts = cachedId.split('-');
        if (idParts.length > 1 && cachedIdParts.length > 1) {
          const slugWithoutHash = idParts.slice(0, -1).join('-');
          const cachedSlugWithoutHash = cachedIdParts.slice(0, -1).join('-');
          if (slugWithoutHash === cachedSlugWithoutHash) {
            console.log('✅ Article found in cache by slug match!', cachedArticle.title);
            // Cache with the requested ID
            articleCache.set(id, cachedArticle);
            cacheExpiry.set(id, Date.now() + CACHE_DURATION);
            return cachedArticle;
          }
        }
      }

      console.log('❌ No article found with exact or legacy ID matching');
      return null;
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

      console.log('🔍 Searching for URL:', url);

      // Search in Indonesia articles
      if (indonesiaResult.status === 'fulfilled' && indonesiaResult.value.success) {
        console.log(`📊 Checking ${indonesiaResult.value.data.length} Indonesia articles`);
        // Log sample URLs for debugging
        console.log('🔍 Sample Indonesia URLs:', indonesiaResult.value.data.slice(0, 3).map(a => a.url));
        
        const found = indonesiaResult.value.data.find(article => article.url === url);
        if (found) {
          console.log('✅ Found in Indonesia articles:', found.title);
          return found;
        }
      }

      // Search in international articles
      if (internationalResult.status === 'fulfilled' && internationalResult.value.success) {
        console.log(`📊 Checking ${internationalResult.value.data.length} international articles`);
        // Log sample URLs for debugging
        console.log('🔍 Sample international URLs:', internationalResult.value.data.slice(0, 3).map(a => a.url));
        
        const found = internationalResult.value.data.find(article => article.url === url);
        if (found) {
          console.log('✅ Found in international articles:', found.title);
          return found;
        }
      }

      console.log('❌ Article not found by exact URL match');
      return null;
    } catch (error) {
      console.error('Get article by URL error:', error);
      return null;
    }
  }
}

export const newsService = new NewsService();

// Export individual services
export { newsApiOrg, beritaIndo };
