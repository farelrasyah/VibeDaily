import { NewsArticle } from '@/types/news.types';
import { newsService } from './index';

// Guide categories mapping
export type GuideCategory = 'how-to-guides' | 'tutorials' | 'best-practices' | 'tips-tricks';

export interface GuideArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  imageUrl: string | null;
  source: {
    id: string;
    name: string;
  };
  author: string | null;
  publishedAt: string;
  category: GuideCategory;
  tags: string[];
  readTime: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  type?: 'Tip' | 'Trick' | 'Hack';
  impact?: 'High' | 'Medium' | 'Low';
  keyPoints?: string[];
}

/**
 * Guides Service
 * Mengambil data guides dari API berita dengan filter khusus
 */
class GuidesService {
  private guideCategories = {
    'how-to-guides': {
      keywords: ['cara', 'panduan', 'tutorial', 'how to', 'step by step', 'langkah'],
      sources: ['cnn', 'antara', 'cnbc', 'republika', 'tempo'],
      categories: ['teknologi', 'gaya-hidup', 'ekonomi']
    },
    'tutorials': {
      keywords: ['tutorial', 'belajar', 'membuat', 'menggunakan', 'framework', 'library'],
      sources: ['cnn', 'antara', 'cnbc'],
      categories: ['teknologi', 'tekno']
    },
    'best-practices': {
      keywords: ['best practice', 'praktik terbaik', 'rekomendasi', 'tips profesional', 'standar industri'],
      sources: ['cnn', 'antara', 'cnbc', 'republika'],
      categories: ['teknologi', 'ekonomi', 'bisnis']
    },
    'tips-tricks': {
      keywords: ['tips', 'trick', 'hack', 'shortcut', 'waktu', 'produktivitas', 'efisien'],
      sources: ['cnn', 'antara', 'cnbc', 'tempo'],
      categories: ['teknologi', 'gaya-hidup', 'bisnis']
    }
  };

  /**
   * Get guides by category
   */
  async getGuidesByCategory(
    category: GuideCategory,
    limit: number = 20
  ): Promise<GuideArticle[]> {
    try {
      console.log(`📚 Fetching guides for category: ${category}`);

      const categoryConfig = this.guideCategories[category];
      const guides: GuideArticle[] = [];

      // Fetch articles from multiple sources and categories
      for (const source of categoryConfig.sources) {
        for (const sourceCategory of categoryConfig.categories) {
          try {
            const articles = await newsService.getNewsBySourceAndCategory(
              source as any,
              sourceCategory,
              Math.ceil(limit / 2) // Get more articles to filter
            );

            // Filter articles based on keywords and convert to guide format
            const filteredGuides = articles
              .filter(article => this.matchesGuideCriteria(article, categoryConfig.keywords))
              .map(article => this.convertToGuideArticle(article, category))
              .slice(0, Math.ceil(limit / categoryConfig.sources.length));

            guides.push(...filteredGuides);
          } catch (error) {
            console.warn(`⚠️ Failed to fetch from ${source}/${sourceCategory}:`, error);
          }
        }
      }

      // Remove duplicates and limit results
      const uniqueGuides = this.removeDuplicates(guides).slice(0, limit);

      console.log(`✅ Found ${uniqueGuides.length} guides for ${category}`);
      return uniqueGuides;
    } catch (error) {
      console.error(`❌ Error fetching guides for ${category}:`, error);
      return [];
    }
  }

  /**
   * Get all guides with mixed categories
   */
  async getAllGuides(limit: number = 50): Promise<GuideArticle[]> {
    try {
      console.log('📚 Fetching all guides');

      const allGuides: GuideArticle[] = [];
      const categories: GuideCategory[] = ['how-to-guides', 'tutorials', 'best-practices', 'tips-tricks'];

      for (const category of categories) {
        const guides = await this.getGuidesByCategory(category, Math.ceil(limit / categories.length));
        allGuides.push(...guides);
      }

      const uniqueGuides = this.removeDuplicates(allGuides).slice(0, limit);
      console.log(`✅ Found ${uniqueGuides.length} total guides`);
      return uniqueGuides;
    } catch (error) {
      console.error('❌ Error fetching all guides:', error);
      return [];
    }
  }

  /**
   * Get How-to Guides
   */
  async getHowToGuides(limit: number = 20): Promise<GuideArticle[]> {
    return this.getGuidesByCategory('how-to-guides', limit);
  }

  /**
   * Get Tutorials
   */
  async getTutorials(limit: number = 20): Promise<GuideArticle[]> {
    return this.getGuidesByCategory('tutorials', limit);
  }

  /**
   * Get Best Practices
   */
  async getBestPractices(limit: number = 20): Promise<GuideArticle[]> {
    return this.getGuidesByCategory('best-practices', limit);
  }

  /**
   * Get Tips & Tricks
   */
  async getTipsTricks(limit: number = 20): Promise<GuideArticle[]> {
    return this.getGuidesByCategory('tips-tricks', limit);
  }

  /**
   * Search guides by query
   */
  async searchGuides(query: string, limit: number = 20): Promise<GuideArticle[]> {
    try {
      console.log(`🔍 Searching guides for: "${query}"`);

      const allGuides = await this.getAllGuides(100); // Get more to search through

      const filteredGuides = allGuides.filter(guide =>
        guide.title.toLowerCase().includes(query.toLowerCase()) ||
        guide.description.toLowerCase().includes(query.toLowerCase()) ||
        guide.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );

      console.log(`✅ Found ${filteredGuides.length} guides matching "${query}"`);
      return filteredGuides.slice(0, limit);
    } catch (error) {
      console.error(`❌ Error searching guides for "${query}":`, error);
      return [];
    }
  }

  /**
   * Check if article matches guide criteria
   */
  private matchesGuideCriteria(article: NewsArticle, keywords: string[]): boolean {
    const text = `${article.title} ${article.description}`.toLowerCase();
    return keywords.some(keyword => text.includes(keyword.toLowerCase()));
  }

  /**
   * Convert NewsArticle to GuideArticle
   */
  private convertToGuideArticle(article: NewsArticle, category: GuideCategory): GuideArticle {
    const tags = this.extractTags(article, category);
    const readTime = this.estimateReadTime(article.content || article.description);
    const difficulty = this.determineDifficulty(article, category);
    const type = this.determineType(article, category);
    const impact = this.determineImpact(article, category);
    const keyPoints = this.extractKeyPoints(article.content || article.description);

    return {
      id: `guide-${article.id}`,
      title: article.title,
      description: article.description,
      content: article.content,
      url: article.url,
      imageUrl: article.imageUrl,
      source: article.source,
      author: article.author,
      publishedAt: article.publishedAt,
      category,
      tags,
      readTime,
      difficulty,
      type,
      impact,
      keyPoints
    };
  }

  /**
   * Extract relevant tags from article
   */
  private extractTags(article: NewsArticle, category: GuideCategory): string[] {
    const tags: string[] = [];
    const text = `${article.title} ${article.description}`.toLowerCase();

    // Category-specific tags
    switch (category) {
      case 'how-to-guides':
        if (text.includes('setup') || text.includes('install')) tags.push('Setup');
        if (text.includes('deploy')) tags.push('Deployment');
        if (text.includes('api')) tags.push('API');
        if (text.includes('responsive')) tags.push('Responsive');
        if (text.includes('state')) tags.push('State');
        if (text.includes('performance')) tags.push('Performance');
        break;
      case 'tutorials':
        if (text.includes('react')) tags.push('React');
        if (text.includes('next')) tags.push('Next.js');
        if (text.includes('typescript')) tags.push('TypeScript');
        if (text.includes('api')) tags.push('API');
        if (text.includes('state')) tags.push('State Management');
        if (text.includes('performance')) tags.push('Performance');
        break;
      case 'best-practices':
        tags.push('Best Practices');
        if (text.includes('security')) tags.push('Security');
        if (text.includes('performance')) tags.push('Performance');
        if (text.includes('testing')) tags.push('Testing');
        if (text.includes('architecture')) tags.push('Architecture');
        break;
      case 'tips-tricks':
        if (text.includes('vscode') || text.includes('editor')) tags.push('VS Code');
        if (text.includes('git')) tags.push('Git');
        if (text.includes('terminal')) tags.push('Terminal');
        if (text.includes('productivity')) tags.push('Productivity');
        if (text.includes('debug')) tags.push('Debugging');
        break;
    }

    // Common tags
    if (text.includes('javascript')) tags.push('JavaScript');
    if (text.includes('css') || text.includes('tailwind')) tags.push('CSS');
    if (text.includes('html')) tags.push('HTML');
    if (text.includes('node')) tags.push('Node.js');

    return [...new Set(tags)]; // Remove duplicates
  }

  /**
   * Estimate read time based on content length
   */
  private estimateReadTime(content: string): string {
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  }

  /**
   * Determine difficulty level
   */
  private determineDifficulty(article: NewsArticle, category: GuideCategory): 'Beginner' | 'Intermediate' | 'Advanced' {
    const text = `${article.title} ${article.description}`.toLowerCase();

    if (category === 'tutorials') {
      if (text.includes('fundamental') || text.includes('basic') || text.includes('introduction')) {
        return 'Beginner';
      }
      if (text.includes('advanced') || text.includes('complex') || text.includes('expert')) {
        return 'Advanced';
      }
      return 'Intermediate';
    }

    return 'Intermediate'; // Default for other categories
  }

  /**
   * Determine tip/trick type
   */
  private determineType(article: NewsArticle, category: GuideCategory): 'Tip' | 'Trick' | 'Hack' | undefined {
    if (category !== 'tips-tricks') return undefined;

    const text = `${article.title} ${article.description}`.toLowerCase();

    if (text.includes('hack') || text.includes('powerful')) return 'Hack';
    if (text.includes('trick') || text.includes('technique')) return 'Trick';
    return 'Tip';
  }

  /**
   * Determine impact level
   */
  private determineImpact(article: NewsArticle, category: GuideCategory): 'High' | 'Medium' | 'Low' | undefined {
    if (category !== 'tips-tricks') return undefined;

    const text = `${article.title} ${article.description}`.toLowerCase();

    if (text.includes('save hours') || text.includes('dramatically') || text.includes('revolutionize')) {
      return 'High';
    }
    if (text.includes('improve') || text.includes('better') || text.includes('enhance')) {
      return 'Medium';
    }
    return 'Low';
  }

  /**
   * Extract key points from content
   */
  private extractKeyPoints(content: string): string[] {
    // Simple extraction - look for numbered or bulleted lists
    const lines = content.split('\n');
    const keyPoints: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if ((trimmed.match(/^\d+\./) || trimmed.match(/^[•\-*]/)) && trimmed.length > 10) {
        keyPoints.push(trimmed.replace(/^\d+\.\s*|[•\-*]\s*/, ''));
      }
      if (keyPoints.length >= 3) break; // Limit to 3 key points
    }

    // If no structured points found, create some based on content
    if (keyPoints.length === 0) {
      const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
      return sentences.slice(0, 3).map(s => s.trim());
    }

    return keyPoints;
  }

  /**
   * Remove duplicate guides
   */
  private removeDuplicates(guides: GuideArticle[]): GuideArticle[] {
    const seen = new Set<string>();
    return guides.filter(guide => {
      const key = `${guide.title}-${guide.source.id}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
}

export const guidesService = new GuidesService();