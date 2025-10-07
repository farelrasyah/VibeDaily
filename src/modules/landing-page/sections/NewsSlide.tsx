'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type NewsItem = {
  id: string;
  title: string;
  category: string;
  time: string;
  articleId: string;
  image: string;
  tags?: string[];
};

interface NewsSlideProps {
  items?: NewsItem[];
}

export default function NewsSlide({ items }: NewsSlideProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const router = useRouter();

  // Use provided items or fallback to empty array
  const newsItems = items || [];

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const handleScroll = () => setIsAtStart(el.scrollLeft === 0);
    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollByCards = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    // Responsive scroll distance
    const isMobile = window.innerWidth < 640;
    const scrollDistance = isMobile ? window.innerWidth * 0.8 : window.innerWidth * 0.6;
    el.scrollBy({ left: dir * scrollDistance, behavior: 'smooth' });
  };

  return (
    <section className="w-screen max-w-none px-0 mt-8 sm:mt-10 md:mt-12">
      {/* Header - responsive */}
  <header className="mb-4 sm:mb-5 md:mb-6 flex items-center justify-between px-4 sm:px-6 lg:px-0">
        <div className="flex items-center relative">
          <div className="w-0.5 h-5 sm:h-6 bg-violet-600 rounded-full z-10"></div>
          <div className="relative ">
            <span className="text-xs sm:text-sm font-semibold text-slate-800 uppercase tracking-wide pl-1" style={{letterSpacing: '0.06em'}}>Breaking News</span>
            {/* Violet fade effect overlay starting from left */}
            <div className="absolute inset-0 left-0 bg-gradient-to-r from-violet-600/15 via-violet-500/8 via-violet-400/4 via-violet-300/2 via-violet-200/1 to-transparent pointer-events-none"></div>
          </div>
        </div>

        <a
          href="#"
          className="group inline-flex items-center gap-1.5 sm:gap-2 text-sm sm:text-[15px] font-semibold text-slate-900 mr-18"
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
      </header>

      {/* VIEWPORT (horizontal scroll + snap) - responsive */}
      <div className="relative pb-12 sm:pb-14 md:pb-16">
        <div
          ref={trackRef}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth px-4 sm:px-6 lg:px-0"
          style={{
            columnGap: 0,
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
          onWheelCapture={(e: React.WheelEvent<HTMLDivElement>) => {
            if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
              (e.currentTarget as HTMLDivElement).scrollLeft += e.deltaY;
              e.preventDefault();
            }
          }}
        >
          {newsItems.map((item) => (
            <article
              key={item.id}
              className="shrink-0 snap-start"
              style={{ width: 'min(280px, 85vw)', margin: 0, padding: 0 }}
            >
              <div 
                onClick={() => router.push(`/article/${item.articleId}`)}
                className="group block cursor-pointer"
              >
                <div
                  className="relative w-full overflow-hidden bg-white shadow-[0_8px_32px_rgba(15,23,42,.06)]"
                  style={{ borderRadius: 16, width: 'min(250px, 80vw)', height: 'min(120px, 30vw)' }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="mt-2.5 sm:mt-3 text-[11px] sm:text-[13px] text-slate-500">
                  <span className="font-semibold text-[#3b82f6]">{item.category}</span>
                  <span className="mx-1.5 sm:mx-2">•</span>
                  <span>{item.time}</span>
                </div>
                <h3
                  className="news-item_title_ir_0Q"
                  style={{
                    fontSize: 'clamp(16px, 4vw, 18px)',
                    fontFamily: 'Sequel Sans, sans-serif',
                    color: '#000',
                    marginTop: 'clamp(12px, 3vw, 16px)',
                    marginBottom: 0,
                    marginLeft: 0,
                    marginRight: 0,
                    fontWeight: 600,
                    lineHeight: '1.2',
                    width: 250
                  }}
                >
                  {item.title}
                </h3>
                {item.tags && (
                  <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1">
                    {item.tags.map((t, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '12px',
                          fontFamily: 'Sequel Sans, sans-serif',
                          color: '#00000066',
                        }}
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
        {/* Tombol panah tengah-bawah - responsive */}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 sm:gap-3">
          <button
            onClick={() => scrollByCards(-1)}
            aria-label="Previous"
            className={`w-8 sm:w-10 h-8 sm:h-10 rounded-full transition-all flex items-center justify-center ${
              isAtStart
                ? 'bg-white/90 border border-slate-200 text-slate-700 shadow-[0_6px_12px_rgba(15,23,42,0.06)] hover:bg-white'
                : 'bg-slate-900 text-white shadow-[0_6px_12px_rgba(15,23,42,0.18)] hover:bg-slate-800'
            }`}
          >
            <svg width="10" height="10" viewBox="0 0 12 12" className="sm:w-3 sm:h-3 mx-auto">
              <path d="M7.5 3.25L4.5 6L7.5 8.75" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={() => scrollByCards(1)}
            aria-label="Next"
            className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-slate-900 text-white shadow-[0_6px_12px_rgba(15,23,42,0.18)] hover:bg-slate-800 transition-all flex items-center justify-center"
          >
            <svg width="10" height="10" viewBox="0 0 12 12" className="sm:w-3 sm:h-3 mx-auto">
              <path d="M4.5 3.25L7.5 6L4.5 8.75" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
