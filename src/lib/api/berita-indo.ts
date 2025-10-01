import { BeritaIndoResponse, NewsArticle, ApiResponse } from '@/types/news.types';

type IndonesiaSource = 'cnn' | 'cnbc' | 'republika' | 'tempo' | 'antara' | 
  'kumparan' | 'okezone' | 'bbc' | 'tribun' | 'jawa-pos' | 'vice' | 'suara' | 'voa';

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
   * Get all Indonesia news (aggregate dari multiple sources)
   */
  async getAllIndonesiaNews(): Promise<ApiResponse<NewsArticle>> {
    try {
      // Coba fetch dari CNN dulu
      const cnnResult = await this.getNewsBySource('cnn');
      
      if (cnnResult.success && cnnResult.data.length > 0) {
        console.log(`✅ Successfully fetched ${cnnResult.data.length} articles from CNN Indonesia`);
        return cnnResult;
      }

      // Jika CNN gagal, coba Tempo
      console.log('CNN failed, trying Tempo...');
      const tempoResult = await this.getNewsBySource('tempo');
      
      if (tempoResult.success && tempoResult.data.length > 0) {
        console.log(`✅ Successfully fetched ${tempoResult.data.length} articles from Tempo`);
        return tempoResult;
      }

      // Jika semua gagal, return empty
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
   * Get trending Indonesia news (from CNN)
   */
  async getTrendingNews(): Promise<ApiResponse<NewsArticle>> {
    // Coba CNN terkini dulu
    const result = await this.getNewsBySource('cnn');
    
    if (result.success && result.data.length > 0) {
      return result;
    }
    
    // Fallback ke semua berita Indonesia
    return this.getAllIndonesiaNews();
  }

  /**
   * Transform Berita Indo article to unified format
   */
  private transformArticle = (
    article: any,
    source: IndonesiaSource
  ): NewsArticle => {
    return {
      id: article.link || `${source}-${Date.now()}`,
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
      'antara': 'Antara News',
      'kumparan': 'Kumparan',
      'okezone': 'Okezone',
      'bbc': 'BBC Indonesia',
      'tribun': 'Tribun News',
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
