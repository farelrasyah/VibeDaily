"use client";
// This file uses React hooks and must be a client component
import React, { useState, useEffect } from "react";
import ContentHub from "../../common/ContentHub";
import ArticleFooter from "../../common/ArticleFooter";
import { NewsArticle } from "@/types/news.types";
import { useEnhancedImage, generateImageSrcSet, generateImageFallbacks } from "../../lib/utils/image-enhancer";

interface ArticleViewSingleProps {
  articleId: string;
}

/**
 * Single-file version combining:
 * - ImageGrid
 * - ArticleStats
 * - ArticleView (default export)
 *
 * Notes:
 * - This expects TailwindCSS + your existing `index.css` (fonts & .serif-font) to be present.
 */

const ArticleView: React.FC<ArticleViewSingleProps> = ({ articleId }) => {
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Call hooks unconditionally before any early returns
  const heroImage = article?.imageUrl || null;
  const enhancedHeroImage = useEnhancedImage(heroImage);
  const enhancedArticleImage = useEnhancedImage(article?.imageUrl || null);
  const heroSrcSet = generateImageSrcSet(heroImage);
  const articleSrcSet = generateImageSrcSet(article?.imageUrl || null);
  const heroFallbacks = generateImageFallbacks(heroImage);
  const articleFallbacks = generateImageFallbacks(article?.imageUrl || null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔍 Fetching article with ID:', articleId);
        
        // Use internal API route to avoid CORS issues
        const response = await fetch(`/api/article/${articleId}`);
        
        console.log('📡 API response status:', response.status);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Article not found');
          } else {
            setError('Failed to load article');
          }
          return;
        }
        
        const data = await response.json();
        console.log('📦 API response data:', data);
        
        if (data.article) {
          console.log('✅ Article fetched successfully:', data.article.title);
          console.log('📝 Article content length:', data.article.content?.length || 0);
          console.log('📝 Article description length:', data.article.description?.length || 0);
          console.log('🖼️ Article image URL:', data.article.imageUrl);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] via-[#e9eff6] to-[#dbeafe]">
      <main className="w-full min-h-screen flex flex-col items-stretch justify-start">
        {/* Hero Section - only show if image exists */}
        {heroImage && (
          <section className="relative w-full h-[38vw] min-h-[320px] max-h-[520px] overflow-hidden shadow-2xl rounded-b-[2.5rem] flex items-end">
            <img
              src={enhancedHeroImage || heroImage}
              srcSet={heroSrcSet || undefined}
              alt={article.title}
              className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000"
              style={{
                filter: 'brightness(0.92) saturate(1.1) contrast(1.1)',
                imageRendering: 'auto'
              }}
              referrerPolicy="no-referrer"
              loading="eager"
              decoding="async"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                const currentSrc = img.src;
                const fallbackIndex = heroFallbacks.indexOf(currentSrc);
                if (fallbackIndex < heroFallbacks.length - 1) {
                  img.src = heroFallbacks[fallbackIndex + 1];
                }
              }}
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
        )}

        {/* Header Section - adjust margin if no hero */}
        <header className={`w-full px-4 sm:px-8 md:px-16 xl:px-24 2xl:px-32 z-10 relative ${heroImage ? '-mt-20' : 'mt-8'}`}>
          {/* Back button if no hero image */}
          {!heroImage && (
            <div className="max-w-6xl mx-auto mb-8">
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
          )}
          <div className="max-w-6xl mx-auto text-center bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl px-10 py-12 border border-slate-200/70">
            <h1
              className="serif-font font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-7 tracking-tight drop-shadow-xl mx-auto"
              style={{ fontFamily: `'Playfair Display', 'Merriweather', Georgia, serif` }}
            >
              {article.title}
            </h1>
            {/* Author info with elegant card */}
            <div className="flex items-center gap-5 mb-2 justify-center">
              <div className="text-left">
                <span className="text-slate-800 font-semibold text-lg">{article.source.name || "Anonymous"}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Layout */}
        <section className="w-full px-2 sm:px-6 md:px-12 xl:px-20 2xl:px-32 mt-14 mb-16">
          <div className={`max-w-7xl mx-auto grid gap-8 xl:gap-12 2xl:gap-16 ${article.imageUrl ? 'grid-cols-1 xl:grid-cols-5' : 'grid-cols-1'}`}>
            {/* Main Content Column */}
            <div className={`${article.imageUrl ? 'xl:col-span-3' : ''}`}>
              <div className="max-w-none xl:max-w-3xl 2xl:max-w-4xl space-y-10 text-slate-800 leading-relaxed">
                <div className="text-lg sm:text-xl lg:text-2xl leading-relaxed text-slate-700 font-light">
                  {/* Show description if available */}
                  {article.description && article.description.trim() && (
                    <p className="mb-7">
                      {article.description}
                    </p>
                  )}

                  {/* Show content if it's different from description and available */}
                  {article.content && article.content.trim() && article.content !== article.description && (
                    <div className="mb-7" dangerouslySetInnerHTML={{ __html: article.content }} />
                  )}

                  {/* If no content or description, show a message */}
                  {(!article.description || !article.description.trim()) && (!article.content || !article.content.trim()) && (
                    <p className="mb-7 text-slate-600 italic">
                      Full article content is not available from this source.
                    </p>
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
                          className="text-violet-600 hover:text-violet-800 underline font-medium"
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

            {/* Sidebar Images - Only show if article has image */}
            {article.imageUrl && (
              <div className="xl:col-span-2">
                <div className="rounded-3xl overflow-hidden shadow-2xl group h-[400px] lg:h-[500px] xl:h-[600px]">
                  <img
                    src={enhancedArticleImage || article.imageUrl}
                    srcSet={articleSrcSet || undefined}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{
                      filter: 'contrast(1.1) saturate(1.05)',
                      imageRendering: 'auto'
                    }}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      const currentSrc = img.src;
                      const fallbackIndex = articleFallbacks.indexOf(currentSrc);
                      if (fallbackIndex < articleFallbacks.length - 1) {
                        img.src = articleFallbacks[fallbackIndex + 1];
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none"></div>
                
                </div>
              </div>
            )}
          </div>
        </section>



        {/* Content Hub Section */}
        <ContentHub />

        {/* Article Footer Section */}
        <ArticleFooter articleId={articleId} publishedAt={article?.publishedAt} />
      </main>
    </div>
  );
};

export default ArticleView;
