'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { guidesService, GuideArticle } from '@/lib/api/guides'

export default function TipsTricks() {
  const router = useRouter()
  const [articles, setArticles] = useState<GuideArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [selectedImpact, setSelectedImpact] = useState<string | null>(null)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  useEffect(() => {
    const fetchTipsTricks = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await guidesService.getTipsTricks()
        setArticles(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tips & tricks')
      } finally {
        setLoading(false)
      }
    }

    fetchTipsTricks()
  }, [])

  const filteredArticles = articles.filter(article => {
    const matchesType = !selectedType || article.type === selectedType
    const matchesImpact = !selectedImpact || article.impact === selectedImpact
    const matchesTag = !selectedTag || article.tags.includes(selectedTag)
    return matchesType && matchesImpact && matchesTag
  })

  const allTypes = Array.from(new Set(articles.map(article => article.type).filter(Boolean))) as string[]
  const allImpacts = ['High', 'Medium', 'Low']
  const allTags = Array.from(new Set(articles.flatMap(article => article.tags)))

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Tip': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'Trick': return 'bg-green-50 text-green-700 border-green-200'
      case 'Hack': return 'bg-purple-50 text-purple-700 border-purple-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'text-red-600'
      case 'Medium': return 'text-yellow-600'
      case 'Low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'High': return '🔥'
      case 'Medium': return '⚡'
      case 'Low': return '💡'
      default: return '💡'
    }
  }

  const handleArticleClick = (articleId: string) => {
    router.push(`/guide/${articleId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading tips & tricks...</p>
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load tips & tricks</h3>
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
              <h1 className="text-3xl font-bold text-slate-900">Tips & Tricks</h1>
            </div>
            <p className="text-lg text-slate-600 max-w-3xl">
              Quick wins, clever techniques, and insider knowledge to level up your development skills.
              Discover time-saving shortcuts, powerful features, and smart solutions to common problems.
            </p>
          </header>

          {/* Filter Section */}
          <div className="mb-8 space-y-4">
            {/* Type Filter */}
            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-2">Type</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedType(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedType === null
                      ? 'bg-violet-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Types
                </button>
                {allTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedType === type
                        ? 'bg-violet-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type}s
                  </button>
                ))}
              </div>
            </div>

            {/* Impact Filter */}
            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-2">Impact Level</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedImpact(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedImpact === null
                      ? 'bg-violet-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Impacts
                </button>
                {allImpacts.map(impact => (
                  <button
                    key={impact}
                    onClick={() => setSelectedImpact(impact)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedImpact === impact
                        ? 'bg-violet-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {impact} Impact
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
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getTypeColor(article.type || 'Tip')}`}>
                      {article.type || 'Tip'}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-lg">{getImpactIcon(article.impact || 'Medium')}</span>
                      <span className={`text-xs font-medium ${getImpactColor(article.impact || 'Medium')}`}>
                        {article.impact || 'Medium'} Impact
                      </span>
                    </div>
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
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">{article.readTime}</span>
                  <div className="flex items-center text-violet-600 group-hover:translate-x-1 transition-transform">
                    <span className="text-sm font-medium mr-1">
                      {article.type === 'Tip' ? 'Get Tip' : article.type === 'Trick' ? 'Learn Trick' : 'Discover Hack'}
                    </span>
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tips & tricks found</h3>
                <p className="text-gray-500">Try adjusting your filters to discover more content.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}