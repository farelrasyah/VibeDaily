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
    <div className="grid grid-cols-2 gap-3 lg:gap-4">
      {/* Top Left - Large coral/orange building */}
      <div className="col-span-2 aspect-[4/3] rounded-2xl overflow-hidden">
        <img
          src="https://dummyimage.com/600x450/ff6b47/ffffff?text=Coral+Architecture"
          alt="Coral colored architectural structure"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Bottom Left - Wooden stairs */}
      <div className="aspect-square rounded-2xl overflow-hidden">
        <img
          src="https://dummyimage.com/300x300/d4a574/ffffff?text=Wooden+Stairs"
          alt="Wooden stairs interior"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Bottom Right - White geometric structure with number */}
      <div className="aspect-square rounded-2xl overflow-hidden relative">
        <img
          src="https://dummyimage.com/300x300/f8fafc/94a3b8?text=White+Structure"
          alt="White geometric architectural structure"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 right-4 text-gray-600">
          <span className="text-2xl font-bold">68</span>
          <span className="text-sm">+</span>
        </div>
      </div>
    </div>
  );
};

const ArticleStats: React.FC = () => {
  return (
    <div className="mt-12 lg:mt-16 pt-6 border-t border-gray-200">
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" aria-label="Likes">
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
            <span>Likes</span>
          </div>

          <div className="flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-label="Comments"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>1.4k</span>
          </div>
        </div>

        <div className="flex items-center">
          <span>Replies</span>
          <span className="ml-4 font-medium text-gray-700">345</span>
        </div>
      </div>
    </div>
  );
};

const ArticleView: React.FC = () => {
  return (
    <div className="max-w-[768px] mx-auto bg-white min-h-screen lg:max-w-6xl lg:bg-gray-50 lg:py-8">
      <div className="lg:max-w-4xl lg:mx-auto lg:bg-white lg:rounded-2xl lg:shadow-sm lg:overflow-hidden">
        <div className="p-6 lg:p-8">
          <BackButton />

          <div className="mt-6 lg:mt-8 lg:grid lg:grid-cols-2 lg:gap-12">
            {/* Left Column - Text Content */}
            <div className="lg:pr-4">
              <h1 className="serif-font text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight mb-6 lg:mb-8">
                The Cultural Significance of Greenhouses
              </h1>

              <AuthorInfo />

              <div className="mt-8 lg:mt-10 space-y-6 text-gray-700 leading-relaxed">
                <p className="text-base lg:text-lg">
                  The greenhouse is a commonplace architectural typology, a frequent fixture in a host of cities, built to
                  shield plants from the elements – from excess heat or cold or to prolong the growing season of crops.
                </p>

                <p className="text-base lg:text-lg">
                  Evidence of the presence of greenhouses in some form stretches as far back as the 1450s during the Korean
                  Joseon dynasty, but it is in the 1750s that the greenhouse was born as a specific architectural typology.
                </p>
              </div>
            </div>

            {/* Right Column - Images */}
            <div className="mt-8 lg:mt-0">
              <ImageGrid />
            </div>
          </div>

          <ArticleStats />
        </div>
      </div>
    </div>
  );
};

export default ArticleView;
