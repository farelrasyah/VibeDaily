import { BeritaIndoResponse, BeritaIndoArticle, NewsArticle, ApiResponse } from '@/types/news.types';
import { NewsSource, isValidCategoryForSource, getDefaultCategoryForSource } from '@/lib/news-categories';

type IndonesiaSource = 'cnn' | 'cnbc' | 'republika' | 'tempo' | 
  'kumparan' | 'okezone' | 'bbc' | 'jawa-pos' | 'vice' | 'suara' | 'voa';

class BeritaIndoService {
  private baseUrl: string;
  private proxyUrl: string;

  constructor() {
    this.baseUrl = process.env.BERITA_INDO_BASE_URL || 
      'https://berita-indo-api-next.vercel.app';
    // Use your API route as a proxy
    this.proxyUrl = '/api/article/source';
  }

  /**
   * Get news by source
   */
  /**
   * Get news by source - using RSS feeds as fallback when API fails
   */
  async getNewsBySource(
    source: IndonesiaSource,
    category?: string
  ): Promise<ApiResponse<NewsArticle>> {
    try {
      // Force some sources to use RSS for better image support
      if (source === 'okezone') {
        console.log(`📰 Forcing ${source} to use RSS feed for better image support`);
        return await this.getNewsFromRSS(source);
      }

      // First try the original API
      const endpoint = `/api/${source}-news/${category ? category : ''}`;
      const fullUrl = `${this.baseUrl}${endpoint}`;

      console.log(`🌐 Fetching from Berita Indo API ${source}:`, fullUrl);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(fullUrl, {
        next: { revalidate: 300 },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log(`📡 ${source} API response status: ${response.status} ${response.statusText}`);

      // If API works, use it
      if (response.status >= 200 && response.status < 400) {
        const data: BeritaIndoResponse = await response.json();
        console.log(`📦 ${source} API raw response:`, {
          hasData: !!data.data,
          dataType: typeof data.data,
          dataLength: Array.isArray(data.data) ? data.data.length : 'not array',
          total: data.total,
          messages: data.messages
        });

        if (data.data && Array.isArray(data.data) && data.data.length > 0) {
          console.log(`✅ Successfully fetched ${data.data.length} articles from ${source} API`);
          const transformedArticles = data.data.map((article) => this.transformArticle(article, source));
          return {
            success: true,
            data: transformedArticles,
            totalResults: data.total || data.data.length,
          };
        }
      }

      // If API fails, try RSS feed as fallback
      console.log(`⚠️ ${source} API failed (status: ${response.status}), trying RSS feed...`);
      return await this.getNewsFromRSS(source);

    } catch (error) {
      console.error(`💥 Error fetching ${source} from API:`, error);

      // Try RSS feed as fallback
      console.log(`🔄 Trying RSS feed for ${source}...`);
      try {
        return await this.getNewsFromRSS(source);
      } catch (rssError) {
        console.error(`❌ Both API and RSS failed for ${source}:`, rssError);
        return {
          success: false,
          data: [],
          totalResults: 0,
          error: `Failed to fetch news from ${source}`
        };
      }
    }
  }

  /**
   * Get all Indonesia news from multiple sources
   */
  async getAllIndonesiaNews(): Promise<ApiResponse<NewsArticle>> {
    try {
      console.log('🔄 Starting to fetch Indonesia news from multiple sources...');

      // Fetch from multiple sources simultaneously
      const sources: IndonesiaSource[] = ['cnn', 'cnbc', 'tempo', 'republika', 'okezone', 'kumparan', 'bbc', 'jawa-pos', 'vice', 'suara'];
      const allArticles: NewsArticle[] = [];
      let totalFetched = 0;
      let successfulSources = 0;

      console.log(`📡 Attempting to fetch from ${sources.length} sources:`, sources);

      // Use Promise.allSettled to fetch from all sources at once
      const results = await Promise.allSettled(
        sources.map(source => this.getNewsBySource(source))
      );

      results.forEach((result, index) => {
        const source = sources[index];
        if (result.status === 'fulfilled') {
          const response = result.value;
          console.log(`📊 ${source} result:`, {
            success: response.success,
            dataLength: response.data?.length || 0,
            error: response.error
          });

          if (response.success && response.data && response.data.length > 0) {
            allArticles.push(...response.data);
            totalFetched += response.data.length;
            successfulSources++;
            console.log(`✅ Successfully fetched ${response.data.length} articles from ${source}`);
          } else {
            console.warn(`⚠️ ${source} returned success=false or empty data:`, response.error);
          }
        } else {
          console.error(`❌ ${source} request failed:`, result.reason);
        }
      });

      console.log(`📈 Summary: ${successfulSources}/${sources.length} sources successful, ${totalFetched} total articles`);

      if (allArticles.length > 0) {
        // Shuffle articles to mix sources but keep more articles
        const shuffledArticles = allArticles
          .sort(() => Math.random() - 0.5)
          .slice(0, 500); // Increase limit to 500 articles max to improve article coverage

        console.log(`🎉 Successfully fetched ${totalFetched} total articles from ${successfulSources} sources, returning ${shuffledArticles.length}`);

        return {
          success: true,
          data: shuffledArticles,
          totalResults: shuffledArticles.length,
        };
      }

      // If all sources failed, return error instead of fallback
      console.error('❌ All Indonesia news sources failed to provide data');
      return {
        success: false,
        data: [],
        totalResults: 0,
        error: 'All news sources are currently unavailable. Please try again later.'
      };
    } catch (error) {
      console.error('💥 Critical error in getAllIndonesiaNews:', error);
      return {
        success: false,
        data: [],
        totalResults: 0,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
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
      console.error('💥 Error in getTrendingNews:', error);
      return {
        success: false,
        data: [],
        totalResults: 0,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get news by specific source and category with proper validation
   */
  async getNewsBySourceAndCategory(
    source: NewsSource,
    category: string
  ): Promise<ApiResponse<NewsArticle>> {
    try {
      console.log('\n📡 Berita Indo API - Category News Request:')
      console.log('Request Details:')
      console.log(`  - Source: ${source}`)
      console.log(`  - Category: ${category}`);

      // Validate if category exists for this source
      if (!isValidCategoryForSource(source, category)) {
        console.warn(`⚠️ Invalid category "${category}" for source "${source}"`);
        // Try to get default category instead
        const defaultCategory = getDefaultCategoryForSource(source);
        if (defaultCategory) {
          console.log(`🔄 Using default category "${defaultCategory}" instead`);
          category = defaultCategory;
        } else {
          return {
            success: false,
            data: [],
            totalResults: 0,
            error: `Invalid category "${category}" for source "${source}"`
          };
        }
      }

      // Use our proxy API route to avoid CORS issues
      const proxyUrl = `/api/article/source/${source}/${category}`;
      console.log(`🌐 Fetching from proxy: ${proxyUrl}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(proxyUrl, {
        next: { revalidate: 300 },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log(`📡 ${source}/${category} API response status: ${response.status} ${response.statusText}`);

      if (response.status >= 200 && response.status < 400) {
        const data: BeritaIndoResponse = await response.json();
        console.log(`📦 ${source}/${category} API raw response:`, {
          hasData: !!data.data,
          dataType: typeof data.data,
          dataLength: Array.isArray(data.data) ? data.data.length : 'not array',
          total: data.total,
          messages: data.messages
        });

        if (data.data && Array.isArray(data.data) && data.data.length > 0) {
          console.log(`✅ Successfully fetched ${data.data.length} articles from ${source}/${category}`);
          const transformedArticles = data.data.map((article) => this.transformArticle(article, source as IndonesiaSource));
          return {
            success: true,
            data: transformedArticles,
            totalResults: data.total || data.data.length,
          };
        }
      }

      // If API fails, try RSS feed as fallback (without category)
      console.log(`⚠️ ${source}/${category} API failed (status: ${response.status}), trying RSS feed...`);
      return await this.getNewsFromRSS(source as IndonesiaSource);

    } catch (error) {
      console.error(`💥 Error fetching ${source}/${category}:`, error);

      // Try RSS feed as fallback
      console.log(`🔄 Trying RSS feed for ${source}...`);
      try {
        return await this.getNewsFromRSS(source as IndonesiaSource);
      } catch (rssError) {
        console.error(`❌ Both API and RSS failed for ${source}/${category}:`, rssError);
        return {
          success: false,
          data: [],
          totalResults: 0,
          error: `Failed to fetch news from ${source}/${category}`
        };
      }
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

    // Extract meaningful part from URL
    const urlParts = url.split('/');
    const lastPart = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2];
    
    if (lastPart && lastPart !== '' && lastPart.length > 3) {
      // Use URL path part + combined hash for uniqueness
      const cleanPart = lastPart.replace(/[^a-zA-Z0-9-_]/g, '-').substring(0, 50);
      return `${cleanPart}-${combinedHash}`;
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
   * Transform Berita Indo article to unified format
   */
  private transformArticle = (
    article: BeritaIndoArticle & { content?: string; category?: string; image?: any },
    source: IndonesiaSource
  ): NewsArticle => {

    // Extract content from various possible fields
    let content = '';
    let description = '';

    // Different sources have content in different fields
    if (source === 'okezone' || source === 'vice') {
      // Okezone and Vice put content in 'content' field
      content = article.content || '';
      description = article.contentSnippet || article.description || article.content || '';
    } else if (source === 'kumparan') {
      // Kumparan puts content in 'description' field
      content = article.description || '';
      description = article.description || '';
    } else {
      // Default behavior for other sources
      content = article.contentSnippet || article.description || article.content || '';
      description = article.contentSnippet || article.description || '';
    }

    // Handle image URLs - some are just query parameters
    let imageUrl = null;
    if (article.image?.large) {
      imageUrl = article.image.large;
    } else if (article.image?.small) {
      imageUrl = article.image.small;
    } else if (article.image?.url) {
      imageUrl = article.image.url;
    } else if (article.image?.medium) {
      imageUrl = article.image.medium;
    } else if (article.image?.extraLarge) {
      imageUrl = article.image.extraLarge;
    }

    // Only try to construct full URL if it's clearly a query parameter
    if (imageUrl && imageUrl.startsWith('?') && source !== 'okezone') {
      // For some sources, we might need to prepend the article URL or a base URL
      // For now, let's try prepending the article's domain
      try {
        const articleUrl = new URL(article.link);
        imageUrl = articleUrl.origin + imageUrl;
      } catch {
        // If URL parsing fails, keep the original
        console.log(`⚠️ Could not construct full image URL for ${source}: ${imageUrl}`);
      }
    }

    return {
      id: this.generateSafeId(article.link, article.title),
      title: article.title || 'No title',
      description: description,
      content: content,
      url: article.link,
      imageUrl: imageUrl,
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
   * Get news from RSS feed as fallback
   */
  private async getNewsFromRSS(source: IndonesiaSource): Promise<ApiResponse<NewsArticle>> {
    try {
      // RSS feed URLs for different sources (updated with better URLs that include images)
      const rssUrls: Record<IndonesiaSource, string> = {
        'cnn': 'https://www.cnnindonesia.com/rss', // CNN Indonesia RSS
        'cnbc': 'https://www.cnbc.com/id/rss/', // CNBC Indonesia
        'tempo': 'https://rss.tempo.co/', // Tempo
        'republika': 'https://www.republika.co.id/rss', // Republika
        'okezone': 'https://sindikasi.okezone.com/index.php/rss/1/rss.xml', // Okezone
        'kumparan': 'https://api.kumparan.com/rss', // Kumparan
        'bbc': 'https://feeds.bbci.co.uk/indonesia/rss.xml', // BBC Indonesia
        'jawa-pos': 'https://www.jawapos.com/rss', // Jawa Pos
        'vice': 'https://www.vice.com/id/rss', // Vice Indonesia
        'suara': 'https://www.suara.com/rss', // Suara.com
        'voa': 'https://www.voaindonesia.com/api/zqvmqveoo$_r' // VOA Indonesia
      };

      const rssUrl = rssUrls[source];
      if (!rssUrl) {
        throw new Error(`No RSS URL available for ${source}`);
      }

      console.log(`📰 Fetching RSS from ${source}:`, rssUrl);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(rssUrl, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn(`⚠️ RSS fetch failed for ${source} with status ${response.status}, skipping RSS fallback`);
        return {
          success: true,
          data: [],
          totalResults: 0,
        };
      }

      const rssText = await response.text();

      // Parse RSS (simple XML parsing)
      const articles = this.parseRSS(rssText, source);

      console.log(`✅ Successfully fetched ${articles.length} articles from ${source} RSS`);

      return {
        success: true,
        data: articles,
        totalResults: articles.length,
      };

    } catch (error) {
      console.error(`❌ RSS fetch failed for ${source}:`, error);
      return {
        success: false,
        data: [],
        totalResults: 0,
        error: `RSS fetch failed for ${source}`
      };
    }
  }

  /**
   * Simple RSS parser with image extraction
   */
  private parseRSS(rssText: string, source: IndonesiaSource): NewsArticle[] {
    const articles: NewsArticle[] = [];

    try {
      // Simple regex-based RSS parsing (compatible with older JS engines)
      const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/g;
      const titleRegex = /<title[^>]*>([\s\S]*?)<\/title>/;
      const linkRegex = /<link[^>]*>([\s\S]*?)<\/link>/;
      const descriptionRegex = /<description[^>]*>([\s\S]*?)<\/description>/;
      const pubDateRegex = /<pubDate[^>]*>([\s\S]*?)<\/pubDate>/;

      let itemMatch;
      while ((itemMatch = itemRegex.exec(rssText)) !== null && articles.length < 10) {
        const itemContent = itemMatch[1];

        const titleMatch = titleRegex.exec(itemContent);
        const linkMatch = linkRegex.exec(itemContent);
        const descriptionMatch = descriptionRegex.exec(itemContent);
        const pubDateMatch = pubDateRegex.exec(itemContent);

        if (titleMatch && linkMatch) {
          const title = this.stripHtml(titleMatch[1]).trim();
          const url = linkMatch[1].trim();
          const description = descriptionMatch ? this.stripHtml(descriptionMatch[1]).trim() : '';
          const publishedAt = pubDateMatch ? new Date(pubDateMatch[1]).toISOString() : new Date().toISOString();

          // Extract image URL from various RSS formats
          const imageUrl = this.extractImageFromRSS(itemContent, url);

          if (title && url) {
            articles.push({
              id: this.generateSafeId(url, title),
              title,
              description: description || title,
              content: description || title,
              url,
              imageUrl,
              source: {
                id: source,
                name: this.getSourceName(source),
              },
              author: null,
              publishedAt,
              category: 'General',
              language: 'id',
            });
          }
        }
      }
    } catch (error) {
      console.error('Error parsing RSS:', error);
    }

    return articles;
  }

  /**
   * Extract image URL from RSS item content
   */
  private extractImageFromRSS(itemContent: string, articleUrl: string): string | null {
    try {
      // Try different image extraction patterns

      // 1. Media RSS format: <media:content url="...">
      const mediaContentRegex = /<media:content[^>]*url=["']([^"']*)["']/i;
      const mediaMatch = mediaContentRegex.exec(itemContent);
      if (mediaMatch && mediaMatch[1]) {
        const url = mediaMatch[1];
        if (this.isValidImageUrl(url)) {
          return url;
        }
      }

      // 2. Media RSS thumbnail: <media:thumbnail url="...">
      const mediaThumbnailRegex = /<media:thumbnail[^>]*url=["']([^"']*)["']/i;
      const thumbnailMatch = mediaThumbnailRegex.exec(itemContent);
      if (thumbnailMatch && thumbnailMatch[1]) {
        const url = thumbnailMatch[1];
        if (this.isValidImageUrl(url)) {
          return url;
        }
      }

      // 3. Enclosure with image type: <enclosure url="..." type="image/...">
      const enclosureRegex = /<enclosure[^>]*url=["']([^"']*)["'][^>]*type=["']image\/[^"']*["']/i;
      const enclosureMatch = enclosureRegex.exec(itemContent);
      if (enclosureMatch && enclosureMatch[1]) {
        const url = enclosureMatch[1];
        if (this.isValidImageUrl(url)) {
          return url;
        }
      }

      // 4. Image tag in description: <img src="...">
      const imgRegex = /<img[^>]*src=["']([^"']*)["']/i;
      const imgMatch = imgRegex.exec(itemContent);
      if (imgMatch && imgMatch[1]) {
        let url = imgMatch[1];
        // Handle relative URLs
        if (url.startsWith('//')) {
          url = 'https:' + url;
        } else if (url.startsWith('/')) {
          const baseUrl = new URL(articleUrl).origin;
          url = baseUrl + url;
        }
        if (this.isValidImageUrl(url)) {
          return url;
        }
      }

      // 5. Try to extract from description content (look for common image patterns)
      const descriptionMatch = itemContent.match(/<description[^>]*>([\s\S]*?)<\/description>/);
      if (descriptionMatch && descriptionMatch[1]) {
        const descImgMatch = imgRegex.exec(descriptionMatch[1]);
        if (descImgMatch && descImgMatch[1]) {
          let url = descImgMatch[1];
          if (url.startsWith('//')) {
            url = 'https:' + url;
          } else if (url.startsWith('/')) {
            const baseUrl = new URL(articleUrl).origin;
            url = baseUrl + url;
          }
          if (this.isValidImageUrl(url)) {
            return url;
          }
        }
      }

      return null;
    } catch (error) {
      console.error('Error extracting image from RSS:', error);
      return null;
    }
  }

  /**
   * Check if URL is a valid image URL
   */
  private isValidImageUrl(url: string): boolean {
    if (!url || typeof url !== 'string') return false;

    // Check for image extensions
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
    const hasImageExtension = imageExtensions.some(ext => url.toLowerCase().includes(ext));

    // Check for image hosting domains
    const imageDomains = ['cdn', 'img', 'image', 'media', 'static', 'assets', 'i.imgur.com', 'pbs.twimg.com'];
    const hasImageDomain = imageDomains.some(domain => url.toLowerCase().includes(domain));

    // Basic URL validation
    try {
      new URL(url);
      return hasImageExtension || hasImageDomain;
    } catch {
      return false;
    }
  }

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

  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
  }

  private handleError(error: unknown): ApiResponse<NewsArticle> {
    console.error('API Error:', error);
    return {
      success: false,
      data: [],
      totalResults: 0,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export const beritaIndo = new BeritaIndoService();
