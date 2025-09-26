"use client";
// This file uses React hooks and must be a client component
import React from "react";
import { useRouter } from "next/navigation";

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

const AuthorInfo: React.FC = () => {
  return (
    <div className="flex items-center">
      <img
        src="https://dummyimage.com/40x40/e5e7eb/6b7280?text=JD"
        alt="Jean Doe"
        className="w-10 h-10 rounded-full mr-3"
        referrerPolicy="no-referrer"
      />
      <span className="text-gray-700 font-medium">Jean Doe</span>
    </div>
  );
};

const ImageGrid: React.FC = () => {
  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Hero Image - Full Width */}
      <div className="aspect-[16/9] lg:aspect-[21/9] rounded-2xl lg:rounded-3xl overflow-hidden">
        <img
          src="https://dummyimage.com/1200x675/ff6b47/ffffff?text=Coral+Architecture"
          alt="Coral colored architectural structure"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Grid of smaller images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
        {/* Left Image - Wooden stairs */}
        <div className="aspect-[4/5] rounded-2xl overflow-hidden">
          <img
            src="https://dummyimage.com/400x500/d4a574/ffffff?text=Wooden+Stairs"
            alt="Wooden stairs interior"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Right Image - White geometric structure with number */}
        <div className="aspect-[4/5] rounded-2xl overflow-hidden relative">
          <img
            src="https://dummyimage.com/400x500/f8fafc/94a3b8?text=White+Structure"
            alt="White geometric architectural structure"
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

const ArticleStats: React.FC = () => {
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
          <span className="ml-2 lg:ml-4 font-medium text-gray-900">2 days ago</span>
        </div>
      </div>
    </div>
  );
};


import { useRef } from "react";
import ContentHub from "./ContentHub";
import ArticleFooter from "./ArticleFooter";

const ArticleView: React.FC = () => {
  // Ref untuk container artikel Content Hub
  const contentHubRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] via-[#e9eff6] to-[#dbeafe]">
      <main className="w-full min-h-screen flex flex-col items-stretch justify-start">
        {/* Hero Section */}
        <section className="relative w-full h-[38vw] min-h-[320px] max-h-[520px] overflow-hidden shadow-2xl rounded-b-[2.5rem] flex items-end">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80"
            alt="Coral colored architectural structure"
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
        <header className="w-full px-6 sm:px-12 md:px-24 xl:px-48 -mt-20 z-10 relative">
          <div className="max-w-4xl mx-auto text-center bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl px-10 py-12 border border-slate-200/70">
            <h1
              className="serif-font font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-7 tracking-tight drop-shadow-xl mx-auto"
              style={{ fontFamily: `'Playfair Display', 'Merriweather', Georgia, serif` }}
            >
              The Cultural Significance of Greenhouses
            </h1>
            {/* Author info with elegant card */}
            <div className="flex items-center gap-5 mb-2 justify-center">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="Jean Doe"
                className="w-14 h-14 rounded-full ring-4 ring-white shadow-lg"
                referrerPolicy="no-referrer"
              />
              <div className="text-left">
                <span className="text-slate-800 font-semibold text-lg">Jean Doe</span>
                <div className="text-slate-500 text-base">Architecture Writer</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Layout */}
        <section className="w-full px-6 sm:px-12 md:px-24 xl:px-48 mt-14 mb-16">
          <div className="max-w-6xl mx-auto grid grid-cols-1 xl:grid-cols-5 gap-12 xl:gap-16">
            {/* Main Content Column */}
            <div className="xl:col-span-3">
              <div className="max-w-none xl:max-w-2xl space-y-10 text-slate-800 leading-relaxed">
                <div className="text-lg sm:text-xl lg:text-2xl leading-relaxed text-slate-700 font-light">
                  <p className="mb-7">
                    The greenhouse is a commonplace architectural typology, a frequent fixture in a host of cities, built to
                    shield plants from the elements – from excess heat or cold or to prolong the growing season of crops.
                  </p>

                  <p className="mb-7">
                    Evidence of the presence of greenhouses in some form stretches as far back as the 1450s during the Korean
                    Joseon dynasty, but it is in the 1750s that the greenhouse was born as a specific architectural typology.
                  </p>

                  <p className="mb-7">
                    The greenhouse represents more than just a functional space for cultivation. It embodies the human desire
                    to control and manipulate nature, creating microclimates that defy seasonal constraints and geographical limitations.
                  </p>

                  <p className="mb-7">
                    In contemporary architecture, the greenhouse typology has evolved beyond its agricultural origins, finding
                    expression in residential designs, public spaces, and even commercial developments. These modern interpretations
                    often blend traditional glass structures with innovative materials and sustainable technologies.
                  </p>
                </div>

                <div className="text-lg sm:text-xl lg:text-2xl leading-relaxed text-slate-700 font-light">
                  <p className="mb-7">
                    The greenhouse is a commonplace architectural typology, a frequent fixture in a host of cities, built to
                    shield plants from the elements – from excess heat or cold or to prolong the growing season of crops.
                  </p>

                  <p>
                    Evidence of the presence of greenhouses in some form stretches as far back as the 1450s during the Korean
                    Joseon dynasty, but it is in the 1750s that the greenhouse was born as a specific architectural typology.
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar Images */}
            <div className="xl:col-span-2 flex flex-col gap-8">
              {/* Wooden stairs image */}
              <div className="relative h-72 rounded-2xl overflow-hidden shadow-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80"
                  alt="Wooden stairs interior"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
              </div>

              {/* White geometric structure */}
              <div className="relative h-72 rounded-2xl overflow-hidden shadow-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=600&q=80"
                  alt="White geometric architectural structure"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                {/* Number overlay */}
                <div className="absolute top-5 right-5 bg-white/90 backdrop-blur-md rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
                  <span className="text-slate-700 font-bold text-xl">68</span>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Content Hub Section */}
        <ContentHub />

        {/* Article Footer Section */}
        <ArticleFooter />
      </main>
    </div>
  );
};

export default ArticleView;
