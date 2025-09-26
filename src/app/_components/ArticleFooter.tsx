"use client";
import React from "react";

const ArticleFooter: React.FC = () => {
  return (
    <footer className="pt-12 border-t border-slate-200/60 bg-white/80 backdrop-blur-2xl">
      <div className="max-w-6xl mx-auto px-6 sm:px-12 md:px-24 xl:px-48 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <div className="flex flex-wrap items-center gap-8">
          <button className="group flex items-center text-slate-700 hover:text-slate-900 transition-all duration-300 hover:scale-105">
            <div className="p-3 rounded-full bg-white/90 backdrop-blur-md shadow-md border border-slate-200/60 group-hover:shadow-lg transition-all duration-300 mr-3">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" aria-label="Likes">
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="text-lg font-semibold">2.1k Likes</span>
          </button>

          <button className="group flex items-center text-slate-700 hover:text-slate-900 transition-all duration-300 hover:scale-105">
            <div className="p-3 rounded-full bg-white/90 backdrop-blur-md shadow-md border border-slate-200/60 group-hover:shadow-lg transition-all duration-300 mr-3">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-label="Comments"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <span className="text-lg font-semibold">1.4k Comments</span>
          </button>

          <button className="group flex items-center text-slate-700 hover:text-slate-900 transition-all duration-300 hover:scale-105">
            <div className="p-3 rounded-full bg-white/90 backdrop-blur-md shadow-md border border-slate-200/60 group-hover:shadow-lg transition-all duration-300 mr-3">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-label="Shares"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </div>
            <span className="text-lg font-semibold">Share</span>
          </button>
        </div>

        <div className="flex items-center bg-white/95 backdrop-blur-lg rounded-full px-7 py-3 shadow-md border border-slate-200/60">
          <span className="text-slate-600 text-lg mr-3">Published</span>
          <span className="font-semibold text-slate-900 text-lg">2 days ago</span>
        </div>
      </div>
    </footer>
  );
};

export default ArticleFooter;
