// SocialMediaSection.tsx
import React, { useRef, useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

/**
 * SocialMediaSection
 * - IG cards sama seperti sebelumnya
 * - Featured News: menggunakan data real dari API
 * - News List: menggunakan data real dari API
 */

// NO MORE DUMMY DATA - all removed

// Add interfaces for API data
interface NewsItem {
  id: string;
  title: string;
  category: string;
  time: string;
  href: string;
  description?: string;
  tags?: string[];
}

interface SocialMediaSectionProps {
  featuredNews?: NewsItem;
  newsList?: NewsItem[];
  newsImages?: string[]; // Array of news images to replace dummy social media images
  backgroundImage?: string; // News image for background
  // Add new prop for all articles with images
  allArticles?: Array<{
    id: string;
    title: string;
    category: string;
    time: string;
    href: string;
    description?: string;
    tags?: string[];
    imageUrl?: string;
  }>;
}

type CardProps = {
  img: string;
  blueBar?: boolean;
  className?: string;
  isVisible?: boolean;
  index?: number;
  fallbackGradient?: string;
};

function InstaCard({ img, blueBar = false, className = "", isVisible = false, index = 0, fallbackGradient = "from-gray-500 to-gray-600" }: CardProps) {
  return (
    <div
      className={["group relative w-[280px] sm:w-[320px] md:w-[360px] lg:w-[390px] h-[420px] sm:h-[480px] md:h-[520px] lg:h-[570px] rounded-[24px] sm:rounded-[28px]",
        "bg-white/10 backdrop-blur-xl border border-white/20",
        "shadow-[0_28px_110px_-14px_rgba(0,0,0,0.28)]",
        "overflow-hidden",
        className,
      ].join(" ")}
    >
      {/* Header - responsive */}
      <div className="h-[60px] sm:h-[68px] md:h-[72px] px-4 sm:px-5 flex items-center justify-between bg-white/15 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-[2px] sm:p-[3px] rounded-full bg-gradient-to-tr from-rose-400/80 via-purple-500/80 to-blue-500/80">
            <div className="p-[2px] sm:p-[3px] bg-white/90 rounded-full">
             <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">◉</span>
                </div>
            </div>
          </div>
          <span className="text-[10px] sm:text-[11px] md:text-[12px] font-semibold text-white/90 bg-white/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-white/15">
            VibeDaily
          </span>
        </div>
        <svg className="w-4 sm:w-5 h-4 sm:h-5 text-white/80" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </div>
      {/* Media - responsive */}
      <div className="relative h-[240px] sm:h-[280px] md:h-[320px] lg:h-[336px] overflow-hidden">
        {img && img.trim() !== '' ? (
          <img
            src={img}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 ${isVisible ? 'zoom-in-thumbnail' : ''}`}
            style={{ animationDelay: `${index * 200}ms` }}
          />
        ) : (
          <div 
            className={`absolute inset-0 w-full h-full bg-gradient-to-br ${fallbackGradient} transition-transform duration-700 ease-out group-hover:scale-110`}
            style={{ animationDelay: `${index * 200}ms` }}
          />
        )}
        <div className="absolute inset-0 ring-1 ring-white/10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-24 sm:h-28 md:h-32 lg:h-36 bg-gradient-to-t from-black/35 to-transparent" />
      </div>
      {/* Footer – responsive */}
      <div
        className={["h-[70px] sm:h-[80px] md:h-[88px] lg:h-[92px] border-t border-white/10 flex items-center justify-between px-4 sm:px-5",
          blueBar ? "bg-gradient-to-r from-blue-500/35 to-purple-600/35" : "bg-white/25",
          "backdrop-blur-md",
        ].join(" ")}
      >
        <div className="flex items-center gap-4 sm:gap-5 md:gap-6">
          <svg viewBox="0 0 24 24" className="w-5 sm:w-6 h-5 sm:h-6 text-rose-500 fill-current">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          <svg className="w-5 sm:w-6 h-5 sm:h-6 text-white/85" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.118 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.118-8 9-8s9 3.582 9 8z" />
          </svg>
          <svg className="w-5 sm:w-6 h-5 sm:h-6 text-white/85" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </div>
        <svg className="w-6 h-6 text-white/85" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      </div>
    </div>
  );
}
const SocialMediaSection: React.FC<SocialMediaSectionProps> = ({ 
  featuredNews, 
  newsList = [],
  newsImages = [],
  backgroundImage,
  allArticles = []
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const router = useRouter()

  // Get images from articles with fallback to newsImages
  const getAvailableImages = () => {
    // First try to get images from allArticles
    const articlesWithImages = allArticles
      .filter(article => article.imageUrl && article.imageUrl.trim() !== '' && !article.imageUrl.includes('picsum.photos'))
      .map(article => article.imageUrl!);
    
    // If we have valid images from articles, use them
    if (articlesWithImages.length >= 3) {
      return articlesWithImages.slice(0, 3);
    }
    
    // If not enough from articles, combine with newsImages
    const allImages = [...articlesWithImages, ...newsImages.filter(img => img && img.trim() !== '')];
    
    if (allImages.length >= 3) {
      return allImages.slice(0, 3);
    }
    
    // If still not enough, fill with available images (repeat if necessary)
    if (allImages.length > 0) {
      const result = [...allImages];
      while (result.length < 3) {
        result.push(allImages[0]);
      }
      return result;
    }
    
    // No valid images, return empty strings (will use fallback gradients)
    return ['', '', ''];
  };

  const cardImages = getAvailableImages();
  const bgImage = backgroundImage || (allArticles.find(article => 
    article.imageUrl && article.imageUrl.trim() !== '' && !article.imageUrl.includes('picsum.photos')
  )?.imageUrl);

  // Debug logs
  console.log('🔍 SocialMediaSection Debug:')
  console.log('- featuredNews:', featuredNews)
  console.log('- newsList length:', newsList.length)
  console.log('- allArticles length:', allArticles.length)
  console.log('- cardImages:', cardImages)
  console.log('- backgroundImage:', bgImage)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
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

  return (
    <section ref={sectionRef} className="relative w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
      <div className="relative mx-auto w-full max-w-[1280px] overflow-hidden rounded-[24px] sm:rounded-[28px] md:rounded-[32px] lg:rounded-[40px] xl:rounded-[48px] border border-white/15 bg-white/[0.06] backdrop-blur-xl shadow-[0_40px_140px_-30px_rgba(0,0,0,0.5)]">
        {/* Fade ungu identik dengan ArticleSection */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-[320px] z-20">
          <div className="absolute inset-0 bg-gradient-to-l from-violet-600/15 via-violet-500/8 via-violet-400/4 via-violet-300/2 via-violet-200/1 to-transparent" />
        </div>
        {/* Background layers */}
        <div className="absolute inset-0 -z-10">
          {bgImage ? (
            <img src={bgImage} alt="Background" className={`w-full h-full object-cover scale-110 blur-[2px] transition-transform duration-1000 ease-out ${isVisible ? 'zoom-in-image' : ''}`} />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-900 via-purple-800 to-rose-700" />
          )}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-purple-800/30 to-rose-700/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
          <div className="absolute inset-0 ring-1 ring-white/10 rounded-[inherit] pointer-events-none" />
        </div>
        {/* === FEATURED NEWS (menggunakan data real dari API) === */}
        <div className="absolute left-0 bottom-[-8px] md:bottom-[-12px] z-30 p-0">
          {featuredNews && (
            <article
              className={["relative bg-white/60 backdrop-blur-xl","px-8 py-7 sm:px-10 sm:py-8","rounded-[28px] rounded-tl-[56px]","max-w-[520px] min-w-[360px]"].join(" ")}
            >
              <div className="mb-3 flex items-center gap-2 text-[13px] text-black/60">
                <span className="font-medium">{featuredNews.category}</span>
                <span className="opacity-60">•</span>
                <span>{featuredNews.time}</span>
              </div>
              <h2 
                className="text-[28px] sm:text-[32px] font-extrabold text-black leading-tight tracking-[-0.01em] max-w-[32ch] mb-3"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {featuredNews.title}
              </h2>
              {featuredNews.tags && featuredNews.tags.length > 0 && (
                <ul className="flex flex-wrap gap-x-6 gap-y-2 mb-6 text-[13px] text-black/55">
                  {featuredNews.tags.slice(0, 3).map((tag, index) => (
                    <li key={index}>#{tag}</li>
                  ))}
                </ul>
              )}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push('/article/' + featuredNews.id)}
                  className="inline-flex items-center rounded-full border border-black/10 bg-[#E9F0FF] px-5 py-3 text-[15px] font-semibold text-black transition-colors hover:bg-[#dfe8ff] cursor-pointer"
                >
                  Read article
                </button>
                <button
                  onClick={() => router.push('/article/' + featuredNews.id)}
                  aria-label="Open article"
                  className="grid h-11 w-11 place-items-center rounded-full border border-black/10 bg-[#E9F0FF] transition-transform hover:bg-[#dfe8ff] hover:translate-x-[2px] cursor-pointer"
                >
                  <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </article>
          )}
        </div>
        {/* === NEWS LIST DI POJOK KANAN ATAS (menggunakan data real dari API) === */}

{/* News Sidebar (dengan data real dari API) */}
<div className="absolute top-0 bottom-0 right-0 w-[320px] pr-6 z-40">
  <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
    <div className="w-full h-full bg-gradient-to-l from-violet-600/50 via-violet-500/40 to-transparent" />
  </div>
  <div className="relative h-full z-10">
    {/* Container item: mengisi tinggi dan scrollable jika overflow */}
    <div className="relative h-full overflow-auto pt-4 pb-6">
      <div className="flex flex-col">
        {newsList.length > 0 ? (
          newsList.slice(0, 8).map((news) => (
            <div
              key={news.id}
              onClick={() => router.push('/article/' + news.id)}
              className="pl-12 py-3 border-b border-white/20 last:border-none transition-all duration-500 hover:bg-white/5 cursor-pointer group"
            >
              <div className="text-[12px] text-white/60 font-medium mb-1">
                {news.category} <span className="opacity-60">•</span> {news.time}
              </div>
              <div 
                className="font-bold text-white text-[16px] leading-tight tracking-tight group-hover:text-white/90 transition-colors"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {news.title}
              </div>
            </div>
          ))
        ) : (
          // Show message if no news data
          <div className="pl-12 py-6 text-center">
            <div className="text-white/60 text-[14px]">
              Loading news...
            </div>
          </div>
        )}

        {/* Spacer bawah */}
        <div className="h-6" />
      </div>
    </div>
  </div>
</div>

        {/* Instagram Cards - always show, use news images if available, fallback to solid colors */}
        <div className="relative z-10 px-6 md:px-10 xl:px-12 py-10 md:py-14">
          <div className="grid grid-cols-1 gap-y-10">
            <div className="flex justify-center items-center">
              <InstaCard 
                img={cardImages[0] || ""} 
                className="scale-90 -ml-4 z-10" 
                isVisible={isVisible} 
                index={0} 
                fallbackGradient="from-rose-500 to-pink-600"
              />
              <InstaCard 
                img={cardImages[1] || ""} 
                className="z-20" 
                isVisible={isVisible} 
                index={1} 
                fallbackGradient="from-blue-500 to-purple-600"
              />
              <InstaCard 
                img={cardImages[2] || ""} 
                className="scale-90 -mr-4 z-10" 
                isVisible={isVisible} 
                index={2} 
                fallbackGradient="from-green-500 to-teal-600"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SocialMediaSection;
