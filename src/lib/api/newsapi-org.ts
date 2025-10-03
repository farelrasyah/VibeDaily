import { NewsApiOrgResponse, NewsArticle, ApiResponse } from '@/types/news.types';

class NewsApiOrgService {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = process.env.NEWSAPI_ORG_BASE_URL || 'https://newsapi.org/v2';
    this.apiKey = process.env.NEWSAPI_ORG_API_KEY || '';
    
    if (!this.apiKey) {
      console.warn('NewsAPI.org API key is not configured');
    }
  }

  /**
   * Get top headlines by country
   */
  async getTopHeadlines(params: {
    country?: string;
    category?: string;
    pageSize?: number;
    page?: number;
  }): Promise<ApiResponse<NewsArticle>> {
    try {
      const queryParams = new URLSearchParams({
        apiKey: this.apiKey,
        country: params.country || 'us',
        ...(params.category && { category: params.category }),
        pageSize: String(params.pageSize || 20),
        page: String(params.page || 1),
      });

      const response = await fetch(
        `${this.baseUrl}/top-headlines?${queryParams}`,
        {
          next: { revalidate: 300 }, // Cache for 5 minutes
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data: NewsApiOrgResponse = await response.json();

      return {
        success: true,
        data: data.articles.map(this.transformArticle),
        totalResults: data.totalResults,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Search news articles
   */
  async searchNews(params: {
    query: string;
    from?: string;
    to?: string;
    language?: string;
    sortBy?: 'relevancy' | 'popularity' | 'publishedAt';
    pageSize?: number;
    page?: number;
  }): Promise<ApiResponse<NewsArticle>> {
    try {
      const queryParams = new URLSearchParams({
        apiKey: this.apiKey,
        q: params.query,
        ...(params.from && { from: params.from }),
        ...(params.to && { to: params.to }),
        ...(params.language && { language: params.language }),
        sortBy: params.sortBy || 'publishedAt',
        pageSize: String(params.pageSize || 20),
        page: String(params.page || 1),
      });

      const response = await fetch(
        `${this.baseUrl}/everything?${queryParams}`,
        {
          next: { revalidate: 300 },
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data: NewsApiOrgResponse = await response.json();

      return {
        success: true,
        data: data.articles.map(this.transformArticle),
        totalResults: data.totalResults,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Generate safe ID from URL or title
   */
  private generateSafeId(url: string, title: string): string {
    // Create a more robust hash function
    const createHash = (str: string): string => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      return Math.abs(hash).toString(36);
    };

    // Use combination of URL and title for better uniqueness
    const combined = `${url}|${title}`;
    const combinedHash = createHash(combined);

    // Extract domain and path from URL
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/').filter(part => part);
      const lastPart = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2];
      
      if (lastPart && lastPart !== '' && lastPart.length > 3) {
        // Use URL path part + combined hash for uniqueness
        const cleanPart = lastPart.replace(/[^a-zA-Z0-9-_]/g, '-').substring(0, 50);
        return `${cleanPart}-${combinedHash}`;
      }
    } catch (e) {
      // Invalid URL, fallback to title
    }
    
    // Fallback to title-based ID with combined hash
    const titlePart = title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 30);
    return `${titlePart}-${combinedHash}`;
  }

  /**
   * Transform NewsAPI.org article to unified format
   */
  private transformArticle = (article: any): NewsArticle => {
    return {
      id: this.generateSafeId(article.url, article.title),
      title: article.title || 'No title',
      description: article.description || article.content || '',
      content: article.content || article.description || '',
      url: article.url,
      imageUrl: article.urlToImage || null,
      source: {
        id: article.source.id || 'unknown',
        name: article.source.name || 'Unknown Source',
      },
      author: article.author || null,
      publishedAt: article.publishedAt,
      language: 'en',
    };
  };

  /**
   * Error handler
   */
  private handleError(error: any): ApiResponse<NewsArticle> {
    console.error('NewsAPI.org Error:', error);
    return {
      success: false,
      data: [],
      error: error.message || 'Failed to fetch news',
    };
  }
}

export const newsApiOrg = new NewsApiOrgService();
