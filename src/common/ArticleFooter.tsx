"use client";
import React, { useState, useRef, useEffect } from "react";
import { FaHeart, FaRegCommentDots, FaShareAlt, FaPaperPlane, FaEdit, FaTrash, FaBookmark } from "react-icons/fa";
import { useComments } from "@/hooks/useComments";
import { useAuth } from "@/hooks/useAuth";
import { useLikes } from "@/hooks/useLikes";
import { useBookmarks } from "@/hooks/useBookmarks";
import { supabase } from "@/lib/supabase";
import { getRelativeTime } from "@/lib/utils/date-formatter";

interface ArticleFooterProps {
  articleId: string;
  publishedAt?: string; // Opsional, jika ada
}

const ArticleFooter: React.FC<ArticleFooterProps> = ({ articleId, publishedAt }) => {
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [comment, setComment] = useState("");
  const [showToast, setShowToast] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { user, loading: authLoading, signInWithGoogle, signOut } = useAuth();
  const { comments, loading, error, addComment, editComment, deleteComment } = useComments(articleId);
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

  // Handle submit comment
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    await addComment(comment);
    setComment("");
    setShowCommentInput(false);
  };

  // Focus input saat muncul
  React.useEffect(() => {
    if (showCommentInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showCommentInput]);

  return (
    <>
      {/* Comments Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 md:px-16 xl:px-32 py-8">
        <h3 className="text-xl font-semibold mb-4">Komentar ({comments.length})</h3>
        {loading && <p>Loading comments...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="space-y-4">
          {comments.map((c) => (
            <div key={c.id} className="bg-white/80 backdrop-blur-md rounded-lg p-4 shadow-md border">
              <div className="flex items-start gap-3">
                <img
                  src={c.avatar_url || "https://randomuser.me/api/portraits/men/32.jpg"}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1">
                  <p className="font-medium">{c.username || "Anonymous"}</p>
                  <p className="text-sm text-gray-600">{new Date(c.created_at).toLocaleString()}</p>
                  <p className="mt-2">{c.content}</p>
                </div>
                {user && user.id === c.user_id && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const newContent = prompt("Edit comment:", c.content);
                        if (newContent) editComment(c.id, newContent);
                      }}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => deleteComment(c.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="pt-14 border-t border-slate-200/60 bg-gradient-to-b from-white/90 via-[#f5f7fa]/90 to-[#e9eff6]/80 backdrop-blur-2xl relative overflow-hidden">
      {/* Divider visual */}
      <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-blue-200/40 via-pink-200/40 to-emerald-200/40 blur-sm opacity-80" />
      <div className="max-w-6xl mx-auto px-4 sm:px-8 md:px-16 xl:px-32 py-8 md:py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-8 lg:gap-10">
        <div className="flex flex-wrap items-center gap-4 md:gap-6 lg:gap-10">
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
            <span className="text-base md:text-lg font-semibold tracking-wide">{likeCount} Likes</span>
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
            <span className="text-base md:text-lg font-semibold tracking-wide">
              {isBookmarked ? 'Saved' : 'Save'}
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
            <span className="text-base md:text-lg font-semibold tracking-wide">{comments.length} Comments</span>
          </button>

          {/* Share */}
          <button
            className="group flex items-center text-slate-700 hover:text-emerald-600 transition-all duration-300 hover:scale-105 focus:outline-none"
            onClick={handleShare}
          >
            <span className="p-2 md:p-3 rounded-full bg-white/90 backdrop-blur-md shadow-md border border-slate-200/60 group-hover:bg-emerald-50 group-hover:shadow-emerald-100 transition-all duration-300 mr-2 md:mr-3 flex items-center justify-center">
              <FaShareAlt className="w-5 h-5 md:w-6 md:h-6 transition-colors duration-300" />
            </span>
            <span className="text-base md:text-lg font-semibold tracking-wide">Share</span>
          </button>
        </div>

        <div className="flex items-center bg-white/95 backdrop-blur-lg rounded-full px-4 md:px-7 py-2 md:py-3 shadow-md border border-slate-200/60 animate-fade-in">
          <span className="text-slate-600 text-base md:text-lg mr-2 md:mr-3 font-medium">Published</span>
          <span className="font-semibold text-slate-900 text-base md:text-lg tracking-wide">
            {publishedAt ? getRelativeTime(publishedAt, 'id') : 'Unknown'}
          </span>
        </div>
      </div>

      {/* Input komentar muncul jika tombol komen ditekan */}
      {showCommentInput && (
        <div
          className="fixed left-0 right-0 bottom-0 z-50 w-full flex justify-center items-end pointer-events-none"
          id="comment-input-footer"
        >
          <form
            className="flex items-center gap-2 md:gap-3 bg-white/60 backdrop-blur-2xl shadow-2xl border border-white/40 rounded-full px-3 md:px-4 lg:px-8 py-2 md:py-2.5 lg:py-3 max-w-2xl w-[98vw] sm:w-full mx-2 animate-slide-up pointer-events-auto transition-all duration-500"
            style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.12)' }}
            onSubmit={handleSubmitComment}
          >
            {/* Avatar user */}
            <img
              src={user?.user_metadata?.avatar_url || user?.user_metadata?.picture || "https://randomuser.me/api/portraits/men/32.jpg"}
              alt="User avatar"
              className="w-8 h-8 md:w-10 md:h-10 rounded-full shadow border-2 border-white/80 object-cover transition-all duration-300"
              loading="lazy"
            />
            <input
              ref={inputRef}
              type="text"
              className="flex-1 bg-transparent outline-none text-slate-800 placeholder:text-slate-400 text-sm md:text-base lg:text-lg px-2 py-2 font-medium rounded-full transition-all duration-300 focus:bg-white/80 focus:shadow-lg focus:ring-2 focus:ring-sky-200"
              placeholder="Tulis komentar menarik..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              aria-label="Tulis komentar"
              maxLength={250}
            />
            <button
              type="submit"
              className="flex items-center justify-center w-9 h-9 md:w-11 md:h-11 lg:w-12 lg:h-12 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-400 hover:from-sky-500 hover:to-indigo-500 text-white shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sky-300 text-lg md:text-xl scale-100 hover:scale-110 active:scale-95"
              title="Kirim"
            >
              <FaPaperPlane className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
            </button>
          </form>
          <style>{`
            @keyframes slide-up {
              from { transform: translateY(100%); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
            .animate-slide-up {
              animation: slide-up 0.5s cubic-bezier(.4,1.4,.6,1) both;
            }
          `}</style>
        </div>
      )}

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

