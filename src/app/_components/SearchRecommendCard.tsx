'use client'

import Image from 'next/image'
import { Search, ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface RecommendItem {
  thumb: string
  meta: string
  title: string
  href: string
  featured?: boolean
}

interface SearchRecommendCardProps {
  items: RecommendItem[]
  title?: string
  viewAllHref?: string
  onSearch?: (query: string) => void
  placeholder?: string
  showLanguageSelector?: boolean
}

export default function SearchRecommendCard({ 
  items, 
  title = "Recommended",
  viewAllHref = "#",
  onSearch,
  placeholder = "Article name, tag, category...",
  showLanguageSelector = true
}: SearchRecommendCardProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('En')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const languages = [
    { code: 'En', name: 'English' },
    { code: 'Id', name: 'Indonesia' },
    { code: 'Es', name: 'Español' },
    { code: 'Fr', name: 'Français' },
    { code: 'De', name: 'Deutsch' },
  ]

  const featuredItem = items.find(item => item.featured) || items[0]
  const regularItems = items.filter(item => !item.featured).slice(0, 4)

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    onSearch?.(query)
  }

  return (
    <div className="w-full space-y-3">
      {/* Search Section - Separated */}
      <div className="search-bar-container">
        <div className="flex items-center gap-2.5">
          {showLanguageSelector && (
            <div className="relative">
              <button 
                className="language-selector-pill"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {selectedLanguage}
                <ChevronDown className="w-4 h-4 opacity-60" />
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
          
          <div className="search-input-pill">
            <input 
              className="search-input-field"
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            <Search className="search-input-icon" />
          </div>
        </div>
      </div>

      {/* Recommended Card - Separated */}
      <div className="recommended-card">
        {/* Header */}
        <div className="recommended-header">
          <h3 className="recommended-title">{title}</h3>
          <a href={viewAllHref} className="view-all-button">
            View all
          </a>
        </div>

        {/* Featured Article */}
        {featuredItem && (
          <a href={featuredItem.href} className="featured-card">
            <div className="featured-image-wrapper">
              <Image
                src={featuredItem.thumb}
                alt={featuredItem.title}
                fill
                className="featured-img"
              />
              <div className="featured-gradient"></div>
              <div className="featured-text">
                <p className="featured-category">{featuredItem.meta}</p>
                <h4 className="featured-headline">
                  {featuredItem.title}
                </h4>
              </div>
            </div>
          </a>
        )}

        {/* Article List */}
        <div className="article-list">
          {regularItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="article-list-item"
            >
              <div className="article-text">
                <p className="article-category">{item.meta}</p>
                <h5 className="article-headline">
                  {item.title}
                </h5>
              </div>
              <div className="article-thumbnail">
                <Image
                  src={item.thumb}
                  alt={item.title}
                  fill
                  className="article-img"
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
