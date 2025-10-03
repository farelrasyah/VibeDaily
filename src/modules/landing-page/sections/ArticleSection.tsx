'use client';

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";

type ArticleItem = {
  id: string;
  title: string;
  category: string;
  time: string;
  href: string;
  image: string;
  description?: string;
  tags?: string[];
};

interface ArticleSectionProps {
  items?: ArticleItem[];
}

const ArticleSection: React.FC<ArticleSectionProps> = ({ items }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  const sectionRef = useRef<HTMLElement>(null)

  // Use provided items or fallback to empty array, ensure we always have valid data
  const articles = items && Array.isArray(items) && items.length > 0 ? items.filter(item => item && item.id && item.title) : [];

  const handleImageError = (articleId: string) => {
    setImageErrors(prev => new Set([...prev, articleId]))
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the section is visible
        rootMargin: '0px 0px -100px 0px' // Trigger slightly before fully visible
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  // Debug logging
  console.log('ArticleSection received items:', items?.length || 0)
  console.log('ArticleSection filtered articles:', articles.length)

  // If no articles, show placeholder or nothing
  if (!articles || articles.length === 0) {
    console.log('ArticleSection: No articles to display')
    return (
      <div className="w-full mx-auto max-w-[1200px] px-4 sm:px-6 py-8 text-center text-gray-500">
        <p>Loading articles...</p>
      </div>
    );
  }

  // Right items (6 articles) — ensure we always get exactly 6 UNIQUE articles
  const validArticles = articles.filter(item => item && item.id && item.title);
  
  // Remove featured article from pool to avoid duplication
  const availableForGrid = validArticles.slice(1); // Skip featured article
  
  // Get unique articles only - no duplicates allowed
  const rightItems: ArticleItem[] = [];
  const usedIds = new Set<string>();
  
  // Add featured article ID to used set to avoid duplication
  if (validArticles[0]) {
    usedIds.add(validArticles[0].id);
  }
  
  // Collect unique articles for the grid
  for (const article of availableForGrid) {
    if (!usedIds.has(article.id) && rightItems.length < 6) {
      rightItems.push(article);
      usedIds.add(article.id);
    }
  }
  
  // If we don't have 6 unique articles, repeat from available articles but maintain uniqueness
  // This ensures we always have 6 articles while avoiding duplication within the same render
  if (rightItems.length < 6 && availableForGrid.length > 0) {
    let attempts = 0;
    while (rightItems.length < 6 && attempts < 10) { // Prevent infinite loop
      for (const article of availableForGrid) {
        if (rightItems.length >= 6) break;
        
        // Create a unique identifier for this specific position to avoid exact duplicates
        const positionId = `${article.id}-pos-${rightItems.length}`;
        
        // Allow reuse but with different position identifier
        if (!rightItems.some(item => item.id === article.id && rightItems.indexOf(item) === rightItems.length)) {
          // Create a copy with a modified ID for React key uniqueness
          const articleCopy = { ...article, id: positionId };
          rightItems.push(articleCopy);
        }
      }
      attempts++;
    }
  }
  
  // Ensure exactly 6 articles by filling with available articles if still needed
  while (rightItems.length < 6 && availableForGrid.length > 0) {
    const sourceIndex = rightItems.length % availableForGrid.length;
    const sourceArticle = availableForGrid[sourceIndex];
    const uniqueId = `${sourceArticle.id}-fill-${rightItems.length}`;
    rightItems.push({ ...sourceArticle, id: uniqueId });
  }
  
  const featuredArticle = validArticles[0];

  console.log('ArticleSection: Featured article:', featuredArticle?.title)
  console.log('ArticleSection: Right items count (must be 6):', rightItems.length)
  console.log('ArticleSection: Valid articles total:', validArticles.length)
  console.log('ArticleSection: Available for grid (excluding featured):', availableForGrid.length)

  // If no featured article or not enough articles for a meaningful display, show loading state
  if (!featuredArticle || validArticles.length < 2) {
    return (
      <div className="w-full mx-auto max-w-[1200px] px-4 sm:px-6 py-8 text-center text-gray-500">
        <p>Loading articles... (Need at least 2 unique articles, have {validArticles.length})</p>
      </div>
    );
  }

  return (
    <section ref={sectionRef} className="w-full mx-auto max-w-[1200px] px-4 sm:px-6 py-8 sm:py-12 md:py-16 relative">
      {/* Flag "NEWS UPDATE" - responsive */}
      <div className="absolute top-10 sm:top-11 md:top-12 left-0 mb-6 sm:mb-7 md:mb-8 mt-2">
        <div className="flex items-center relative">
          <div className="w-0.5 h-5 sm:h-6 bg-violet-600 rounded-full z-10"></div>
          <div className="relative -ml-0.5">
            <span className="text-xs sm:text-sm font-semibold text-gray-800 uppercase tracking-wide pl-1">
              NEWS UPDATE
            </span>
            {/* Violet fade effect overlay starting from left */}
            <div className="absolute inset-0 left-0 bg-gradient-to-r from-violet-600/15 via-violet-500/8 via-violet-400/4 via-violet-300/2 via-violet-200/1 to-transparent pointer-events-none"></div>
          </div>
        </div>
      </div>

      {/* Header with View more button - responsive */}
      <div className="mb-6 sm:mb-7 md:mb-8 w-screen relative left-1/2 right-1/2 -ml-[100px] -mr-[200px]">
        <div className="flex justify-end pr-0 -mr-4">
          <a
            href="#"
            className="group inline-flex items-center gap-1.5 sm:gap-2 text-sm sm:text-[15px] font-semibold text-slate-900 mr-110"
          >
            <span>View more</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 18 18"
              className="sm:w-[18px] sm:h-[18px] transition-transform group-hover:translate-x-0.5"
            >
              <path
                d="M7.5 5.25L10.5 9L7.5 12.75"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>

      {/* Main grid layout - mobile first responsive */}
      <div className="grid grid-cols-1 gap-6 md:gap-5 lg:grid-cols-5 lg:gap-4">
        {/* Featured article - responsive sizing */}
        <div className="lg:col-span-3 -mx-4 sm:-mx-6 lg:-ml-8">
          <a href={featuredArticle.href} target="_blank" rel="noopener noreferrer" className="block">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden h-[240px] sm:h-[320px] md:h-[380px] lg:h-[500px] cursor-pointer">
            {/* Background image with fallback */}
            {featuredArticle.image && !imageErrors.has(featuredArticle.id) ? (
              <img
                src={featuredArticle.image}
                alt={featuredArticle.title}
                className={`absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-out ${isVisible ? 'zoom-in-image' : ''}`}
                onError={() => handleImageError(featuredArticle.id)}
                loading="lazy"
              />
            ) : (
              <div className={`absolute inset-0 h-full w-full bg-gradient-to-br from-gray-200 to-gray-300 transition-transform duration-1000 ease-out ${isVisible ? 'zoom-in-image' : ''}`} />
            )}
            {/* Gradient overlay */}
            <div className="featured-gradient" />

            {/* Content overlay */}
            <div className="relative z-10 h-full flex flex-col justify-end p-6 lg:p-8">
              <div className="mb-2 flex items-center gap-2 text-white/80 text-sm">
                <span className="font-medium">{featuredArticle.category}</span>
                <span>• {featuredArticle.time}</span>
              </div>

              <h2 className="text-white font-bold leading-tight text-xl lg:text-2xl mb-3 max-w-[90%]">
                {featuredArticle.title}
              </h2>

              <p className="text-white/90 text-sm lg:text-base max-w-[95%] leading-relaxed">
                {featuredArticle.description || featuredArticle.title}
              </p>
            </div>
          </div>
          </a>
        </div>

        {/* Right grid - responsive layout */}
        <div className="lg:col-span-2 relative">
          <div className="lg:pl-6 xl:pl-10 relative">
            {/* Grid container - responsive for mobile/tablet */}
            <div className="relative lg:static lg:w-[260%] lg:-mt-6">
              <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 md:gap-x-8 lg:grid-cols-2 lg:gap-x-12 lg:gap-y-0">
                {rightItems.slice(0, 6).map((article, idx) => (
                  <article key={`article-${article.id}-${idx}`} className="group">
                    <a href={article.href} target="_blank" rel="noopener noreferrer" className="block hover:opacity-80 transition-opacity">
                      <div className="grid grid-cols-[1fr_70px] sm:grid-cols-[1fr_80px] lg:grid-cols-[1fr_90px] gap-3 sm:gap-4 lg:gap-5 py-4 sm:py-5 lg:py-6 px-0 min-h-[120px] sm:min-h-[130px] lg:min-h-[140px]">
                        {/* Text content on the left - responsive */}
                        <div className="flex flex-col justify-start min-w-0 pr-1 sm:pr-2">
                          <div className="mb-1.5 sm:mb-2 font-medium text-[11px] sm:text-[12px]">
                            <span className="text-[#567FB0] font-semibold">{article.category}</span>
                            <span className="mx-1.5 sm:mx-2 text-slate-400">•</span>
                            <span className="text-slate-500">{article.time}</span>
                          </div>

                          <h3 className="font-bold text-slate-900 mb-2 sm:mb-3 leading-tight line-clamp-3 text-base sm:text-lg lg:text-[18px]">
                            {article.title}
                          </h3>

                          <div className="text-slate-500 mt-auto text-xs sm:text-sm lg:text-[14px]">
                            {article.tags && article.tags.length > 0 ? (
                              <>#{article.tags[0]}</>
                            ) : (
                              <>#{article.category}</>
                            )}
                          </div>
                        </div>

                        {/* Image on the right - responsive sizing */}
                        <div className="w-[70px] h-[70px] sm:w-[80px] sm:h-[80px] lg:w-[81px] lg:h-[81px] rounded-lg sm:rounded-xl overflow-hidden flex-shrink-0">
                          {article.image && !imageErrors.has(article.id) ? (
                            <img
                              src={article.image}
                              alt={article.title}
                              className={`w-full h-full object-cover transition-transform duration-700 ease-out ${isVisible ? 'zoom-in-thumbnail' : ''}`}
                              style={{ animationDelay: `${idx * 150}ms` }}
                              onError={() => handleImageError(article.id)}
                              loading="lazy"
                            />
                          ) : (
                            <div 
                              className={`w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center transition-transform duration-700 ease-out ${isVisible ? 'zoom-in-thumbnail' : ''}`}
                              style={{ animationDelay: `${idx * 150}ms` }}
                            >
                              <span className="text-gray-500 text-xs">No Image</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Separator line - responsive and only for large screens */}
                      {idx < rightItems.length - 1 && (
                        <hr className="hidden lg:block border-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mx-4 my-0" />
                      )}
                    </a>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArticleSection;