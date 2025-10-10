"use client";
import React, { useState, useRef, useEffect } from "react";
import { FaHeart, FaRegCommentDots, FaShareAlt, FaBookmark } from "react-icons/fa";
import { useAuth } from "@/hooks/useAuth";
import { useLikes } from "@/hooks/useLikes";
import { useBookmarks } from "@/hooks/useBookmarks";
import { supabase } from "@/lib/supabase";
import { getRelativeTime } from "@/lib/utils/date-formatter";
import ArticleComments from "./ArticleComments";

interface ArticleFooterProps {
  articleId: string;
  publishedAt?: string; // Opsional, jika ada
}

const ArticleFooter: React.FC<ArticleFooterProps> = ({ articleId, publishedAt }) => {
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const { user, loading: authLoading, signInWithGoogle, signOut } = useAuth();
  const { likeCount, userLiked, loading: likesLoading, toggleLike } = useLikes(articleId);
  const { isBookmarked, loading: bookmarksLoading, toggleBookmark } = useBookmarks(articleId);

  // Handle auth redirect dengan intent
  useEffect(() => {
    if (user) {
      // User baru login, cek apakah ada pending action
      const pendingAction = localStorage.getItem('pendingAction');
      if (pendingAction) {
        localStorage.removeItem('pendingAction');
        if (pendingAction === 'like') {
          toggleLike();
        } else if (pendingAction === 'bookmark') {
          toggleBookmark();
        }
      }
    }
  }, [user, toggleLike, toggleBookmark]);

  // Copy link to clipboard
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 1800);
    } catch {
      // fallback
      setShowToast(false);
      alert("Gagal menyalin link");
    }
  };

  // Handle like toggle
  const handleLike = async () => {
    if (authLoading) return;
    if (!user) {
      localStorage.setItem('pendingAction', 'like');
      signInWithGoogle();
      return;
    }
    await toggleLike();
  };

  // Handle bookmark toggle
  const handleBookmark = async () => {
    if (authLoading) return;
    if (!user) {
      localStorage.setItem('pendingAction', 'bookmark');
      signInWithGoogle();
      return;
    }
    await toggleBookmark();
  };

  return (
    <>
      {/* Comments Component */}
      <ArticleComments
        articleId={articleId}
        showCommentInput={showCommentInput}
        setShowCommentInput={setShowCommentInput}
      />

      <footer className="pt-14 border-t border-slate-200/60 bg-gradient-to-b from-white/90 via-[#f5f7fa]/90 to-[#e9eff6]/80 backdrop-blur-2xl relative overflow-hidden">
      {/* Divider visual */}
      <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-blue-200/40 via-pink-200/40 to-emerald-200/40 blur-sm opacity-80" />
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-16 xl:px-32 py-8 md:py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 lg:gap-8">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {/* Like */}
            <button
              className={`group flex items-center transition-all duration-300 hover:scale-105 focus:outline-none ${
                userLiked ? 'text-red-600' : 'text-slate-700 hover:text-red-600'
              }`}
              onClick={handleLike}
              disabled={authLoading || likesLoading}
              aria-pressed={userLiked}
            >
              <span className={`p-2 md:p-3 rounded-full bg-white/90 backdrop-blur-md shadow-md border border-slate-200/60 transition-all duration-300 mr-2 md:mr-3 flex items-center justify-center ${
                userLiked
                  ? 'group-hover:bg-red-50 group-hover:shadow-red-100'
                  : 'group-hover:bg-red-50 group-hover:shadow-red-100'
              }`}>
                {authLoading || likesLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                ) : (
                  <FaHeart className={`w-5 h-5 md:w-6 md:h-6 transition-colors duration-300 ${
                    userLiked ? 'fill-current' : ''
                  }`} />
                )}
              </span>
              <span className="text-sm sm:text-base md:text-lg font-semibold tracking-wide">
                <span className="hidden sm:inline">{likeCount} Likes</span>
                <span className="sm:hidden">{likeCount}</span>
              </span>
            </button>

            {/* Bookmark */}
            <button
              className={`group flex items-center transition-all duration-300 hover:scale-105 focus:outline-none ${
                isBookmarked ? 'text-yellow-600' : 'text-slate-700 hover:text-yellow-600'
              }`}
              onClick={handleBookmark}
              disabled={authLoading || bookmarksLoading}
              aria-pressed={isBookmarked}
            >
              <span className={`p-2 md:p-3 rounded-full bg-white/90 backdrop-blur-md shadow-md border border-slate-200/60 transition-all duration-300 mr-2 md:mr-3 flex items-center justify-center ${
                isBookmarked
                  ? 'group-hover:bg-yellow-50 group-hover:shadow-yellow-100'
                  : 'group-hover:bg-yellow-50 group-hover:shadow-yellow-100'
              }`}>
                {authLoading || bookmarksLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600"></div>
                ) : (
                  <FaBookmark className={`w-5 h-5 md:w-6 md:h-6 transition-colors duration-300 ${
                    isBookmarked ? 'fill-current' : ''
                  }`} />
                )}
              </span>
              <span className="text-sm sm:text-base md:text-lg font-semibold tracking-wide">
                <span className="hidden sm:inline">{isBookmarked ? 'Saved' : 'Save'}</span>
                <span className="sm:hidden">{isBookmarked ? 'Saved' : 'Save'}</span>
              </span>
            </button>

            {/* Comment */}
            <button
              className="group flex items-center text-slate-700 hover:text-sky-600 transition-all duration-300 hover:scale-105 focus:outline-none"
              onClick={() => {
                if (authLoading) return; // Tunggu auth load
                if (!user) signInWithGoogle();
                else setShowCommentInput((v) => !v);
              }}
              disabled={authLoading}
              aria-expanded={showCommentInput}
              aria-controls="comment-input-footer"
            >
              <span className="p-2 md:p-3 rounded-full bg-white/90 backdrop-blur-md shadow-md border border-slate-200/60 group-hover:bg-sky-50 group-hover:shadow-sky-100 transition-all duration-300 mr-2 md:mr-3 flex items-center justify-center">
                {authLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-sky-600"></div>
                ) : (
                  <FaRegCommentDots className="w-5 h-5 md:w-6 md:h-6 transition-colors duration-300" />
                )}
              </span>
              <span className="text-sm sm:text-base md:text-lg font-semibold tracking-wide">
                <span className="hidden sm:inline">Comments</span>
                <span className="sm:hidden">Comments</span>
              </span>
            </button>

            {/* Share */}
            <button
              className="group flex items-center text-slate-700 hover:text-emerald-600 transition-all duration-300 hover:scale-105 focus:outline-none"
              onClick={handleShare}
            >
              <span className="p-2 md:p-3 rounded-full bg-white/90 backdrop-blur-md shadow-md border border-slate-200/60 group-hover:bg-emerald-50 group-hover:shadow-emerald-100 transition-all duration-300 mr-2 md:mr-3 flex items-center justify-center">
                <FaShareAlt className="w-5 h-5 md:w-6 md:h-6 transition-colors duration-300" />
              </span>
              <span className="text-sm sm:text-base md:text-lg font-semibold tracking-wide">
                <span className="hidden sm:inline">Share</span>
                <span className="sm:hidden">Share</span>
              </span>
            </button>
          </div>

          <div className="flex justify-center sm:justify-end">
            <div className="flex items-center bg-white/95 backdrop-blur-lg rounded-full px-3 sm:px-4 md:px-7 py-2 md:py-3 shadow-md border border-slate-200/60 animate-fade-in">
              <span className="text-slate-600 text-sm sm:text-base md:text-lg mr-1.5 sm:mr-2 md:mr-3 font-medium">
                <span className="hidden sm:inline">Published</span>
                <span className="sm:hidden">Published</span>
              </span>
              <span className="font-semibold text-slate-900 text-sm sm:text-base md:text-lg tracking-wide">
                {publishedAt ? getRelativeTime(publishedAt, 'id') : 'Unknown'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Toast notifikasi link tersalin */}
      {showToast && (
        <div className="fixed left-1/2 bottom-8 -translate-x-1/2 z-50 bg-emerald-500 text-white px-5 py-2 rounded-full shadow-lg animate-fade-in text-base font-medium">
          Link artikel berhasil disalin!
        </div>
      )}
      </footer>
    </>
  );
};

export default ArticleFooter;

