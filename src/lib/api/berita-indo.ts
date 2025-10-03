import { BeritaIndoResponse, NewsArticle, ApiResponse } from '@/types/news.types';

type IndonesiaSource = 'cnn' | 'cnbc' | 'republika' | 'tempo' | 
  'kumparan' | 'okezone' | 'bbc' | 'jawa-pos' | 'vice' | 'suara' | 'voa';

class BeritaIndoService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.BERITA_INDO_BASE_URL || 
      'https://berita-indo-api-next.vercel.app';
  }

  /**
   * Get news by source
   */
  async getNewsBySource(
    source: IndonesiaSource,
    category?: string
  ): Promise<ApiResponse<NewsArticle>> {
    try {
      // Format endpoint yang benar sesuai dokumentasi: /api/cnn-news/, /api/cnbc-news/, dll
      const endpoint = `/api/${source}-news/${category ? category : ''}`;

      console.log('Fetching from Berita Indo:', `${this.baseUrl}${endpoint}`);

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        next: { revalidate: 300 }, // Cache for 5 minutes
      });

      if (!response.ok) {
        console.error(`Berita Indo API failed for ${source}:`, response.status, response.statusText);
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data: BeritaIndoResponse = await response.json();

      // API response has 'messages' and 'total' fields, not 'success'
      if (!data.data || !Array.isArray(data.data)) {
        console.error('Invalid API response structure:', data);
        throw new Error('Invalid API response');
      }

      console.log(`✅ Successfully fetched ${data.total || data.data.length} articles from ${source}`);

      return {
        success: true,
        data: data.data.map((article) => this.transformArticle(article, source)),
        totalResults: data.total || data.data.length,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get all Indonesia news from multiple sources
   */
  async getAllIndonesiaNews(): Promise<ApiResponse<NewsArticle>> {
    try {
      // Fetch from multiple sources simultaneously
      const sources: IndonesiaSource[] = ['cnn', 'cnbc', 'tempo', 'republika', 'okezone'];
      const allArticles: NewsArticle[] = [];
      let totalFetched = 0;

      // Use Promise.allSettled to fetch from all sources at once
      const results = await Promise.allSettled(
        sources.map(source => this.getNewsBySource(source))
      );

      results.forEach((result, index) => {
        const source = sources[index];
        if (result.status === 'fulfilled' && result.value.success) {
          const articles = result.value.data;
          allArticles.push(...articles);
          totalFetched += articles.length;
          console.log(`✅ Successfully fetched ${articles.length} articles from ${source}`);
        } else {
          console.warn(`❌ Failed to fetch from ${source}:`, 
            result.status === 'rejected' ? result.reason : result.value.error);
        }
      });

      if (allArticles.length > 0) {
        // Shuffle articles to mix sources and limit to reasonable number
        const shuffledArticles = allArticles
          .sort(() => Math.random() - 0.5)
          .slice(0, 50); // Limit to 50 articles max

        console.log(`✅ Successfully fetched ${totalFetched} total articles from ${results.length} sources, showing ${shuffledArticles.length}`);
        
        return {
          success: true,
          data: shuffledArticles,
          totalResults: shuffledArticles.length,
        };
      }

      // If all sources failed
      console.warn('All Indonesia news sources failed');
      return {
        success: false,
        data: [],
        totalResults: 0,
        error: 'All news sources unavailable'
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get trending Indonesia news from multiple top sources
   */
  async getTrendingNews(): Promise<ApiResponse<NewsArticle>> {
    try {
      // Get trending articles from top 3 sources
      const topSources: IndonesiaSource[] = ['cnn', 'tempo', 'cnbc'];
      const allArticles: NewsArticle[] = [];

      const results = await Promise.allSettled(
        topSources.map(source => this.getNewsBySource(source))
      );

      results.forEach((result, index) => {
        const source = topSources[index];
        if (result.status === 'fulfilled' && result.value.success) {
          // Take only the first 5 articles from each source (most recent/trending)
          allArticles.push(...result.value.data.slice(0, 5));
          console.log(`✅ Got trending articles from ${source}`);
        }
      });

      if (allArticles.length > 0) {
        // Sort by publish date (most recent first) and limit to 10
        const trendingArticles = allArticles
          .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
          .slice(0, 10);

        return {
          success: true,
          data: trendingArticles,
          totalResults: trendingArticles.length,
        };
      }

      // Fallback to all Indonesia news
      return this.getAllIndonesiaNews();
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Generate safe ID from URL or title
   */
  private generateSafeId(url: string, title: string): string {
    // Extract last part of URL or use title
    const urlParts = url.split('/');
    const lastPart = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2];
    
    if (lastPart && lastPart !== '') {
      return lastPart.replace(/[^a-zA-Z0-9-_]/g, '-').substring(0, 100);
    }
    
    // Fallback to title-based ID
    return title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50) + '-' + Date.now().toString().slice(-6);
  }

  /**
   * Transform Berita Indo article to unified format
   */
  private transformArticle = (
    article: any,
    source: IndonesiaSource
  ): NewsArticle => {
    return {
      id: this.generateSafeId(article.link, article.title),
      title: article.title || 'No title',
      description: article.contentSnippet || article.description || '',
      content: article.description || article.contentSnippet || '',
      url: article.link,
      imageUrl: article.image?.large || article.image?.small || null,
      source: {
        id: source,
        name: this.getSourceName(source),
      },
      author: null,
      publishedAt: article.isoDate || new Date().toISOString(),
      category: article.category,
      language: 'id',
    };
  };

  /**
   * Get source display name
   */
  private getSourceName(source: IndonesiaSource): string {
    const sourceNames: Record<IndonesiaSource, string> = {
      'cnn': 'CNN Indonesia',
      'cnbc': 'CNBC Indonesia',
      'republika': 'Republika',
      'tempo': 'Tempo',
      'kumparan': 'Kumparan',
      'okezone': 'Okezone',
      'bbc': 'BBC Indonesia',
      'jawa-pos': 'Jawa Pos',
      'vice': 'Vice Indonesia',
      'suara': 'Suara.com',
      'voa': 'VOA Indonesia',
    };
    return sourceNames[source] || source;
  }

  /**
   * Error handler
   */
  private handleError(error: any): ApiResponse<NewsArticle> {
    console.error('Berita Indo API Error:', error);
    return {
      success: false,
      data: [],
      error: error.message || 'Failed to fetch Indonesia news',
    };
  }
}

export const beritaIndo = new BeritaIndoService();
