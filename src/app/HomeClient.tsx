'use client'

import { useState, useCallback } from 'react'
import NavigationDropdown from '../modules/landing-page/widgets/NavigationDropdown'
import Hero from '../modules/landing-page/sections/Hero'
import Ticker from '../modules/landing-page/widgets/Ticker'
import ArticleGrid from '../modules/landing-page/sections/ArticleGrid'
import NewsSlide from '../modules/landing-page/sections/NewsSlide'
import ArticleSection from '../modules/landing-page/sections/ArticleSection'
import SocialMediaSection from '../modules/landing-page/sections/SocialMediaSection'
import SearchRecommendCard from '../modules/landing-page/widgets/SearchRecommendCard'
import Footer from '../modules/landing-page/sections/Footer'
import { getNavigationItems, NewsSource, getAllCategoriesForNavigation, getAllCategoryIdsForNavigation, getAllCategorySourcesForNavigation, getAllNewsSources, isValidCategoryForSource } from '../lib/news-categories'
import { newsService } from '../lib/api'

interface HomeClientProps {
  heroData: {
    category: string
    time: string
    title: string
    tags: string[]
    ctaText: string
    articleId: string | null
  }
  tickerItems: Array<{
    id: string
    title: string
    href: string
    category: string
    time: string
  }>
  articleGridItems: Array<{
    id: string
    title: string
    category: string
    time: string
    href: string
    featured?: boolean
    description?: string
    tags?: string[]
    image?: string
  }>
  recommendedItems: Array<{
    id: string
    thumb: string
    meta: string
    title: string
    href: string
    featured?: boolean
  }>
  newsSlideItems: Array<{
    id: string
    title: string
    category: string
    time: string
    href: string
    image: string
    tags?: string[]
  }>
  articleSectionItems: Array<{
    id: string
    title: string
    category: string
    time: string
    href: string
    image: string
    description?: string
  }>
  socialMediaSectionData?: {
    featuredNews?: {
      id: string
      title: string
      category: string
      time: string
      href: string
      description?: string
      tags?: string[]
    }
    newsList?: Array<{
      id: string
      title: string
      category: string
      time: string
      href: string
    }>
    newsImages?: string[]
    backgroundImage?: string
    allArticles?: Array<{
      id: string
      title: string
      category: string
      time: string
      href: string
      description?: string
      tags?: string[]
      imageUrl?: string
    }>
  }
}

export default function HomeClient({ 
  heroData, 
  tickerItems, 
  articleGridItems, 
  recommendedItems,
  newsSlideItems,
  articleSectionItems,
  socialMediaSectionData
}: HomeClientProps) {
  const [activeChip, setActiveChip] = useState('All')
  const [selectedSource, setSelectedSource] = useState<NewsSource | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [filteredArticles, setFilteredArticles] = useState<any[]>([])

  // Get navigation items with proper structure
  const navItems = [
    { 
      label: 'All', 
      active: activeChip === 'All',
      dropdownItems: ['Latest Articles', 'Popular Posts', 'Trending Topics', 'Featured Content']
    },
    { 
      label: 'News', 
      active: activeChip === 'News',
      dropdownItems: ['Breaking News', 'Tech News', 'Business Updates', 'World Events']
    },
    { 
      label: 'Category', 
      active: activeChip === 'Category',
      dropdownItems: getAllCategoriesForNavigation(),
      dropdownIds: getAllCategoryIdsForNavigation(),
      sources: getAllCategorySourcesForNavigation()
    },
    { 
      label: 'Guides', 
      active: activeChip === 'Guides',
      dropdownItems: ['How-to Guides', 'Tutorials', 'Best Practices', 'Tips & Tricks']
    },
    { 
      label: 'Recommended', 
      active: activeChip === 'Recommended',
      dropdownItems: ['Editor\'s Choice', 'Must Read', 'Top Picks', 'Staff Recommendations']
    },
  ]

  // Handle category selection
  const handleCategorySelection = useCallback(async (
    parentLabel: string,
    dropdownItem: string,
    dropdownId?: string,
    source?: NewsSource
  ) => {
    console.log(`🎯 Category selected: ${parentLabel}/${dropdownItem} (ID: ${dropdownId}, Source: ${source})`)

    if (parentLabel === 'Category' && dropdownId) {
      // For unified Category dropdown, find the first source that has this category
      const allSources = getAllNewsSources();
      let foundSource: NewsSource | null = null;

      for (const sourceInfo of allSources) {
        if (isValidCategoryForSource(sourceInfo.id, dropdownId)) {
          foundSource = sourceInfo.id;
          break;
        }
      }

      if (foundSource) {
        console.log(`🔍 Testing API call for ${foundSource}/${dropdownId}`)
        setIsLoading(true)
        setSelectedSource(foundSource)
        setSelectedCategory(dropdownId)
        setActiveChip(parentLabel)

        try {
          console.log(`📡 Calling newsService.getNewsBySourceAndCategory(${foundSource}, ${dropdownId}, 20)`)
          const articles = await newsService.getNewsBySourceAndCategory(foundSource, dropdownId, 20)
          console.log(`✅ API returned ${articles.length} articles`)
          setFilteredArticles(articles)
        } catch (error) {
          console.error(`❌ Failed to load articles for ${foundSource}/${dropdownId}:`, error)
          setFilteredArticles([])
        } finally {
          setIsLoading(false)
        }
      } else {
        console.warn(`⚠️ No source found for category: ${dropdownId}`)
      }
    } else if (source && dropdownId) {
      // For source-specific dropdowns (if we revert to that structure)
      console.log(`🔍 Testing API call for ${source}/${dropdownId}`)
      setIsLoading(true)
      setSelectedSource(source)
      setSelectedCategory(dropdownId)
      setActiveChip(parentLabel)

      try {
        console.log(`📡 Calling newsService.getNewsBySourceAndCategory(${source}, ${dropdownId}, 20)`)
        const articles = await newsService.getNewsBySourceAndCategory(source, dropdownId, 20)
        console.log(`✅ API returned ${articles.length} articles`)
        setFilteredArticles(articles)
      } catch (error) {
        console.error(`❌ Failed to load articles for ${source}/${dropdownId}:`, error)
        setFilteredArticles([])
      } finally {
        setIsLoading(false)
      }
    } else {
      console.log(`⚠️ Missing source or dropdownId: source=${source}, dropdownId=${dropdownId}`)
      // Handle "All" or other non-source categories
      setActiveChip(parentLabel)
      setSelectedSource(null)
      setSelectedCategory(null)
      setFilteredArticles([])
    }
  }, [])

  const handleNavItemClick = (item: any) => {
    console.log(`🎯 Nav item clicked: ${item.label}`)
    if (item.label === 'All') {
      setActiveChip('All')
      setSelectedSource(null)
      setSelectedCategory(null)
      setFilteredArticles([])
    }
  }

  const handleHeroCta = () => {
    if (heroData.articleId) {
      window.location.href = `/article/${heroData.articleId}`;
    }
  }

  return (
    <div className="min-h-screen w-full">
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="max-w-[1440px] mx-auto">
          {/* Header */}
          <header className="mb-6 lg:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
              <div className="flex items-center space-x-2 flex-shrink-0">
                <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">◉</span>
                </div>
                <span className="text-xl font-bold text-slate-900">VibeDaily</span>
              </div>
              <div className="flex-1 min-w-0">
                <NavigationDropdown
                  items={navItems}
                  onItemClick={handleNavItemClick}
                  onDropdownItemClick={handleCategorySelection}
                />
              </div>
            </div>
          </header>

          {/* Main two-column layout - responsive with proper ordering */}
          <main className="flex flex-col xl:flex-row gap-6 sm:gap-8 xl:items-start">
            <div className="flex-1 min-w-0">
              {/* Show loading indicator when filtering */}
              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border-2 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-slate-600">Loading {selectedSource}/{selectedCategory} articles...</span>
                  </div>
                </div>
              )}

              {/* Show filtered content when category is selected, otherwise show default content */}
              {selectedSource && selectedCategory && !isLoading ? (
                // Filtered Category Content
                <div className="space-y-8">
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-0.5 h-6 bg-violet-600 rounded-full"></div>
                      <h2 className="text-2xl font-bold text-slate-900">
                        {navItems.find(item => item.active)?.label} - {selectedCategory}
                      </h2>
                    </div>
                    <p className="text-slate-600">
                      Showing latest articles from {selectedSource} in {selectedCategory} category
                    </p>
                  </div>
                  
                  {filteredArticles.length > 0 ? (
                    <ArticleSection items={filteredArticles.slice(0, 7)} />
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-slate-500">No articles found for this category</p>
                    </div>
                  )}
                </div>
              ) : (
                // Default Content (when no category is selected)
                <>
                  <Hero {...heroData} onCta={handleHeroCta} />
                  <Ticker items={tickerItems} />
                  <ArticleGrid items={articleGridItems} />
                  {/* News Slide Section (new, below ArticleGrid) */}
                  <NewsSlide items={newsSlideItems} />
                  {/* Article Section (new, after NewsSlide) */}
                  <ArticleSection items={articleSectionItems} />
                  {/* Social Media Section moved outside the centered max-w container so it can span the page */}
                </>
              )}
            </div>

            <aside className="w-full xl:w-[380px] xl:flex-shrink-0 xl:-mt-[72px] order-last xl:order-none">
              <div className="sticky top-4 xl:top-20">
                <SearchRecommendCard
                  items={recommendedItems}
                  onSearch={(query: string) => console.log('Search:', query)}
                />
              </div>
            </aside>
          </main>
        </div>
      </div>

      {/* Social Media Section (full-bleed within page padding) */}
      <SocialMediaSection 
        featuredNews={socialMediaSectionData?.featuredNews}
        newsList={socialMediaSectionData?.newsList || []}
        newsImages={socialMediaSectionData?.newsImages || []}
        backgroundImage={socialMediaSectionData?.backgroundImage}
        allArticles={socialMediaSectionData?.allArticles || []}
      />
      
      {/* Footer Section */}
      <Footer />
    </div>
  )
}
