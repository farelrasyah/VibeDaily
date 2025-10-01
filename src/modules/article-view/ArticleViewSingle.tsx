"use client";
// This file uses React hooks and must be a client component
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import ContentHub from "../../common/ContentHub";
import ArticleFooter from "../../common/ArticleFooter";
import { NewsArticle } from "@/types/news.types";

interface ArticleViewSingleProps {
  articleId: string;
}

/**
 * Single-file version combining:
 * - BackButton
 * - AuthorInfo
 * - ImageGrid
 * - ArticleStats
 * - ArticleView (default export)
 *
 * Notes:
 * - This expects TailwindCSS + your existing `index.css` (fonts & .serif-font) to be present.
 */

const BackButton: React.FC = () => {
  const router = useRouter();
  return (
    <button
      className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
      aria-label="Back to list"
      onClick={() => router.back()}
    >
      <svg
        className="w-5 h-5 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      <span className="text-sm font-medium">Back to list</span>
    </button>
  );
};

const AuthorInfo: React.FC<{ article?: NewsArticle }> = ({ article }) => {
  return (
    <div className="flex items-center">
      <img
        src="https://dummyimage.com/40x40/e5e7eb/6b7280?text=JD"
        alt={article?.author || "Author"}
        className="w-10 h-10 rounded-full mr-3"
        referrerPolicy="no-referrer"
      />
      <span className="text-gray-700 font-medium">{article?.author || "Anonymous"}</span>
    </div>
  );
};

const ImageGrid: React.FC<{ article?: NewsArticle }> = ({ article }) => {
  const mainImage = article?.imageUrl || "https://dummyimage.com/1200x675/ff6b47/ffffff?text=News+Image";
  
  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Hero Image - Full Width */}
      <div className="aspect-[16/9] lg:aspect-[21/9] rounded-2xl lg:rounded-3xl overflow-hidden">
        <img
          src={mainImage}
          alt={article?.title || "News image"}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Grid of smaller images - keep for layout but use related images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
        {/* Left Image - Wooden stairs */}
        <div className="aspect-[4/5] rounded-2xl overflow-hidden">
          <img
            src="https://dummyimage.com/400x500/d4a574/ffffff?text=Related+Image+1"
            alt="Related content"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Right Image - White geometric structure with number */}
        <div className="aspect-[4/5] rounded-2xl overflow-hidden relative">
          <img
            src="https://dummyimage.com/400x500/f8fafc/94a3b8?text=Related+Image+2"
            alt="Related content"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-4 right-4 text-gray-600">
            <span className="text-3xl lg:text-4xl font-bold">68</span>
            <span className="text-lg lg:text-xl">+</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ArticleStats: React.FC<{ article?: NewsArticle }> = ({ article }) => {
  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="mt-16 lg:mt-20 xl:mt-24 pt-8 lg:pt-12 border-t border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 sm:gap-8">
        <div className="flex items-center space-x-8 lg:space-x-12">
          <div className="flex items-center text-gray-600 hover:text-gray-900 transition-colors cursor-pointer">
            <svg className="w-5 h-5 lg:w-6 lg:h-6 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-label="Likes">
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm lg:text-base font-medium">2.1k Likes</span>
          </div>

          <div className="flex items-center text-gray-600 hover:text-gray-900 transition-colors cursor-pointer">
            <svg
              className="w-5 h-5 lg:w-6 lg:h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-label="Comments"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-sm lg:text-base font-medium">1.4k Comments</span>
          </div>

          <div className="flex items-center text-gray-600 hover:text-gray-900 transition-colors cursor-pointer">
            <svg
              className="w-5 h-5 lg:w-6 lg:h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-label="Shares"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            <span className="text-sm lg:text-base font-medium">Share</span>
          </div>
        </div>

        <div className="flex items-center text-gray-600">
          <span className="text-sm lg:text-base">Published</span>
          <span className="ml-2 lg:ml-4 font-medium text-gray-900">
            {article?.publishedAt ? formatDate(article.publishedAt) : '2 days ago'}
          </span>
        </div>
      </div>
    </div>
  );
};


const ArticleView: React.FC<ArticleViewSingleProps> = ({ articleId }) => {
  // Ref untuk container artikel Content Hub
  const contentHubRef = useRef<HTMLDivElement>(null);
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔍 Fetching article with ID:', articleId);
        
        // Use internal API route to avoid CORS issues
        const response = await fetch(`/api/article/${articleId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Article not found');
          } else {
            setError('Failed to load article');
          }
          return;
        }
        
        const data = await response.json();
        
        if (data.article) {
          console.log('✅ Article fetched successfully:', data.article.title);
          setArticle(data.article);
        } else {
          setError('Article not found');
        }
      } catch (err) {
        setError('Failed to load article');
        console.error('Error fetching article:', err);
      } finally {
        setLoading(false);
      }
    };

    if (articleId) {
      fetchArticle();
    }
  }, [articleId]);

  // Fungsi scroll
  const scrollContentHub = (dir: "left" | "right") => {
    const container = contentHubRef.current;
    if (!container) return;
    const scrollAmount = 370; // card width + gap
    container.scrollBy({
      left: dir === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] via-[#e9eff6] to-[#dbeafe] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-violet-600 mx-auto"></div>
          <p className="mt-4 text-lg text-slate-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] via-[#e9eff6] to-[#dbeafe] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Article Not Found</h1>
          <p className="text-lg text-slate-600 mb-8">{error || 'The article you are looking for does not exist.'}</p>
          <button
            onClick={() => window.history.back()}
            className="bg-violet-600 text-white px-6 py-3 rounded-lg hover:bg-violet-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const heroImage = article.imageUrl || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] via-[#e9eff6] to-[#dbeafe]">
      <main className="w-full min-h-screen flex flex-col items-stretch justify-start">
        {/* Hero Section */}
        <section className="relative w-full h-[38vw] min-h-[320px] max-h-[520px] overflow-hidden shadow-2xl rounded-b-[2.5rem] flex items-end">
          <img
            src={heroImage}
            alt={article.title}
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000"
            style={{ filter: 'brightness(0.92) saturate(1.1)' }}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          {/* Floating back button */}
          <div className="absolute top-8 left-8 z-30">
            <button
              className="group flex items-center text-slate-700 hover:text-slate-900 transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-lg px-5 py-2.5 rounded-full shadow-xl border border-slate-200/70"
              aria-label="Back to list"
              onClick={() => window.history.length > 1 ? window.history.back() : window.location.assign('/')}>
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-lg font-semibold tracking-wide">Back</span>
            </button>
          </div>
        </section>

        {/* Header Section */}
        <header className="w-full px-4 sm:px-8 md:px-16 xl:px-24 2xl:px-32 -mt-20 z-10 relative">
          <div className="max-w-6xl mx-auto text-center bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl px-10 py-12 border border-slate-200/70">
            <h1
              className="serif-font font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-7 tracking-tight drop-shadow-xl mx-auto"
              style={{ fontFamily: `'Playfair Display', 'Merriweather', Georgia, serif` }}
            >
              {article.title}
            </h1>
            {/* Author info with elegant card */}
            <div className="flex items-center gap-5 mb-2 justify-center">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt={article.author || "Author"}
                className="w-14 h-14 rounded-full ring-4 ring-white shadow-lg"
                referrerPolicy="no-referrer"
              />
              <div className="text-left">
                <span className="text-slate-800 font-semibold text-lg">{article.author || "Anonymous"}</span>
                <div className="text-slate-500 text-base">{article.source.name}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Layout */}
        <section className="w-full px-2 sm:px-6 md:px-12 xl:px-20 2xl:px-32 mt-14 mb-16">
          <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-5 gap-8 xl:gap-12 2xl:gap-16">
            {/* Main Content Column */}
            <div className="xl:col-span-3">
              <div className="max-w-none xl:max-w-3xl 2xl:max-w-4xl space-y-10 text-slate-800 leading-relaxed">
                <div className="text-lg sm:text-xl lg:text-2xl leading-relaxed text-slate-700 font-light">
                  <p className="mb-7">
                    {article.description}
                  </p>

                  {article.content && (
                    <div className="mb-7" dangerouslySetInnerHTML={{ __html: article.content }} />
                  )}

                  <p className="mb-7">
                    This article was originally published by {article.source.name}. 
                    {article.url && (
                      <>
                        {" "}
                        <a 
                          href={article.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-violet-600 hover:text-violet-800 underline"
                        >
                          Read the full article here
                        </a>
                        .
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar Images - Modern Masonry Grid, refined for clarity */}
            <div className="xl:col-span-2 grid grid-cols-2 grid-rows-3 gap-4 xl:gap-6 2xl:gap-8 h-full">
              {/* Tall image left */}
              <div className="relative row-span-3 col-span-1 rounded-3xl overflow-hidden shadow-2xl group flex flex-col">
                <img
                  src={article.imageUrl || "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80"}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none"></div>
                <div className="absolute bottom-3 left-3 bg-white/70 px-3 py-1.5 rounded-full shadow text-slate-800 text-sm font-medium backdrop-blur-sm opacity-90 group-hover:opacity-100 transition-opacity">
                  {article.category || article.source.name}
                </div>
              </div>

              {/* Top right - small image */}
              <div className="relative row-span-1 col-span-1 rounded-2xl overflow-hidden shadow-xl group">
                <img
                  src="https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=400&q=80"
                  alt="Related content"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/5 pointer-events-none"></div>
                <div className="absolute top-2 right-2 bg-white/80 backdrop-blur rounded-full w-8 h-8 flex items-center justify-center shadow text-slate-700 text-base font-bold opacity-90 group-hover:opacity-100 transition-opacity">68</div>
              </div>

              {/* Middle right - wide image */}
              <div className="relative row-span-1 col-span-1 rounded-2xl overflow-hidden shadow-xl group flex items-end">
                <img
                  src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80"
                  alt="Related content"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none"></div>
                <div className="absolute bottom-2 left-2 bg-white/70 px-2 py-1 rounded-full shadow text-slate-700 text-xs font-medium backdrop-blur-sm opacity-90 group-hover:opacity-100 transition-opacity">Related</div>
              </div>

              {/* Bottom right - portrait image */}
              <div className="relative row-span-1 col-span-1 rounded-2xl overflow-hidden shadow-xl group flex items-center">
                <img
                  src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80"
                  alt="Related content"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none"></div>
                <div className="absolute top-2 left-2 bg-white/70 px-2 py-1 rounded-full shadow text-slate-700 text-xs font-medium backdrop-blur-sm opacity-90 group-hover:opacity-100 transition-opacity">News</div>
              </div>
            </div>
          </div>
        </section>

        {/* Article Stats Section - now uses article data */}
        <ArticleStats article={article} />


        {/* Content Hub Section */}
        <ContentHub />

        {/* Article Footer Section */}
        <ArticleFooter />
      </main>
    </div>
  );
};

export default ArticleView;
