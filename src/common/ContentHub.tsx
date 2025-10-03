"use client";
import React, { useRef, useState, useEffect } from "react";
import { newsService } from "@/lib/api";
import { NewsArticle } from "@/types/news.types";

const ContentHub: React.FC = () => {
  const contentHubRef = useRef<HTMLDivElement>(null);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('ContentHub: Fetching articles...');
        
        // Use the improved mixed news API that already handles multiple sources
        const data = await newsService.getMixedNews(8);
        console.log('ContentHub: Fetched mixed news:', data);
        
        if (data && data.length > 0) {
          setArticles(data);
          console.log(`ContentHub: Successfully loaded ${data.length} articles from multiple sources`);
        } else {
          console.log('ContentHub: No articles from mixed news, trying trending...');
          // Fallback to trending news
          const trendingData = await newsService.getTrendingNews(8);
          if (trendingData && trendingData.length > 0) {
            setArticles(trendingData);
            console.log(`ContentHub: Successfully loaded ${trendingData.length} trending articles`);
          } else {
            setError('No articles available from any source');
          }
        }
      } catch (err) {
        console.error('ContentHub: Error fetching articles:', err);
        setError(`Failed to load articles: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const isValidImageUrl = (url: string | null) => {
    if (!url || url.trim() === '') return false;
    // Filter out placeholder/dummy images
    const invalidPatterns = ['picsum.photos', 'oval.gif', 'placeholder', 'dummy', 'example.com'];
    return !invalidPatterns.some(pattern => url.toLowerCase().includes(pattern));
  };

  const scrollContentHub = (dir: "left" | "right") => {
    const container = contentHubRef.current;
    if (!container) return;
    const scrollAmount = 370;
    container.scrollBy({
      left: dir === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full bg-white pt-12 pb-8 px-4 md:px-0 border-t border-gray-100">
      <div className="max-w-[1400px] mx-auto">
        <div className="relative flex flex-col items-center mb-2 px-4 gap-4 min-h-[100px] lg:flex-row lg:px-8 lg:gap-4">
          {/* Button kiri */}
          <div className="flex-1 flex items-center justify-start w-full lg:flex-1 lg:justify-start">
            <button className="bg-black text-white font-bold rounded-full px-4 py-1 text-base md:px-7 md:py-2 md:text-lg shadow-none hover:scale-105 transition-all" style={{fontFamily:'Sequel Sans Disp, Arial, sans-serif', boxShadow:'0 2px 8px 0 rgba(0,0,0,0.10)'}}>Read all articles</button>
          </div>
          {/* Heading center absolute */}
          <div className="w-full flex justify-center lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:pointer-events-none">
            <span
              style={{
                color: '#0F0F0F',
                fontSize: '40px',
                fontFamily: 'Sequel Sans Disp, Arial, sans-serif',
                fontWeight: 400,
                letterSpacing: '-0.04em',
                lineHeight: 1.1,
                display: 'block',
                marginBottom: '8px',
                marginLeft: '0',
                marginRight: '0',
                whiteSpace: 'nowrap',
                textAlign: 'center',
              }}
              className="text-center select-none lg:text-[80px]"
            >
              Content Hub
            </span>
          </div>
          {/* Button arrow kanan */}
          <div className="flex-1 flex items-center justify-end gap-3 w-full lg:flex-1 lg:justify-end hidden lg:flex">
            {/* Arrow Left: putih, border, icon hitam */}
            <button
              className="w-12 h-12 rounded-full bg-[#f5f7fa] border border-gray-200 flex items-center justify-center shadow-none hover:bg-gray-100 transition-all"
              onClick={() => scrollContentHub("left")}
              aria-label="Scroll left"
              type="button"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="12" fill="#F5F7FA"/>
                <path d="M14.5 7L10 12L14.5 17" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {/* Arrow Right: hitam, border, icon putih */}
            <button
              className="w-12 h-12 rounded-full bg-[#36393B] border border-gray-200 flex items-center justify-center shadow-none hover:bg-gray-800 transition-all"
              onClick={() => scrollContentHub("right")}
              aria-label="Scroll right"
              type="button"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="12" fill="#36393B"/>
                <path d="M10 7L14.5 12L10 17" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
        <div className="overflow-x-auto pb-2 px-4 md:px-8 lg:px-8" ref={contentHubRef} style={{scrollBehavior:'smooth'}}>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500 text-lg" style={{fontFamily:'Sequel Sans Disp, Arial, sans-serif'}}>Loading articles...</div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-red-500 text-lg" style={{fontFamily:'Sequel Sans Disp, Arial, sans-serif'}}>{error}</div>
            </div>
          ) : articles.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500 text-lg" style={{fontFamily:'Sequel Sans Disp, Arial, sans-serif'}}>No articles found</div>
            </div>
          ) : (
            <div className="flex gap-4 md:gap-6 lg:gap-8">
              {articles.map((article, index) => {
                const colorVariants = [
                  { bg: '#bdb1a6', border: '#cfc5bb' },
                  { bg: '#d6cfc9', border: '#e2ddd7' },
                  { bg: '#eaeaea', border: '#e5e5e5' },
                  { bg: '#c9d6cf', border: '#d7e2dd' }
                ];
                const colors = colorVariants[index % colorVariants.length];
                
                return (
                  <div key={article.id} className="flex-shrink-0 w-[280px] md:w-[320px] lg:w-[350px] bg-[#f6f6f8] rounded-[28px] shadow-none p-0 flex flex-col items-stretch border border-[#eceaea]" style={{boxShadow:'0 2px 16px 0 rgba(0,0,0,0.06)'}}>
                    <div className="flex items-center justify-center pt-5">
                      <div className="relative rounded-[22px] w-full max-w-[250px] md:max-w-[280px] lg:max-w-[310px] h-[200px] flex items-center justify-center mx-auto" style={{backgroundColor: colors.bg, border: `10px solid ${colors.border}`}}>
                        {isValidImageUrl(article.imageUrl) ? (
                          <img 
                            src={article.imageUrl!} 
                            alt={article.title}
                            className="w-full h-full object-cover rounded-[14px]" 
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              // Show fallback
                              target.parentElement?.appendChild(
                                Object.assign(document.createElement('div'), {
                                  className: 'w-full h-full bg-gray-300 rounded-[14px] flex items-center justify-center absolute inset-0',
                                  innerHTML: '<span class="text-gray-500 text-sm">Image Error</span>'
                                })
                              );
                            }}
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-300 rounded-[14px] flex items-center justify-center">
                            <span className="text-gray-500 text-sm">No Image</span>
                          </div>
                        )}
                        <a 
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute top-3 right-3 bg-white rounded-[12px] p-2 flex items-center justify-center hover:bg-gray-50 transition-colors" 
                          style={{boxShadow:'0 2px 8px 0 rgba(0,0,0,0.08)', border: 'none', width: '36px', height: '36px', padding: 0}}
                        >
                          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="0" y="0" width="28" height="28" rx="8" fill="white"/>
                            <path d="M9 19L19 9M19 9H11M19 9V17" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </a>
                      </div>
                    </div>
                    <div className="flex flex-col flex-1 px-7 pt-4 pb-6 items-center text-center">
                      <div className="text-[#222] text-base mb-1 font-normal w-full" style={{fontFamily:'Sequel Sans Disp, Arial, sans-serif', textAlign:'center'}}>
                        {formatDate(article.publishedAt)}
                      </div>
                      <div className="text-2xl leading-tight mb-4 text-[#222] w-full" style={{fontFamily:'Sequel Sans Disp, Arial, sans-serif', textAlign:'center', fontWeight: 400}}>
                        {truncateText(article.title, 50)}
                      </div>
                      <div className="bg-white rounded-[18px] px-6 py-4 text-[#6d6d6d] text-base font-normal border border-[#eceaea] w-full" style={{fontFamily:'Sequel Sans Disp, Arial, sans-serif', textAlign:'center'}}>
                        {truncateText(article.description || article.content || 'No description available', 120)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContentHub;
