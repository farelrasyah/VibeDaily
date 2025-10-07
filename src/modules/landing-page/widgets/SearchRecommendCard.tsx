'use client'

import Image from 'next/image'
import { Search, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface RecommendItem {
  id: string
  thumb: string
  meta: string
  title: string
  articleId: string
  featured?: boolean
}

interface SearchRecommendCardProps {
  items: RecommendItem[]
  title?: string
  viewAllHref?: string
  onSearch?: (query: string) => void
  placeholder?: string
  showLanguageSelector?: boolean
  isSearching?: boolean
  searchQuery?: string
}

export default function SearchRecommendCard({ 
  items, 
  title = "Recommended",
  viewAllHref = "#",
  onSearch,
  placeholder = "Article name, tag, category...",
  showLanguageSelector = true,
  isSearching = false,
  searchQuery: externalSearchQuery
}: SearchRecommendCardProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('En')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  // Use external search query if provided, otherwise use internal state
  const currentSearchQuery = externalSearchQuery !== undefined ? externalSearchQuery : searchQuery

  const languages = [
    { code: 'En', name: 'English' },
    { code: 'Id', name: 'Indonesia' },
    { code: 'Es', name: 'Español' },
    { code: 'Fr', name: 'Français' },
    { code: 'De', name: 'Deutsch' },
  ]

  // Debug: Log items count
  console.log('SearchRecommendCard items:', items.length)
  console.log('SearchRecommendCard searchQuery:', currentSearchQuery)
  console.log('SearchRecommendCard isSearching:', isSearching)
  if (items.length > 0) {
    console.log('📋 Items being displayed:', items.map(item => `"${item.title.substring(0, 40)}..."`).join(', '))
  }

  const featuredItem = items.find(item => item.featured) || items[0]
  const regularItems = items.filter(item => !item.featured).slice(0, 4)

  // Jika tidak ada items sama sekali atau sedang searching, tampilkan pesan
  if (!items || items.length === 0 || isSearching) {
    return (
      <div className="w-full space-y-2 sm:space-y-3">
        <div className="search-bar-container">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2.5">
            {showLanguageSelector && (
              <div className="relative order-2 sm:order-1">
                <button 
                  className="language-selector-pill w-full sm:w-auto justify-center sm:justify-start"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {selectedLanguage}
                  <ChevronDown className="w-3 sm:w-4 h-3 sm:h-4 opacity-60" />
                </button>
                
                {isDropdownOpen && (
                  <div className="language-dropdown-menu">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        className="language-option-item"
                        onClick={() => {
                          setSelectedLanguage(lang.code)
                          setIsDropdownOpen(false)
                        }}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            <div className="search-input-pill flex-1 order-1 sm:order-2">
              <input 
                className="search-input-field"
                placeholder={placeholder}
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
              <Search className="search-input-icon w-4 sm:w-5 h-4 sm:h-5" />
            </div>
          </div>
        </div>

        <div className="recommended-card">
          <div className="recommended-header">
            <h3 className="recommended-title">{title}</h3>
          </div>
          <div className="p-8 text-center text-slate-500">
            <p>{isSearching ? 'Searching articles...' : currentSearchQuery ? 'No articles found' : 'Loading recommendations...'}</p>
          </div>
        </div>
      </div>
    )
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    onSearch?.(query)
  }

  return (
    <div className="w-full space-y-2 sm:space-y-3">
      {/* Search Section - Separated + Responsive */}
      <div className="search-bar-container">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2.5">
          {showLanguageSelector && (
            <div className="relative order-2 sm:order-1">
              <button 
                className="language-selector-pill w-full sm:w-auto justify-center sm:justify-start"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {selectedLanguage}
                <ChevronDown className="w-3 sm:w-4 h-3 sm:h-4 opacity-60" />
              </button>
              
              {isDropdownOpen && (
                <div className="language-dropdown-menu">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      className="language-option-item"
                      onClick={() => {
                        setSelectedLanguage(lang.code)
                        setIsDropdownOpen(false)
                      }}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          
          <div className="search-input-pill flex-1 order-1 sm:order-2">
            <input 
              className="search-input-field"
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            <Search className="search-input-icon w-4 sm:w-5 h-4 sm:h-5" />
          </div>
        </div>
      </div>

      {/* Recommended Card - Separated + Responsive */}
      <div className="recommended-card">
        {/* Header */}
        <div className="recommended-header">
          <h3 className="recommended-title">{title}</h3>
          <a href={viewAllHref} className="view-all-button">
            View all
          </a>
        </div>

        {/* Featured Article - Responsive */}
        {featuredItem && (
          <div onClick={() => router.push(`/article/${featuredItem.articleId}`)} className="featured-card cursor-pointer">
            <div className="featured-image-wrapper h-40 sm:h-48 md:h-56">
              <Image
                src={featuredItem.thumb}
                alt={featuredItem.title}
                fill
                className="featured-img"
              />
              <div className="featured-gradient"></div>
              <div className="featured-text">
                <p className="featured-category text-xs sm:text-sm">{featuredItem.meta}</p>
                <h4 className="featured-headline text-sm sm:text-base md:text-lg">
                  {featuredItem.title}
                </h4>
              </div>
            </div>
          </div>
        )}

        {/* Article List - Responsive */}
        <div className="article-list space-y-3 sm:space-y-4">
          {regularItems.map((item, index) => (
            <div
              key={index}
              onClick={() => router.push(`/article/${item.articleId}`)}
              className="article-list-item p-3 sm:p-4 cursor-pointer"
            >
              <div className="article-text flex-1">
                <p className="article-category text-xs sm:text-sm">{item.meta}</p>
                <h5 className="article-headline text-sm sm:text-base">
                  {item.title}
                </h5>
              </div>
              <div className="article-thumbnail w-12 h-12 sm:w-16 sm:h-16">
                <Image
                  src={item.thumb}
                  alt={item.title}
                  fill
                  className="article-img"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
