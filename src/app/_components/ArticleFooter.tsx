"use client";
import React, { useState, useRef } from "react";
import { FaHeart, FaRegCommentDots, FaShareAlt, FaPaperPlane } from "react-icons/fa";


const ArticleFooter: React.FC = () => {
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [comment, setComment] = useState("");
  const [showToast, setShowToast] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Copy link to clipboard
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 1800);
    } catch (err) {
      // fallback
      setShowToast(false);
      alert("Gagal menyalin link");
    }
  };

  // Focus input saat muncul
  React.useEffect(() => {
    if (showCommentInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showCommentInput]);

  return (
    <footer className="pt-14 border-t border-slate-200/60 bg-gradient-to-b from-white/90 via-[#f5f7fa]/90 to-[#e9eff6]/80 backdrop-blur-2xl relative overflow-hidden">
      {/* Divider visual */}
      <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-blue-200/40 via-pink-200/40 to-emerald-200/40 blur-sm opacity-80" />
      <div className="max-w-6xl mx-auto px-4 sm:px-8 md:px-16 xl:px-32 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <div className="flex flex-wrap items-center gap-6 md:gap-10">
          {/* Like */}
          <button className="group flex items-center text-slate-700 hover:text-pink-500 transition-all duration-300 hover:scale-105 focus:outline-none">
            <span className="p-3 rounded-full bg-white/90 backdrop-blur-md shadow-md border border-slate-200/60 group-hover:bg-pink-50 group-hover:shadow-pink-100 transition-all duration-300 mr-3 flex items-center justify-center">
              <FaHeart className="w-6 h-6 transition-colors duration-300" />
            </span>
            <span className="text-lg font-semibold tracking-wide">2.1k Likes</span>
          </button>

          {/* Comment */}
          <button
            className="group flex items-center text-slate-700 hover:text-sky-600 transition-all duration-300 hover:scale-105 focus:outline-none"
            onClick={() => setShowCommentInput((v) => !v)}
            aria-expanded={showCommentInput}
            aria-controls="comment-input-footer"
          >
            <span className="p-3 rounded-full bg-white/90 backdrop-blur-md shadow-md border border-slate-200/60 group-hover:bg-sky-50 group-hover:shadow-sky-100 transition-all duration-300 mr-3 flex items-center justify-center">
              <FaRegCommentDots className="w-6 h-6 transition-colors duration-300" />
            </span>
            <span className="text-lg font-semibold tracking-wide">1.4k Comments</span>
          </button>

          {/* Share */}
          <button
            className="group flex items-center text-slate-700 hover:text-emerald-600 transition-all duration-300 hover:scale-105 focus:outline-none"
            onClick={handleShare}
          >
            <span className="p-3 rounded-full bg-white/90 backdrop-blur-md shadow-md border border-slate-200/60 group-hover:bg-emerald-50 group-hover:shadow-emerald-100 transition-all duration-300 mr-3 flex items-center justify-center">
              <FaShareAlt className="w-6 h-6 transition-colors duration-300" />
            </span>
            <span className="text-lg font-semibold tracking-wide">Share</span>
          </button>
        </div>

        <div className="flex items-center bg-white/95 backdrop-blur-lg rounded-full px-7 py-3 shadow-md border border-slate-200/60 animate-fade-in">
          <span className="text-slate-600 text-lg mr-3 font-medium">Published</span>
          <span className="font-semibold text-slate-900 text-lg tracking-wide">2 days ago</span>
        </div>
      </div>

      {/* Input komentar muncul jika tombol komen ditekan */}
      {showCommentInput && (
        <div
          className="fixed left-0 right-0 bottom-0 z-50 w-full flex justify-center items-end pointer-events-none"
          id="comment-input-footer"
        >
          <form
            className="flex items-center gap-3 bg-white/60 backdrop-blur-2xl shadow-2xl border border-white/40 rounded-full px-4 sm:px-8 py-2.5 sm:py-3 max-w-2xl w-[98vw] sm:w-full mx-2 animate-slide-up pointer-events-auto transition-all duration-500"
            style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.12)' }}
            onSubmit={e => { e.preventDefault(); setComment(""); }}
          >
            {/* Avatar user dummy */}
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="User avatar"
              className="w-10 h-10 rounded-full shadow border-2 border-white/80 object-cover transition-all duration-300"
              loading="lazy"
            />
            <input
              ref={inputRef}
              type="text"
              className="flex-1 bg-transparent outline-none text-slate-800 placeholder:text-slate-400 text-base sm:text-lg px-2 py-2 font-medium rounded-full transition-all duration-300 focus:bg-white/80 focus:shadow-lg focus:ring-2 focus:ring-sky-200"
              placeholder="Tulis komentar menarik..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              aria-label="Tulis komentar"
              maxLength={250}
            />
            <button
              type="submit"
              className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-400 hover:from-sky-500 hover:to-indigo-500 text-white shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sky-300 text-xl scale-100 hover:scale-110 active:scale-95"
              title="Kirim"
            >
              <FaPaperPlane className="w-5 h-5 sm:w-6 sm:h-6" />
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
  );
};

export default ArticleFooter;
