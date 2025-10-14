'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useSavedArticles } from '@/hooks/useSavedArticles'
import { useSupabaseCheck } from '@/hooks/useSupabaseCheck'
import { getRelativeTime } from '@/lib/utils/date-formatter'

export const dynamic = 'force-dynamic'

export default function SavedArticlesPage() {
  const router = useRouter()
  const { isSupabaseAvailable, loading: supabaseLoading } = useSupabaseCheck()
  const { user, loading: authLoading } = useAuth()
  const { articles, loading, error, refetch } = useSavedArticles()

  // Redirect to home if not authenticated or Supabase not available
  useEffect(() => {
    if (!supabaseLoading && !isSupabaseAvailable) {
      router.push('/')
      return
    }
    
    if (!authLoading && !user && isSupabaseAvailable) {
      router.push('/')
    }
  }, [user, authLoading, router, isSupabaseAvailable, supabaseLoading])

  // Show loading while checking Supabase availability
  if (supabaseLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-slate-600">Loading...</span>
        </div>
      </div>
    )
  }

  // If Supabase is not available, redirect
  if (!isSupabaseAvailable) {
    return null
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-slate-600">Loading...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Elegant Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-12">
          <button
            className="group flex items-center text-slate-700 hover:text-slate-900 transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-lg px-5 py-2.5 rounded-full shadow-xl border border-slate-200/70"
            aria-label="Back to home"
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
            <span className="text-lg font-semibold tracking-wide">Back</span>
          </button>

          <div className="text-center flex-1 mx-8">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-900 via-violet-900 to-slate-900 bg-clip-text text-transparent mb-2">
              Saved Articles
            </h1>
            <p className="text-slate-600 text-lg font-medium">Your personal reading list, carefully preserved</p>
          </div>

          <div className="w-24"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-cyan-200 border-t-cyan-500 rounded-full animate-spin animation-delay-150"></div>
            </div>
            <span className="text-slate-600 mt-6 font-medium text-lg">Curating your saved articles...</span>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Oops! Something went wrong</h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">{error}</p>
            <button
              onClick={refetch}
              className="px-8 py-3 bg-gradient-to-r from-violet-600 to-pink-600 text-white rounded-2xl hover:from-violet-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-medium"
            >
              Try Again
            </button>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20">
            <div className="relative w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
              <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">?</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">No saved articles yet</h3>
            <p className="text-slate-600 mb-8 max-w-md mx-auto text-lg">Build your reading list by bookmarking articles that catch your interest!</p>
            <Link
              href="/"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 text-white rounded-2xl hover:from-blue-700 hover:via-cyan-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 font-semibold text-lg inline-block"
            >
              Discover Amazing Stories
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {articles.map((article, index) => (
              <article
                key={article.id}
                className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-200/50 hover:border-blue-200/50 hover:scale-[1.02] hover:-translate-y-2"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                {/* Article Image */}
                {article.imageUrl && (
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-blue-500 font-bold text-lg">☆</span>
                    </div>
                  </div>
                )}

                {/* Article Content */}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100">
                      {article.category || article.source?.name || 'News'}
                    </span>
                    <span className="text-xs text-slate-500 font-medium bg-slate-50 px-2 py-1 rounded-lg">
                      {getRelativeTime(article.publishedAt, 'id')}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors duration-300 leading-tight overflow-hidden" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical' as const,
                    lineHeight: '1.4'
                  }}>
                    <Link href={`/article/${article.id}`} className="hover:underline decoration-blue-300 decoration-2 underline-offset-2">
                      {article.title}
                    </Link>
                  </h3>

                  {article.description && (
                    <p className="text-slate-600 text-sm mb-5 overflow-hidden leading-relaxed" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical' as const,
                      lineHeight: '1.5'
                    }}>
                      {article.description}
                    </p>
                  )}

                  {!article.description && article.content && (
                    <p className="text-slate-600 text-sm mb-5 overflow-hidden leading-relaxed" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical' as const,
                      lineHeight: '1.5'
                    }}>
                      {article.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-md">
                        <span className="text-white font-bold text-sm">☆</span>
                      </div>
                      <span className="text-xs text-slate-600 font-medium">Saved</span>
                    </div>

                    <Link
                      href={`/article/${article.id}`}
                      className="group/btn flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-semibold transition-all duration-300 hover:scale-105"
                    >
                      <span>Read More</span>
                      <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animation-delay-150 {
          animation-delay: 150ms;
        }
      `}</style>
    </div>
  )
}