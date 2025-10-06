/**
 * News Source Category Mapping System
 * Maps each news source to its available categories for proper API integration
 */

// News Source Types
export type NewsSource = 'cnn' | 'antara' | 'cnbc' | 'republika' | 'tempo' | 'okezone';

// Category mappings for each news source
export const NEWS_SOURCE_CATEGORIES = {
  cnn: {
    name: 'CNN News',
    baseUrl: 'cnn-news',
    categories: [
      { id: 'nasional', name: 'Nasional' },
      { id: 'internasional', name: 'Internasional' },
      { id: 'ekonomi', name: 'Ekonomi' },
      { id: 'olahraga', name: 'Olahraga' },
      { id: 'teknologi', name: 'Teknologi' },
      { id: 'hiburan', name: 'Hiburan' },
      { id: 'gaya-hidup', name: 'Gaya Hidup' }
    ]
  },
  antara: {
    name: 'Antara News',
    baseUrl: 'antara-news',
    categories: [
      { id: 'terkini', name: 'Terkini' },
      { id: 'top-news', name: 'Top News' },
      { id: 'politik', name: 'Politik' },
      { id: 'hukum', name: 'Hukum' },
      { id: 'ekonomi', name: 'Ekonomi' },
      { id: 'metro', name: 'Metro' },
      { id: 'sepakbola', name: 'Sepakbola' },
      { id: 'olahraga', name: 'Olahraga' },
      { id: 'humaniora', name: 'Humaniora' },
      { id: 'lifestyle', name: 'Lifestyle' },
      { id: 'hiburan', name: 'Hiburan' },
      { id: 'dunia', name: 'Dunia' },
      { id: 'infografik', name: 'Infografik' },
      { id: 'tekno', name: 'Tekno' },
      { id: 'otomotif', name: 'Otomotif' },
      { id: 'warta-bumi', name: 'Warta Bumi' },
      { id: 'rilis-pers', name: 'Rilis Pers' }
    ]
  },
  cnbc: {
    name: 'CNBC News',
    baseUrl: 'cnbc-news',
    categories: [
      { id: 'market', name: 'Market' },
      { id: 'news', name: 'News' },
      { id: 'entrepreneur', name: 'Entrepreneur' },
      { id: 'syariah', name: 'Syariah' },
      { id: 'tech', name: 'Tech' },
      { id: 'lifestyle', name: 'Lifestyle' }
    ]
  },
  republika: {
    name: 'Republika News',
    baseUrl: 'republika-news',
    categories: [
      { id: 'news', name: 'News' },
      { id: 'nusantara', name: 'Nusantara' },
      { id: 'khazanah', name: 'Khazanah' },
      { id: 'islam-digest', name: 'Islam Digest' },
      { id: 'internasional', name: 'Internasional' },
      { id: 'ekonomi', name: 'Ekonomi' },
      { id: 'sepakbola', name: 'Sepakbola' },
      { id: 'leisure', name: 'Leisure' }
    ]
  },
  tempo: {
    name: 'Tempo News',
    baseUrl: 'tempo-news',
    categories: [
      { id: 'nasional', name: 'Nasional' },
      { id: 'bisnis', name: 'Bisnis' },
      { id: 'metro', name: 'Metro' },
      { id: 'dunia', name: 'Dunia' },
      { id: 'bola', name: 'Bola' },
      { id: 'sport', name: 'Sport' },
      { id: 'cantik', name: 'Cantik' },
      { id: 'tekno', name: 'Tekno' },
      { id: 'otomotif', name: 'Otomotif' },
      { id: 'nusantara', name: 'Nusantara' }
    ]
  },
  okezone: {
    name: 'Okezone News',
    baseUrl: 'okezone-news',
    categories: [
      { id: 'breaking', name: 'Breaking' },
      { id: 'sport', name: 'Sport' },
      { id: 'economy', name: 'Economy' },
      { id: 'lifestyle', name: 'Lifestyle' },
      { id: 'celebrity', name: 'Celebrity' },
      { id: 'bola', name: 'Bola' },
      { id: 'techno', name: 'Techno' }
    ]
  }
} as const;

// Type for category
export interface NewsCategory {
  readonly id: string;
  readonly name: string;
}

// Type for news source config
export interface NewsSourceConfig {
  readonly name: string;
  readonly baseUrl: string;
  readonly categories: readonly NewsCategory[];
}

/**
 * Get categories for a specific news source
 */
export function getCategoriesForSource(source: NewsSource): readonly NewsCategory[] {
  return NEWS_SOURCE_CATEGORIES[source]?.categories || [];
}

/**
 * Get all available news sources
 */
export function getAllNewsSources(): Array<{ id: NewsSource; name: string }> {
  return Object.entries(NEWS_SOURCE_CATEGORIES).map(([id, config]) => ({
    id: id as NewsSource,
    name: config.name
  }));
}

/**
 * Get source configuration
 */
export function getSourceConfig(source: NewsSource): NewsSourceConfig | null {
  return NEWS_SOURCE_CATEGORIES[source] || null;
}

/**
 * Build API URL for specific source and category
 */
export function buildApiUrl(source: NewsSource, category?: string): string {
  const config = getSourceConfig(source);
  if (!config) {
    throw new Error(`Unknown news source: ${source}`);
  }
  
  const baseUrl = 'https://berita-indo-api-next.vercel.app';
  const categoryPath = category ? `/${category}` : '';
  
  return `${baseUrl}/api/${config.baseUrl}${categoryPath}`;
}

/**
 * Validate if category exists for source
 */
export function isValidCategoryForSource(source: NewsSource, category: string): boolean {
  const categories = getCategoriesForSource(source);
  return categories.some(cat => cat.id === category);
}

/**
 * Get default category for a source (first category)
 */
export function getDefaultCategoryForSource(source: NewsSource): string | null {
  const categories = getCategoriesForSource(source);
  return categories.length > 0 ? categories[0].id : null;
}

/**
 * Get all navigation items for dropdown with proper categories
 */
export function getNavigationItems() {
  return getAllNewsSources().map(source => ({
    label: source.name,
    active: false,
    source: source.id,
    dropdownItems: getCategoriesForSource(source.id).map(cat => cat.name),
    dropdownIds: getCategoriesForSource(source.id).map(cat => cat.id)
  }));
}

/**
 * Get all categories from all sources for the unified "Category" dropdown
 */
export function getAllCategoriesForNavigation(): string[] {
  const allCategories: string[] = [];
  const seenCategories = new Set<string>();

  getAllNewsSources().forEach(source => {
    getCategoriesForSource(source.id).forEach(category => {
      const categoryKey = `${category.name.toLowerCase().trim()}`;
      if (!seenCategories.has(categoryKey)) {
        seenCategories.add(categoryKey);
        allCategories.push(category.name);
      }
    });
  });

  return allCategories.sort();
}

/**
 * Get all category IDs from all sources for the unified "Category" dropdown
 */
export function getAllCategoryIdsForNavigation(): string[] {
  const allCategoryIds: string[] = [];
  const seenCategories = new Set<string>();

  getAllNewsSources().forEach(source => {
    getCategoriesForSource(source.id).forEach(category => {
      const categoryKey = `${category.name.toLowerCase().trim()}`;
      if (!seenCategories.has(categoryKey)) {
        seenCategories.add(categoryKey);
        allCategoryIds.push(category.id);
      }
    });
  });

  return allCategoryIds.sort();
}

/**
 * Get all sources for each category in the unified dropdown
 */
export function getAllCategorySourcesForNavigation(): NewsSource[] {
  const allSources: NewsSource[] = [];
  const seenCategories = new Set<string>();

  getAllNewsSources().forEach(source => {
    getCategoriesForSource(source.id).forEach(category => {
      const categoryKey = `${category.name.toLowerCase().trim()}`;
      if (!seenCategories.has(categoryKey)) {
        seenCategories.add(categoryKey);
        allSources.push(source.id);
      }
    });
  });

  return allSources;
}