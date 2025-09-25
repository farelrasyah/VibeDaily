import React from "react";

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
  return (
    <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors" aria-label="Back to list">
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

const ArticleView: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-white to-[#e0e7ef]">
      {/* Main content area */}
      <main className="w-full min-h-screen flex flex-col items-stretch justify-start">
        {/* Hero Image - Full width, edge-to-edge, with overlay and floating back button */}
        <div className="relative w-full h-[38vw] min-h-[260px] max-h-[420px] overflow-hidden shadow-xl rounded-b-3xl">
          <img
            src="https://picsum.photos/1600/900?random=101"
            alt="Coral colored architectural structure"
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          {/* Floating back button, always top-left of hero image */}
          <div className="absolute top-7 left-7 z-30">
            <button className="group flex items-center text-slate-600 hover:text-slate-900 transition-all duration-300 hover:scale-105 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-slate-200/60" aria-label="Back to list">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-base font-semibold tracking-wide">Back</span>
            </button>
          </div>
        </div>

        {/* Header Section - Premium typography */}
        <header className="w-full px-4 sm:px-8 md:px-16 xl:px-32 -mt-16 z-10 relative">
          <div className="max-w-4xl mx-auto text-center bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl px-6 py-8 md:px-12 md:py-12 border border-slate-200/60">
            <h1
              className="serif-font font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-6 tracking-tight drop-shadow-xl mx-auto"
              style={{ fontFamily: `'Playfair Display', 'Merriweather', Georgia, serif` }}
            >
              The Cultural Significance of Greenhouses
            </h1>
            {/* Author info with elegant card */}
            <div className="flex items-center gap-4 mb-1 justify-center">
              <img
                src="https://picsum.photos/56/56?random=1"
                alt="Jean Doe"
                className="w-12 h-12 rounded-full ring-2 ring-white shadow-md"
                referrerPolicy="no-referrer"
              />
              <div className="text-left">
                <span className="text-slate-700 font-semibold text-base">Jean Doe</span>
                <div className="text-slate-500 text-sm">Architecture Writer</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Layout - Premium grid */}
        <section className="w-full px-4 sm:px-8 md:px-16 xl:px-32 mt-8 mb-12">
          <div className="max-w-6xl mx-auto grid grid-cols-1 xl:grid-cols-5 gap-8 xl:gap-12">
            {/* Main Content Column */}
            <div className="xl:col-span-3">
              <div className="max-w-none xl:max-w-2xl space-y-8 text-slate-800 leading-relaxed">
                <div className="text-base sm:text-lg lg:text-xl leading-relaxed text-slate-700 font-light">
                  <p className="mb-6">
                    The greenhouse is a commonplace architectural typology, a frequent fixture in a host of cities, built to
                    shield plants from the elements – from excess heat or cold or to prolong the growing season of crops.
                  </p>

                  <p className="mb-6">
                    Evidence of the presence of greenhouses in some form stretches as far back as the 1450s during the Korean
                    Joseon dynasty, but it is in the 1750s that the greenhouse was born as a specific architectural typology.
                  </p>

                  <p className="mb-6">
                    The greenhouse represents more than just a functional space for cultivation. It embodies the human desire
                    to control and manipulate nature, creating microclimates that defy seasonal constraints and geographical limitations.
                  </p>

                  <p className="mb-6">
                    In contemporary architecture, the greenhouse typology has evolved beyond its agricultural origins, finding
                    expression in residential designs, public spaces, and even commercial developments. These modern interpretations
                    often blend traditional glass structures with innovative materials and sustainable technologies.
                  </p>
                </div>

                {/* Quote section */}
                <div className="my-8">
                  <blockquote className="relative bg-gradient-to-br from-slate-100/90 to-white/90 rounded-xl p-6 border-l-4 border-slate-300 shadow">
                    <div className="text-xl lg:text-2xl font-light text-slate-800 italic leading-relaxed">
                      "Architecture is the learned game, correct and magnificent, of forms assembled in the light."
                    </div>
                    <cite className="block mt-3 text-slate-500 font-medium text-base">— Le Corbusier</cite>
                  </blockquote>
                </div>

                <div className="text-base sm:text-lg lg:text-xl leading-relaxed text-slate-700 font-light">
                  <p className="mb-6">
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
            <div className="xl:col-span-2 flex flex-col gap-6">
              {/* Wooden stairs image */}
              <div className="relative h-64 rounded-xl overflow-hidden shadow-lg group">
                <img
                  src="https://picsum.photos/500/600?random=102"
                  alt="Wooden stairs interior"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent"></div>
              </div>

              {/* White geometric structure */}
              <div className="relative h-64 rounded-xl overflow-hidden shadow-lg group">
                <img
                  src="https://picsum.photos/500/600?random=103"
                  alt="White geometric architectural structure"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent"></div>
                {/* Number overlay */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md rounded-full w-12 h-12 flex items-center justify-center shadow">
                  <span className="text-slate-700 font-bold text-lg">68</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Article Stats - Premium footer */}
        <footer className="pt-10 border-t border-slate-200/50 bg-white/90 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-4 sm:px-8 md:px-16 xl:px-32 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex flex-wrap items-center gap-6">
              <button className="group flex items-center text-slate-600 hover:text-slate-900 transition-all duration-300 hover:scale-105">
                <div className="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm border border-slate-200/50 group-hover:shadow-md transition-all duration-300 mr-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-label="Likes">
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-base font-semibold">2.1k Likes</span>
              </button>

              <button className="group flex items-center text-slate-600 hover:text-slate-900 transition-all duration-300 hover:scale-105">
                <div className="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm border border-slate-200/50 group-hover:shadow-md transition-all duration-300 mr-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-label="Comments"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <span className="text-base font-semibold">1.4k Comments</span>
              </button>

              <button className="group flex items-center text-slate-600 hover:text-slate-900 transition-all duration-300 hover:scale-105">
                <div className="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm border border-slate-200/50 group-hover:shadow-md transition-all duration-300 mr-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-label="Shares"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </div>
                <span className="text-base font-semibold">Share</span>
              </button>
            </div>

            <div className="flex items-center bg-white/90 backdrop-blur-md rounded-full px-5 py-2 shadow-sm border border-slate-200/50">
              <span className="text-slate-600 text-base mr-2">Published</span>
              <span className="font-semibold text-slate-900 text-base">2 days ago</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default ArticleView;
