// Unified News Article Interface (normalized dari kedua API)
export interface NewsArticle {
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
  publishedAt: string; // ISO format
  category?: string;
  language: 'id' | 'en';
}

// NewsAPI.org Response Types
export interface NewsApiOrgResponse {
  status: string;
  totalResults: number;
  articles: NewsApiOrgArticle[];
}

export interface NewsApiOrgArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

// Berita Indo API Response Types
export interface BeritaIndoResponse {
  messages: string;  // API uses 'messages' not 'message'
  total: number;
  data: BeritaIndoArticle[];
}

export interface BeritaIndoArticle {
  title: string;
  link: string;
  contentSnippet?: string;
  isoDate: string;
  image?: {
    small?: string;
    large?: string;
  };
  description?: string;
}

// API Response Wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T[];
  totalResults?: number;
  error?: string;
}
