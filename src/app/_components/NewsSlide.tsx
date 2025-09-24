'use client';

import React, { useRef, useState, useEffect } from 'react';

type NewsItem = {
  id: string;
  title: string;
  category: string;
  time: string;
  href: string;
  image: string;
  tags?: string[];
};

const newsItems: NewsItem[] = [
  {
    id: '1',
    title: 'Best apps logo ideas',
    category: 'Logo',
    time: 'a year ago',
    href: '#',
    image: '/file.svg',
    tags: ['Apps logo', 'Creative logo'],
  },
  {
    id: '2',
    title: 'How to make iphone app designs: a guide for beginners',
    category: 'iOS',
    time: 'a year ago',
    href: '#',
    image: '/globe.svg',
    tags: ['Iphone app designs', 'Ios app design'],
  },
  {
    id: '3',
    title: 'How to make an attractive social media app design',
    category: 'Mobile app',
    time: 'a year ago',
    href: '#',
    image: '/next.svg',
    tags: ['Social media app design', 'App design'],
  },
  {
    id: '4',
    title: 'The main stages of creating a fitness app ui',
    category: 'Mobile app',
    time: 'a year ago',
    href: '#',
    image: '/oval.gif',
    tags: ['Fitness app ui', 'Fitness website design'],
  },
  {
    id: '5',
    title: 'How to make a design that catches attention',
    category: 'Mobile app',
    time: 'a year ago',
    href: '#',
    image: '/window.svg',
    tags: ['Music app ui design'],
  },
  {
    id: '6',
    title: 'Audio Sphere',
    category: 'Mobile app',
    time: 'a year ago',
    href: '#',
    image: '/Oval.jpg',
    tags: ['Music app ui design'],
  },
];

const CARD_W = 280; // px, lebar kartu dikurangi

export default function NewsSlide() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);

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
    // Geser sebesar lebar viewport (bisa menampilkan lebih banyak card ke kanan)
    const viewport = window.innerWidth;
    el.scrollBy({ left: dir * viewport, behavior: 'smooth' });
  };

  return (
    <section className="w-screen max-w-none px-0 mt-12">
      {/* Header */}

  <header className="mb-6 flex items-center justify-between px-0">
        <div className="flex items-center relative">
          <div className="w-0.5 h-6 bg-violet-600 rounded-full z-10"></div>
          <div className="relative -ml-0.5">
            <span className="text-sm font-semibold text-slate-800 uppercase tracking-wide pl-1" style={{letterSpacing: '0.06em'}}>Breaking News</span>
            {/* Violet fade effect overlay starting from left */}
            <div className="absolute inset-0 left-0 bg-gradient-to-r from-violet-600/15 via-violet-500/8 via-violet-400/4 via-violet-300/2 via-violet-200/1 to-transparent pointer-events-none"></div>
          </div>
        </div>

        <a
          href="#"
          className="group inline-flex items-center gap-2 text-[15px] font-semibold text-slate-900"
        >
          <span>View more</span>
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            className="transition-transform group-hover:translate-x-0.5"
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

      {/* VIEWPORT (horizontal scroll + snap) */}
      <div className="relative pb-16">
        <div
          ref={trackRef}
          className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth px-0"
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
              style={{ width: CARD_W, margin: 0, padding: 0 }}
            >
              <a href={item.href} className="group block">
                <div
                  className="relative w-full overflow-hidden bg-white shadow-[0_8px_32px_rgba(15,23,42,.06)]"
                  style={{ borderRadius: 16, width: 250, height: 120 }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    width={250}
                    height={120}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    style={{ width: 250, height: 125 }}
                  />
                </div>
                <div className="mt-3 text-[13px] text-slate-500">
                  <span className="font-semibold text-[#3b82f6]">{item.category}</span>
                  <span className="mx-2">•</span>
                  <span>{item.time}</span>
                </div>
                <h3
                  className="news-item_title_ir_0Q"
                  style={{
                    fontSize: '18px',
                    fontFamily: 'Sequel Sans, sans-serif',
                    color: '#000',
                    marginTop: 16,
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
              </a>
            </article>
          ))}
        </div>
        {/* Tombol panah tengah-bawah */}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-3">
          <button
            onClick={() => scrollByCards(-1)}
            aria-label="Previous"
            className={`w-10 h-10 rounded-full transition-all flex items-center justify-center ${
              isAtStart
                ? 'bg-white/90 border border-slate-200 text-slate-700 shadow-[0_6px_12px_rgba(15,23,42,0.06)] hover:bg-white'
                : 'bg-slate-900 text-white shadow-[0_6px_12px_rgba(15,23,42,0.18)] hover:bg-slate-800'
            }`}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" className="mx-auto">
              <path d="M7.5 3.25L4.5 6L7.5 8.75" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={() => scrollByCards(1)}
            aria-label="Next"
            className="w-10 h-10 rounded-full bg-slate-900 text-white shadow-[0_6px_12px_rgba(15,23,42,0.18)] hover:bg-slate-800 transition-all flex items-center justify-center"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" className="mx-auto">
              <path d="M4.5 3.25L7.5 6L4.5 8.75" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
