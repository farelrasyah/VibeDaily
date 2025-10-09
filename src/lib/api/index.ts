import { beritaIndo } from './berita-indo';
import { newsApiOrg } from './newsapi-org';
import { NewsArticle } from '@/types/news.types';
import { NewsSource } from '@/lib/news-categories';

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
   * Get mixed news (Indonesia only - NewsAPI.org removed due to API key requirements)
   */
  async getMixedNews(limit: number = 20): Promise<NewsArticle[]> {
    try {
      // Only use Berita Indo API since NewsAPI.org requires paid API key
      const indonesiaResult = await beritaIndo.getAllIndonesiaNews();

      if (indonesiaResult.success) {
        const articles = indonesiaResult.data.slice(0, limit);

        // Cache all articles for future lookups
        articles.forEach(article => {
          if (!articleCache.has(article.id)) {
            articleCache.set(article.id, article);
            cacheExpiry.set(article.id, Date.now() + CACHE_DURATION);
          }
        });

        console.log(`✅ Mixed news: returning ${articles.length} Indonesian articles`);
        return articles;
      } else {
        console.error('Failed to fetch Indonesian news:', indonesiaResult.error);
        return [];
      }
    } catch (error) {
      console.error('Mixed news error:', error);
      return [];
    }
  }

  /**
   * Get news by language (Indonesia only - NewsAPI.org removed due to API key requirements)
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
        // For English, return empty array since NewsAPI.org requires paid API key
        console.log('⚠️ English news not available - NewsAPI.org requires paid API key');
        return [];
      }
    } catch (error) {
      console.error('Get news by language error:', error);
      return [];
    }
  }

  /**
   * Search across news sources with enhanced algorithm
   * Uses NewsAPI.org for better search results if API key is available
   */
  async searchAllNews(query: string, limit: number = 20): Promise<NewsArticle[]> {
    try {
      // First try NewsAPI.org if API key is configured
      if (process.env.NEWSAPI_ORG_API_KEY) {
        console.log(`🔍 Using NewsAPI.org for search: "${query}"`);
        try {
          const newsApiResult = await newsApiOrg.searchNews({
            query: query,
            language: 'id', // Prioritize Indonesian results
            sortBy: 'relevancy',
            pageSize: limit
          });
          if (newsApiResult.success && newsApiResult.data.length > 0) {
            const articles = newsApiResult.data.slice(0, limit);

            // Cache search results
            articles.forEach(article => {
              if (!articleCache.has(article.id)) {
                articleCache.set(article.id, article);
                cacheExpiry.set(article.id, Date.now() + CACHE_DURATION);
              }
            });

            console.log(`✅ NewsAPI.org search found ${articles.length} relevant articles`);
            return articles;
          }
        } catch (error) {
          console.warn('NewsAPI.org search failed, falling back to Berita Indo:', error);
        }
      }

      // Fallback to enhanced Berita Indo search
      console.log(`🔍 Using enhanced Berita Indo search for: "${query}"`);
      const indonesiaResult = await beritaIndo.getAllIndonesiaNews();

      if (indonesiaResult.success) {
        console.log(`📊 Fetched ${indonesiaResult.data.length} total articles from Berita Indo API`);

        const searchTerms = query.toLowerCase().trim().split(/\s+/);
        console.log(`🔍 Search terms:`, searchTerms);

        let filtered = indonesiaResult.data;

        // Multi-term search with scoring
        if (searchTerms.length > 1) {
          console.log(`🔍 Multi-term search (${searchTerms.length} terms)`);
          // For multi-term queries, find articles that match any of the terms
          filtered = indonesiaResult.data.filter((article) => {
            const title = article.title.toLowerCase();
            const description = (article.description || '').toLowerCase();
            const content = (article.content || '').toLowerCase();

            // Check if article contains all search terms (AND logic)
            const matches = searchTerms.every(term =>
              title.includes(term) ||
              description.includes(term) ||
              content.includes(term)
            );

            if (matches) {
              console.log(`✅ Article "${article.title.substring(0, 50)}..." matches all terms`);
            }

            return matches;
          });
        } else {
          // For single term, use more flexible matching
          const searchTerm = searchTerms[0];
          console.log(`🔍 Single term search: "${searchTerm}"`);

          filtered = indonesiaResult.data.filter((article) => {
            const title = article.title.toLowerCase();
            const description = (article.description || '').toLowerCase();
            const content = (article.content || '').toLowerCase();

            // Check multiple fields with different priorities
            const titleMatch = title.includes(searchTerm);
            const descMatch = description.includes(searchTerm);
            const contentMatch = content.includes(searchTerm);

            // Also check for partial matches (minimum 3 characters)
            const partialMatch = searchTerm.length >= 3 && (
              title.includes(searchTerm.substring(0, Math.max(3, searchTerm.length - 1))) ||
              description.includes(searchTerm.substring(0, Math.max(3, searchTerm.length - 1)))
            );

            const matches = titleMatch || descMatch || contentMatch || partialMatch;

            if (matches) {
              console.log(`✅ Article "${article.title.substring(0, 50)}..." matches (title:${titleMatch}, desc:${descMatch}, content:${contentMatch}, partial:${partialMatch})`);
            }

            return matches;
          });
        }

        console.log(`📊 After filtering: ${filtered.length} articles match the query`);

        // Sort by relevance (articles with query in title get higher priority)
        filtered.sort((a, b) => {
          const aTitle = a.title.toLowerCase();
          const bTitle = b.title.toLowerCase();
          const queryLower = query.toLowerCase();

          const aInTitle = aTitle.includes(queryLower);
          const bInTitle = bTitle.includes(queryLower);

          if (aInTitle && !bInTitle) return -1;
          if (!aInTitle && bInTitle) return 1;

          // If both have query in title, sort by position
          if (aInTitle && bInTitle) {
            return aTitle.indexOf(queryLower) - bTitle.indexOf(queryLower);
          }

          return 0;
        });

        const articles = filtered.slice(0, limit);

        console.log(`🎯 Final results: ${articles.length} articles (showing top ${limit})`);
        articles.forEach((article, index) => {
          console.log(`  ${index + 1}. "${article.title.substring(0, 60)}..." (${article.source.name})`);
        });

        // Cache search results
        articles.forEach(article => {
          if (!articleCache.has(article.id)) {
            articleCache.set(article.id, article);
            cacheExpiry.set(article.id, Date.now() + CACHE_DURATION);
          }
        });

        console.log(`✅ Enhanced Berita Indo search found ${articles.length} relevant articles from ${filtered.length} matches`);
        return articles;
      } else {
        console.error('Failed to fetch Indonesian news for search:', indonesiaResult.error);
        return [];
      }
    } catch (error) {
      console.error('Search all news error:', error);
      return [];
    }
  }

  /**
   * Get trending news (Indonesia only - NewsAPI.org removed due to API key requirements)
   */
  async getTrendingNews(limit: number = 10): Promise<NewsArticle[]> {
    try {
      // Only use Berita Indo API since NewsAPI.org requires paid API key
      const indonesiaResult = await beritaIndo.getTrendingNews();

      if (indonesiaResult.success) {
        const articles = indonesiaResult.data.slice(0, limit);

        // Cache all articles for future lookups
        articles.forEach(article => {
          if (!articleCache.has(article.id)) {
            articleCache.set(article.id, article);
            cacheExpiry.set(article.id, Date.now() + CACHE_DURATION);
          }
        });

        // Sort by publish date (most recent first)
        return articles
          .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      } else {
        console.error('Failed to fetch trending Indonesian news:', indonesiaResult.error);
        return [];
      }
    } catch (error) {
      console.error('Trending news error:', error);
      return [];
    }
  }

  /**
   * Get news by source and category (NEW METHOD for category filtering)
   */
  async getNewsBySourceAndCategory(
    source: NewsSource,
    category: string,
    limit: number = 20
  ): Promise<NewsArticle[]> {
    try {
      console.log('\n📰 NewsService API Request:')
      console.log('Parameters:')
      console.log(`  - Source: ${source}`)
      console.log(`  - Category: ${category}`)
      console.log(`  - Limit: ${limit}`)

      const result = await beritaIndo.getNewsBySourceAndCategory(source, category);
      
      console.log('\n📊 API Response:')
      console.log(`  - Success: ${result.success ? '✅ Yes' : '❌ No'}`)
      console.log(`  - Data Length: ${result.data?.length || 0} articles`)
      if (!result.success) {
        console.log(`  - Error: ${result.error || 'Unknown error'}`);
      }

      if (result.success && result.data) {
        const articles = result.data.slice(0, limit);

        // Cache all articles for future lookups
        articles.forEach(article => {
          if (!articleCache.has(article.id)) {
            articleCache.set(article.id, article);
            cacheExpiry.set(article.id, Date.now() + CACHE_DURATION);
          }
        });

        console.log(`✅ NewsService: Returning ${articles.length} articles from ${source}/${category}`);
        return articles;
      } else {
        console.error(`❌ NewsService: Failed to fetch ${source}/${category}:`, result.error);
        return [];
      }
    } catch (error) {
      console.error(`💥 NewsService: Error fetching ${source}/${category}:`, error);
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
        const article = await this.getArticleById(decodedUrl);
        if (article) {
          // Cache the result
          articleCache.set(id, article);
          cacheExpiry.set(id, Date.now() + CACHE_DURATION);
        }
        return article;
      }

      // Always fetch fresh data to ensure we have the latest articles
      console.log(`📰 Fetching fresh articles to find ID: ${id}...`);
      
      // Fetch directly from Berita Indo to get maximum articles
      const indonesiaResult = await beritaIndo.getAllIndonesiaNews();
      let allArticles: NewsArticle[] = [];
      
      if (indonesiaResult.success) {
        allArticles = indonesiaResult.data.slice(0, 1000); // Get more articles for better coverage
      }
      
      console.log(`📊 Total fresh articles fetched: ${allArticles.length}`);
      
      // Cache all articles for future lookups
      allArticles.forEach(article => {
        if (!articleCache.has(article.id)) {
          articleCache.set(article.id, article);
          cacheExpiry.set(article.id, Date.now() + CACHE_DURATION);
        }
      });
      
      // Log sample of article IDs for debugging
      if (allArticles.length > 0) {
        console.log('🔍 Sample article IDs:', allArticles.slice(0, 5).map(a => ({ id: a.id, title: a.title.substring(0, 30) })));
      }
      
      // First try exact ID match
      let article = allArticles.find(article => article.id === id);
      
      if (article) {
        console.log('✅ Article found by exact ID!', article.title);
        return article;
      }

      // Try to match legacy ID patterns by extracting the meaningful part
      console.log(`❌ No exact ID match found, trying legacy ID pattern...`);
      
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

        // Try partial slug matching (first few words)
        const partialSlug = idParts.slice(0, Math.min(5, idParts.length - 1)).join('-');
        article = allArticles.find(article => {
          const articleId = article.id.toLowerCase();
          return articleId.includes(partialSlug.toLowerCase());
        });
        
        if (article) {
          console.log('✅ Article found by partial slug match!', article.title);
          // Cache with the requested ID
          articleCache.set(id, article);
          cacheExpiry.set(id, Date.now() + CACHE_DURATION);
          return article;
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

          // Try partial slug match
          const partialSlug = idParts.slice(0, Math.min(5, idParts.length - 1)).join('-');
          if (cachedId.toLowerCase().includes(partialSlug.toLowerCase())) {
            console.log('✅ Article found in cache by partial slug match!', cachedArticle.title);
            // Cache with the requested ID
            articleCache.set(id, cachedArticle);
            cacheExpiry.set(id, Date.now() + CACHE_DURATION);
            return cachedArticle;
          }
        }
      }

      // Last resort: try to find articles with similar titles or content
      console.log('🔍 Last resort: searching for articles with similar content...');
      const searchTerms = id.replace(/-/g, ' ').split(' ').filter(word => word.length > 3);
      for (const [cachedId, cachedArticle] of articleCache.entries()) {
        const title = cachedArticle.title.toLowerCase();
        const description = (cachedArticle.description || '').toLowerCase();
        
        // Check if any search terms appear in title or description
        const matches = searchTerms.filter(term => 
          title.includes(term.toLowerCase()) || description.includes(term.toLowerCase())
        );
        
        if (matches.length >= 2) { // At least 2 matching terms
          console.log(`✅ Article found by content similarity (${matches.length} matches):`, cachedArticle.title);
          // Cache with the requested ID
          articleCache.set(id, cachedArticle);
          cacheExpiry.set(id, Date.now() + CACHE_DURATION);
          return cachedArticle;
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
   * Get article statistics for debugging
   */
  getArticleStats(): { totalCached: number; cacheSize: number; oldestArticle: Date | null; newestArticle: Date | null } {
    const cachedArticles = Array.from(articleCache.values());
    const totalCached = cachedArticles.length;
    const cacheSize = articleCache.size;
    
    if (cachedArticles.length === 0) {
      return { totalCached: 0, cacheSize: 0, oldestArticle: null, newestArticle: null };
    }
    
    const sortedByDate = cachedArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    const newestArticle = new Date(sortedByDate[0].publishedAt);
    const oldestArticle = new Date(sortedByDate[sortedByDate.length - 1].publishedAt);
    
    return { totalCached, cacheSize, oldestArticle, newestArticle };
  }
}
export const newsService = new NewsService();
// Export individual services
export { beritaIndo };
