'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { guidesService, GuideArticle } from '@/lib/api/guides'

export default function BestPractices() {
  const router = useRouter()
  const [articles, setArticles] = useState<GuideArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  useEffect(() => {
    const fetchBestPractices = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await guidesService.getBestPractices()
        setArticles(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load best practices')
      } finally {
        setLoading(false)
      }
    }

    fetchBestPractices()
  }, [])

  const filteredArticles = articles.filter(article => {
    const matchesCategory = !selectedCategory || article.category === selectedCategory
    const matchesTag = !selectedTag || article.tags.includes(selectedTag)
    return matchesCategory && matchesTag
  })

  const allCategories = Array.from(new Set(articles.map(article => article.category)))
  const allTags = Array.from(new Set(articles.flatMap(article => article.tags)))

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Architecture': 'bg-blue-50 text-blue-700 border-blue-200',
      'Reliability': 'bg-green-50 text-green-700 border-green-200',
      'Quality': 'bg-purple-50 text-purple-700 border-purple-200',
      'Security': 'bg-red-50 text-red-700 border-red-200',
      'Performance': 'bg-orange-50 text-orange-700 border-orange-200',
      'Accessibility': 'bg-indigo-50 text-indigo-700 border-indigo-200'
    }
    return colors[category] || 'bg-gray-50 text-gray-700 border-gray-200'
  }

  const handleArticleClick = (articleId: string) => {
    router.push(`/guide/${articleId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading best practices...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load best practices</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-[1440px] mx-auto">
          {/* Header Section */}
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-0.5 h-6 bg-violet-600 rounded-full"></div>
              <h1 className="text-3xl font-bold text-slate-900">Best Practices</h1>
            </div>
            <p className="text-lg text-slate-600 max-w-3xl">
              Industry-standard practices and proven methodologies to build robust, scalable,
              and maintainable applications. Learn from real-world experience and expert recommendations
              to elevate your development skills.
            </p>
          </header>

          {/* Filter Section */}
          <div className="mb-8 space-y-4">
            {/* Category Filter */}
            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-2">Categories</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === null
                      ? 'bg-violet-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Categories
                </button>
                {allCategories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-violet-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Tag Filter */}
            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-2">Topics</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedTag(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedTag === null
                      ? 'bg-violet-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Topics
                </button>
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedTag === tag
                        ? 'bg-violet-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map(article => (
              <article
                key={article.id}
                onClick={() => handleArticleClick(article.id)}
                className="group cursor-pointer bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-violet-200 transition-all duration-300"
              >
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getCategoryColor(article.category)}`}>
                      {article.category}
                    </span>
                    <span className="text-sm text-slate-500">{article.readTime}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {article.tags.slice(0, 2).map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-violet-50 text-violet-700 text-xs font-medium rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-xl font-semibold text-slate-900 group-hover:text-violet-600 transition-colors mb-2">
                    {article.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    {article.description}
                  </p>

                  {/* Key Points */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-slate-700 mb-2">Key Points:</h4>
                    <ul className="space-y-1">
                      {(article.keyPoints ?? []).slice(0, 3).map((point, index) => (
                        <li key={index} className="flex items-center text-xs text-slate-600">
                          <div className="w-1 h-1 bg-violet-400 rounded-full mr-2 flex-shrink-0"></div>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full bg-violet-500`}></div>
                    <span className="text-xs text-slate-500">{article.category}</span>
                  </div>
                  <div className="flex items-center text-violet-600 group-hover:translate-x-1 transition-transform">
                    <span className="text-sm font-medium mr-1">Read Practice</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Empty State */}
          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No best practices found</h3>
                <p className="text-gray-500">Try adjusting your filters to see more content.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}