"use client";
import React, { useState, useRef, useEffect } from "react";
import { FaPaperPlane, FaEdit, FaTrash, FaHeart, FaReply } from "react-icons/fa";
import { Comment, useComments } from "@/hooks/useComments";
import { useAuth } from "@/hooks/useAuth";
import { getRelativeTime } from "@/lib/utils/date-formatter";

interface ArticleCommentsProps {
  articleId: string;
  showCommentInput: boolean;
  setShowCommentInput: (show: boolean) => void;
}

const ArticleComments: React.FC<ArticleCommentsProps> = ({
  articleId,
  showCommentInput,
  setShowCommentInput
}) => {
  const [comment, setComment] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { user, loading: authLoading, signInWithGoogle } = useAuth();
  const { comments, loading, error, addComment, editComment, deleteComment } = useComments(articleId);

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
      <div className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30 rounded-3xl blur-3xl -z-10"></div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-10 md:py-12">
          {/* Header dengan animasi */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12 animate-fade-in-up">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent mb-2 sm:mb-3">
              Diskusi & Komentar
            </h3>
            <p className="text-gray-600 text-base sm:text-lg md:text-xl font-medium px-2">
              {comments.length === 0 ? 'Jadilah yang pertama berkomentar' : `${comments.length} orang telah bergabung dalam diskusi`}
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col sm:flex-row items-center justify-center py-12 sm:py-16 px-4">
              <div className="relative mb-4 sm:mb-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 border-indigo-100"></div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin absolute top-0 left-0"></div>
              </div>
              <span className="sm:ml-4 text-gray-600 font-medium text-sm sm:text-base text-center">Memuat komentar...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 animate-shake mx-2 sm:mx-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mb-3 sm:mb-0 sm:mr-4 shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <p className="text-red-700 font-medium text-sm sm:text-base">{error}</p>
              </div>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4 sm:space-y-6">
            {comments.map((c, index) => (
              <div 
                key={c.id} 
                className="group relative bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg shadow-gray-100/50 border border-gray-100/50 hover:shadow-xl hover:shadow-gray-200/30 transition-all duration-500 animate-slide-in-up mx-2 sm:mx-0"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Comment bubble tail - hide on mobile untuk space */}
                <div className="hidden sm:block absolute -left-2 top-6 sm:top-8 w-4 h-4 bg-white/80 backdrop-blur-xl transform rotate-45 border-l border-b border-gray-100/50"></div>
                
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Avatar with online indicator */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={
                        c.avatar_url || 
                        "https://via.placeholder.com/48x48/cccccc/666666?text=?"
                      }
                      alt="Avatar"
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl shadow-lg ring-2 sm:ring-3 ring-white group-hover:ring-indigo-100 transition-all duration-300 object-cover"
                      onError={(e) => {
                        // Jika avatar gagal load, tampilkan inisial
                        e.currentTarget.style.display = 'none';
                        const placeholder = e.currentTarget.parentElement?.querySelector('.avatar-placeholder') as HTMLElement;
                        if (placeholder) placeholder.style.display = 'flex';
                      }}
                    />
                    {/* Placeholder dengan inisial jika avatar gagal load */}
                    <div className="avatar-placeholder w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl shadow-lg ring-2 sm:ring-3 ring-white bg-gradient-to-br from-gray-200 to-gray-300 hidden items-center justify-center absolute top-0 left-0">
                      <span className="text-gray-600 font-bold text-sm sm:text-base">
                        {(c.username || 'A')[0].toUpperCase()}
                      </span>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-emerald-500 rounded-full border-2 border-white shadow-lg"></div>
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* User info */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-2">
                      <h4 className="font-bold text-gray-800 text-base sm:text-lg group-hover:text-indigo-600 transition-colors duration-300 truncate">
                        {c.username || "Anonymous"}
                      </h4>
                      <span className="text-xs sm:text-sm text-gray-500 font-medium bg-gray-100 px-2 sm:px-3 py-1 rounded-full w-fit">
                        {getRelativeTime(c.created_at, 'id')}
                      </span>
                    </div>

                    {/* Comment content */}
                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-3 sm:mb-4 font-medium break-words">
                      {c.content}
                    </p>

                    {/* Action buttons */}
                    <div className="flex items-center gap-3 sm:gap-4">
                      <button className="flex items-center gap-1.5 sm:gap-2 text-gray-500 hover:text-indigo-600 transition-colors duration-300 group/like">
                        <FaHeart className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/like:scale-110 transition-transform duration-300" />
                        <span className="text-xs sm:text-sm font-medium">Suka</span>
                      </button>
                      <button className="flex items-center gap-1.5 sm:gap-2 text-gray-500 hover:text-purple-600 transition-colors duration-300 group/reply">
                        <FaReply className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/reply:scale-110 transition-transform duration-300" />
                        <span className="text-xs sm:text-sm font-medium">Balas</span>
                      </button>
                    </div>
                  </div>

                  {/* Edit/Delete buttons for owner - Clean and elegant design */}
                  {user && user.id === c.user_id && (
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out">
                      <button
                        onClick={() => {
                          const newContent = prompt("Edit comment:", c.content);
                          if (newContent) editComment(c.id, newContent);
                        }}
                        className="group/edit flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-lg sm:rounded-xl shadow-sm hover:shadow-md hover:bg-indigo-50/90 hover:border-indigo-300/70 transition-all duration-200 ease-out"
                        title="Edit komentar"
                      >
                        <FaEdit className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 group-hover/edit:text-indigo-700 transition-colors duration-200" />
                      </button>

                      <button
                        onClick={() => deleteComment(c.id)}
                        className="group/delete flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-lg sm:rounded-xl shadow-sm hover:shadow-md hover:bg-rose-50/90 hover:border-rose-300/70 transition-all duration-200 ease-out"
                        title="Hapus komentar"
                      >
                        <FaTrash className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 group-hover/delete:text-rose-700 transition-colors duration-200" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {!loading && comments.length === 0 && (
            <div className="text-center py-12 sm:py-16 animate-fade-in px-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-gray-600 mb-2">Belum ada komentar</h4>
              <p className="text-gray-500 text-sm sm:text-base">Mulai diskusi dengan memberikan komentar pertama</p>
            </div>
          )}

          {/* Input komentar muncul jika tombol komen ditekan */}
          {showCommentInput && (
            <div className="mt-6 sm:mt-8 animate-slide-up-elegant px-2 sm:px-0">
              <form
                className="relative bg-white/95 backdrop-blur-2xl shadow-2xl border border-white/60 rounded-2xl sm:rounded-3xl p-4 sm:p-6"
                style={{ 
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(255, 255, 255, 0.2)' 
                }}
                onSubmit={handleSubmitComment}
              >
                {/* Header bar */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-400 rounded-full"></div>
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 rounded-full"></div>
                    <span className="text-gray-600 font-medium ml-2 sm:ml-4 text-sm sm:text-base">Tulis Komentar</span>
                  </div>
                 
                </div>

                {/* User profile section */}
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-indigo-50/80 to-purple-50/80 rounded-xl sm:rounded-2xl border border-indigo-100/50">
                  <div className="relative">
                    {user?.user_metadata?.picture || user?.user_metadata?.avatar_url || user?.user_metadata?.avatar ? (
                      <img
                        src={
                          user.user_metadata.picture || 
                          user.user_metadata.avatar_url || 
                          user.user_metadata.avatar
                        }
                        alt="User avatar"
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl shadow-lg ring-2 sm:ring-3 ring-white object-cover"
                        loading="lazy"
                        onError={(e) => {
                          // Jika avatar Google gagal load, tampilkan placeholder kosong
                          e.currentTarget.style.display = 'none';
                          const placeholder = e.currentTarget.parentElement?.querySelector('.avatar-placeholder') as HTMLElement;
                          if (placeholder) placeholder.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    {/* Placeholder dengan inisial jika tidak ada avatar Google */}
                    <div className={`avatar-placeholder w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl shadow-lg ring-2 sm:ring-3 ring-white bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center ${user?.user_metadata?.picture || user?.user_metadata?.avatar_url || user?.user_metadata?.avatar ? 'hidden' : ''}`}>
                      <span className="text-gray-600 font-bold text-sm sm:text-base">
                        {(user?.user_metadata?.name || user?.user_metadata?.full_name || user?.email || 'A')[0].toUpperCase()}
                      </span>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-800 text-base sm:text-lg">
                      {user?.user_metadata?.name || user?.user_metadata?.full_name || user?.email || 'Anonymous'}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">Berbagi pemikiran Anda...</p>
                  </div>
                </div>

                {/* Comment input with elegant design */}
                <div className="relative mb-4 sm:mb-6">
                  <div className="relative">
                    <textarea
                      ref={inputRef}
                      rows={3}
                      className="w-full bg-white/90 border-2 border-gray-200/60 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-gray-800 placeholder:text-gray-500 text-base sm:text-lg font-medium resize-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/50 transition-all duration-300 outline-none shadow-inner"
                      placeholder="Apa pendapat Anda tentang artikel ini? Bagikan pemikiran atau pengalaman terkait..."
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      maxLength={500}
                    />
                    {/* Character counter with smooth animation */}
         
                  </div>
                </div>

                {/* Action area with tips */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 order-2 sm:order-1">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="hidden sm:inline">Gunakan bahasa yang sopan dan konstruktif</span>
                    <span className="sm:hidden">Gunakan bahasa yang sopan</span>
                  </div>
                  
                  <div className="flex items-center gap-2 sm:gap-3 order-1 sm:order-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowCommentInput(false)}
                      className="px-4 sm:px-6 py-2 sm:py-2.5 text-gray-600 font-semibold hover:text-gray-800 hover:bg-gray-100 rounded-lg sm:rounded-xl transition-all duration-300 text-sm sm:text-base"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={!comment.trim()}
                      className="px-4 sm:px-8 py-2 sm:py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-lg sm:rounded-xl shadow-lg shadow-indigo-200/50 hover:shadow-xl hover:shadow-indigo-300/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base"
                    >
                      <FaPaperPlane className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Kirim Komentar</span>
                      <span className="sm:hidden">Kirim</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Custom styles */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up-modal {
          from {
            opacity: 0;
            transform: translateY(100px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes slide-up-elegant {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        .animate-slide-in-up {
          animation: slide-in-up 0.5s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-up-modal {
          animation: slide-up-modal 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-slide-up-elegant {
          animation: slide-up-elegant 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </>
  );
};

export default ArticleComments;