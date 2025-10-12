"use client";
import React, { useState, useRef, useEffect } from "react";
import { FaPaperPlane, FaEdit, FaTrash, FaHeart, FaReply } from "react-icons/fa";
import { Comment, useComments } from "@/hooks/useComments";
import { useCommentLikes } from "@/hooks/useCommentLikes";
import { useCommentReplies, CommentReply } from "@/hooks/useCommentReplies";
import { useAuth } from "@/hooks/useAuth";
import { getRelativeTime } from "@/lib/utils/date-formatter";
import { supabase } from "@/lib/supabase";

interface ArticleCommentsProps {
  articleId: string;
  showCommentInput: boolean;
  setShowCommentInput: (show: boolean) => void;
}

// Comment Reply Form Component
const CommentReplyForm: React.FC<{
  commentId: string;
  replyingTo: string | null;
  replyContent: string;
  setReplyContent: (content: string) => void;
  onCancel: () => void;
  onSubmit: (commentId: string, content: string) => void;
}> = ({ commentId, replyingTo, replyContent, setReplyContent, onCancel, onSubmit }) => {
  const { user } = useAuth();

  if (replyingTo !== commentId) return null;

  const handleSubmit = async () => {
    if (!replyContent.trim()) return;
    await onSubmit(commentId, replyContent);
  };

  return (
    <div className="mt-4 mb-4 p-4 bg-gray-50/80 rounded-xl border border-gray-200/50">
      <div className="flex items-start gap-3 mb-3">
        <div className="relative flex-shrink-0">
          <img
            src={
              user?.user_metadata?.picture ||
              user?.user_metadata?.avatar_url ||
              user?.user_metadata?.avatar ||
              user?.user_metadata?.image ||
              user?.user_metadata?.photo ||
              "https://ui-avatars.com/api/?name=" + encodeURIComponent(user?.user_metadata?.name || user?.user_metadata?.full_name || user?.email || 'User') + "&background=6366f1&color=fff&size=64"
            }
            alt="Your avatar"
            className="w-8 h-8 rounded-lg object-cover"
            onError={(e) => {
              // Jika avatar gagal load, coba fallback
              const fallbackUrl = "https://ui-avatars.com/api/?name=" + encodeURIComponent(user?.user_metadata?.name || user?.user_metadata?.full_name || user?.email || 'User') + "&background=6366f1&color=fff&size=64";
              if (e.currentTarget.src !== fallbackUrl) {
                e.currentTarget.src = fallbackUrl;
              } else {
                // Jika fallback juga gagal, hide dan show placeholder
                e.currentTarget.style.display = 'none';
                const placeholder = e.currentTarget.parentElement?.querySelector('.reply-avatar-placeholder') as HTMLElement;
                if (placeholder) placeholder.style.display = 'flex';
              }
            }}
          />
          {/* Placeholder dengan inisial sebagai backup terakhir */}
          <div className="reply-avatar-placeholder w-8 h-8 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 hidden items-center justify-center">
            <span className="text-gray-600 font-bold text-sm">
              {(user?.user_metadata?.name || user?.user_metadata?.full_name || user?.email || 'A')[0].toUpperCase()}
            </span>
          </div>
        </div>
        <div className="flex-1">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Tulis balasan Anda..."
            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none"
            rows={2}
            maxLength={300}
          />
        </div>
      </div>
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={onCancel}
          className="px-3 py-1.5 text-gray-600 text-sm hover:bg-gray-100 rounded-lg transition-colors"
        >
          Batal
        </button>
        <button
          onClick={handleSubmit}
          disabled={!replyContent.trim()}
          className="px-4 py-1.5 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Balas
        </button>
      </div>
    </div>
  );
};

// Comment Replies List Component
const CommentRepliesList: React.FC<{ commentId: string }> = ({ commentId }) => {
  const { replies, loading, error, addReply, deleteReply } = useCommentReplies(commentId);
  const { user } = useAuth();

  if (replies.length === 0) return null;

  return (
    <div className="mt-4 space-y-3">
      {replies.map((reply) => (
        <div key={reply.id} className="flex items-start gap-3 p-4 bg-gray-50/60 rounded-xl border-l-4 border-purple-300 shadow-sm hover:shadow-md transition-all duration-300 ml-4 sm:ml-6">
          <div className="relative flex-shrink-0">
            {reply.avatar_url ? (
              <img
                src={reply.avatar_url}
                alt="Reply avatar"
                className="w-8 h-8 rounded-lg object-cover"
                onError={(e) => {
                  // Jika avatar gagal load, tampilkan inisial
                  e.currentTarget.style.display = 'none';
                  const placeholder = e.currentTarget.parentElement?.querySelector('.avatar-placeholder') as HTMLElement;
                  if (placeholder) placeholder.style.display = 'flex';
                }}
              />
            ) : null}
            {/* Placeholder dengan inisial jika tidak ada avatar */}
            <div className={`avatar-placeholder w-8 h-8 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center ${reply.avatar_url ? 'hidden' : ''}`}>
              <span className="text-gray-600 font-bold text-sm">
                {(reply.username || 'A')[0].toUpperCase()}
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium text-gray-800 text-sm">{reply.username}</span>
              <span className="text-xs text-gray-500">{getRelativeTime(reply.created_at, 'id')}</span>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed break-words">{reply.content}</p>
          </div>
          {user && user.id === reply.user_id && (
            <button
              onClick={() => deleteReply(reply.id)}
              className="text-gray-400 hover:text-red-600 transition-colors p-1"
              title="Hapus balasan"
            >
              <FaTrash className="w-3 h-3" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

// Comment Item Component (untuk setiap komentar individual)
const CommentItem: React.FC<{
  comment: Comment;
  onReply: (commentId: string) => void;
  replyingTo: string | null;
  replyContent: string;
  setReplyContent: (content: string) => void;
  onCancelReply: () => void;
}> = ({ comment: c, onReply, replyingTo, replyContent, setReplyContent, onCancelReply }) => {
  const { user } = useAuth();
  const { addReply } = useCommentReplies(c.id);

  console.log('CommentItem: Rendering for comment:', c.id, c.content?.substring(0, 20));

  const handleSubmitReply = async () => {
    if (!replyContent.trim()) return;
    console.log('CommentItem: Submitting reply for comment:', c.id);
    await addReply(replyContent);
    setReplyContent("");
    onCancelReply();
  };

  return (
    <div className="group relative">
      {/* Comment bubble tail - hide on mobile untuk space */}
      <div className="hidden sm:block absolute -left-2 top-6 sm:top-8 w-4 h-4 bg-white/80 backdrop-blur-xl transform rotate-45 border-l border-b border-gray-100/50"></div>

      {/* Comment container with white background - includes avatar */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow duration-300">
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Avatar with online indicator */}
          <div className="relative flex-shrink-0">
            {c.avatar_url ? (
              <img
                src={c.avatar_url}
                alt="Avatar"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl shadow-lg ring-2 sm:ring-3 ring-white group-hover:ring-indigo-100 transition-all duration-300 object-cover"
                onError={(e) => {
                  // Jika avatar gagal load, tampilkan inisial
                  e.currentTarget.style.display = 'none';
                  const placeholder = e.currentTarget.parentElement?.querySelector('.avatar-placeholder') as HTMLElement;
                  if (placeholder) placeholder.style.display = 'flex';
                }}
              />
            ) : null}
            {/* Placeholder dengan inisial jika tidak ada avatar */}
            <div className={`avatar-placeholder w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl shadow-lg ring-2 sm:ring-3 ring-white bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center group-hover:ring-indigo-100 transition-all duration-300 ${c.avatar_url ? 'hidden' : ''}`}>
              <span className="text-gray-600 font-bold text-sm sm:text-base">
                {(c.username || 'A')[0].toUpperCase()}
              </span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-emerald-500 rounded-full border-2 border-white shadow-lg"></div>
          </div>

          <div className="flex-1 min-w-0">
            {/* User info with edit/delete buttons */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 flex-1">
                <h4 className="font-bold text-gray-800 text-base sm:text-lg group-hover:text-indigo-600 transition-colors duration-300 truncate">
                  {c.username || "Anonymous"}
                </h4>
                <span className="text-xs sm:text-sm text-gray-500 font-medium bg-gray-100 px-2 sm:px-3 py-1 rounded-full w-fit">
                  {getRelativeTime(c.created_at, 'id')}
                </span>
              </div>

              {/* Edit/Delete buttons (hanya untuk pemilik komentar) - moved to top */}
              {user && user.id === c.user_id && (
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out ml-2">
                  <button
                    onClick={() => {/* handle edit */}}
                    className="group/edit flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-lg sm:rounded-xl shadow-sm hover:shadow-md hover:bg-indigo-50/90 hover:border-indigo-300/70 transition-all duration-200 ease-out"
                    title="Edit komentar"
                  >
                    <FaEdit className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 group-hover/edit:text-indigo-700 transition-colors duration-200" />
                  </button>

                  <button
                    onClick={() => {/* handle delete */}}
                    className="group/delete flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-lg sm:rounded-xl shadow-sm hover:shadow-md hover:bg-rose-50/90 hover:border-rose-300/70 transition-all duration-200 ease-out"
                    title="Hapus komentar"
                  >
                    <FaTrash className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 group-hover/delete:text-rose-700 transition-colors duration-200" />
                  </button>
                </div>
              )}
            </div>

            {/* Comment content */}
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base mb-4 font-medium break-words">
              {c.content}
            </p>

            {/* Reply Form */}
            {replyingTo === c.id && (
              <div className="mt-4 mb-4 p-4 bg-gray-50/80 rounded-xl border border-gray-200/50">
                <div className="flex items-start gap-3 mb-3">
                  <div className="relative flex-shrink-0">
                    <img
                      src={
                        user?.user_metadata?.picture ||
                        user?.user_metadata?.avatar_url ||
                        user?.user_metadata?.avatar ||
                        user?.user_metadata?.image ||
                        user?.user_metadata?.photo ||
                        "https://ui-avatars.com/api/?name=" + encodeURIComponent(user?.user_metadata?.name || user?.user_metadata?.full_name || user?.email || 'User') + "&background=6366f1&color=fff&size=64"
                      }
                      alt="Your avatar"
                      className="w-8 h-8 rounded-lg object-cover"
                      onError={(e) => {
                        // Jika avatar gagal load, coba fallback
                        const fallbackUrl = "https://ui-avatars.com/api/?name=" + encodeURIComponent(user?.user_metadata?.name || user?.user_metadata?.full_name || user?.email || 'User') + "&background=6366f1&color=fff&size=64";
                        if (e.currentTarget.src !== fallbackUrl) {
                          e.currentTarget.src = fallbackUrl;
                        } else {
                          // Jika fallback juga gagal, hide dan show placeholder
                          e.currentTarget.style.display = 'none';
                          const placeholder = e.currentTarget.parentElement?.querySelector('.reply-avatar-placeholder') as HTMLElement;
                          if (placeholder) placeholder.style.display = 'flex';
                        }
                      }}
                    />
                    {/* Placeholder dengan inisial sebagai backup terakhir */}
                    <div className="reply-avatar-placeholder w-8 h-8 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 hidden items-center justify-center">
                      <span className="text-gray-600 font-bold text-sm">
                        {(user?.user_metadata?.name || user?.user_metadata?.full_name || user?.email || 'A')[0].toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder={`Balas komentar ${c.username}...`}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none"
                      rows={2}
                      maxLength={300}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={onCancelReply}
                    className="px-3 py-1.5 text-gray-600 text-sm hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSubmitReply}
                    disabled={!replyContent.trim()}
                    className="px-4 py-1.5 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Balas
                  </button>
                </div>
              </div>
            )}

            {/* Show Replies */}
            <CommentRepliesList commentId={c.id} />

            {/* Action buttons */}
            <div className="flex items-center">
              {/* Like and Reply buttons */}
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Like Button with Hook */}
                <CommentLikeButton commentId={c.id} />

                {/* Reply Button */}
                <button
                  onClick={() => onReply(c.id)}
                  className="flex items-center gap-1.5 sm:gap-2 text-gray-500 hover:text-purple-600 transition-colors duration-300 group/reply"
                >
                  <FaReply className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/reply:scale-110 transition-transform duration-300" />
                  <span className="text-xs sm:text-sm font-medium">Balas</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Comment Like Button Component
const CommentLikeButton: React.FC<{ commentId: string }> = ({ commentId }) => {
  const { likesCount, userLiked, loading, toggleLike } = useCommentLikes(commentId);
  const { user } = useAuth();

  const handleLike = async () => {
    if (!user) return; // Handle auth redirect if needed
    await toggleLike();
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`flex items-center gap-1.5 sm:gap-2 transition-colors duration-300 group/like ${
        userLiked
          ? 'text-red-600 hover:text-red-700'
          : 'text-gray-500 hover:text-red-600'
      }`}
    >
      <FaHeart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover/like:scale-110 transition-transform duration-300 ${
        userLiked ? 'fill-current' : ''
      }`} />
      <span className="text-xs sm:text-sm font-medium">
        {likesCount > 0 ? `${likesCount} Suka` : 'Suka'}
      </span>
    </button>
  );
};

const ArticleComments: React.FC<ArticleCommentsProps> = ({
  articleId,
  showCommentInput,
  setShowCommentInput
}) => {
  const [comment, setComment] = useState("");
  const [editingComment, setEditingComment] = useState<{id: string, content: string} | null>(null);
  const [editContent, setEditContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
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

  // Handle edit comment
  const handleEditComment = (commentId: string, currentContent: string) => {
    setEditingComment({ id: commentId, content: currentContent });
    setEditContent(currentContent);
  };

  // Handle reply
  const handleReply = (commentId: string) => {
    setReplyingTo(commentId);
    setReplyContent("");
  };

  // Handle submit edit
  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editContent.trim() || !editingComment) return;
    await editComment(editingComment.id, editContent);
    setEditingComment(null);
    setEditContent("");
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditContent("");
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
              <CommentItem
                key={c.id}
                comment={c}
                onReply={handleReply}
                replyingTo={replyingTo}
                replyContent={replyContent}
                setReplyContent={setReplyContent}
                onCancelReply={() => setReplyingTo(null)}
              />
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
                    {/* Try multiple avatar sources */}
                    <img
                      src={
                        user?.user_metadata?.picture ||
                        user?.user_metadata?.avatar_url ||
                        user?.user_metadata?.avatar ||
                        user?.user_metadata?.image ||
                        user?.user_metadata?.photo ||
                        "https://ui-avatars.com/api/?name=" + encodeURIComponent(user?.user_metadata?.name || user?.user_metadata?.full_name || user?.email || 'User') + "&background=6366f1&color=fff&size=128"
                      }
                      alt="User avatar"
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl shadow-lg ring-2 sm:ring-3 ring-white object-cover"
                      loading="lazy"
                      onError={(e) => {
                        console.log('Avatar load error, trying fallback');
                        // Jika avatar gagal load, coba avatar generator
                        const fallbackUrl = "https://ui-avatars.com/api/?name=" + encodeURIComponent(user?.user_metadata?.name || user?.user_metadata?.full_name || user?.email || 'User') + "&background=6366f1&color=fff&size=128";
                        if (e.currentTarget.src !== fallbackUrl) {
                          e.currentTarget.src = fallbackUrl;
                        } else {
                          // Jika fallback juga gagal, hide image dan show placeholder
                          e.currentTarget.style.display = 'none';
                          const placeholder = e.currentTarget.parentElement?.querySelector('.avatar-placeholder') as HTMLElement;
                          if (placeholder) placeholder.style.display = 'flex';
                        }
                      }}
                    />
                    {/* Placeholder dengan inisial sebagai backup terakhir */}
                    <div className="avatar-placeholder w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl shadow-lg ring-2 sm:ring-3 ring-white bg-gradient-to-br from-gray-200 to-gray-300 hidden items-center justify-center">
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

      {/* Edit Comment Modal */}
      {editingComment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="relative bg-white/95 backdrop-blur-2xl shadow-2xl border border-white/60 rounded-2xl sm:rounded-3xl p-4 sm:p-6 w-full max-w-2xl animate-slide-up-modal"
               style={{ 
                 boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(255, 255, 255, 0.2)' 
               }}>
            {/* Header bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-indigo-400 rounded-full"></div>
                <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
                <span className="text-gray-600 font-medium ml-4 text-base sm:text-lg">Edit Komentar</span>
              </div>
             
            </div>

            {/* Edit form */}
            <form onSubmit={handleSubmitEdit} className="space-y-6">
              {/* Comment input */}
              <div className="relative">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={4}
                  className="w-full bg-white/90 border-2 border-gray-200/60 rounded-xl px-6 py-4 text-gray-800 placeholder:text-gray-500 text-lg font-medium resize-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/50 transition-all duration-300 outline-none shadow-inner"
                  placeholder="Edit komentar Anda..."
                  maxLength={500}
                  autoFocus
                />
                {/* Character counter */}
                <div className="absolute bottom-3 right-3 text-xs text-gray-400 font-medium">
                  {editContent.length}/500
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-6 py-2.5 text-gray-600 font-semibold hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!editContent.trim() || editContent.trim() === editingComment.content}
                  className="px-8 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200/50 hover:shadow-xl hover:shadow-indigo-300/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2"
                >
                  <FaEdit className="w-4 h-4" />
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ArticleComments;