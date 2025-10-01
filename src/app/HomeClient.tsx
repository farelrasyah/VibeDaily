'use client'

import { useState } from 'react'
import NavigationDropdown from '../modules/landing-page/widgets/NavigationDropdown'
import Hero from '../modules/landing-page/sections/Hero'
import Ticker from '../modules/landing-page/widgets/Ticker'
import ArticleGrid from '../modules/landing-page/sections/ArticleGrid'
import NewsSlide from '../modules/landing-page/sections/NewsSlide'
import ArticleSection from '../modules/landing-page/sections/ArticleSection'
import SocialMediaSection from '../modules/landing-page/sections/SocialMediaSection'
import SearchRecommendCard from '../modules/landing-page/widgets/SearchRecommendCard'
import Footer from '../modules/landing-page/sections/Footer'

interface HomeClientProps {
  heroData: {
    category: string
    time: string
    title: string
    tags: string[]
    ctaText: string
    articleUrl: string
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
      label: 'Exclusives', 
      active: activeChip === 'Exclusives',
      dropdownItems: ['Premium Articles', 'Member Only', 'Insider Reports']
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

  const handleHeroCta = () => {
    if (heroData.articleUrl && heroData.articleUrl !== '#') {
      window.open(heroData.articleUrl, '_blank', 'noopener,noreferrer')
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
                  onItemClick={(item) => setActiveChip(item.label)}
                  onDropdownItemClick={(parentLabel, dropdownItem) => {
                    console.log(`Navigation: ${parentLabel} -> ${dropdownItem}`)
                  }}
                />
              </div>
            </div>
          </header>

          {/* Main two-column layout - responsive with proper ordering */}
          <main className="flex flex-col xl:flex-row gap-6 sm:gap-8 xl:items-start">
            <div className="flex-1 min-w-0">
              <Hero {...heroData} onCta={handleHeroCta} />
              <Ticker items={tickerItems} />
              <ArticleGrid items={articleGridItems} />
              {/* News Slide Section (new, below ArticleGrid) */}
              <NewsSlide items={newsSlideItems} />
              {/* Article Section (new, after NewsSlide) */}
              <ArticleSection items={articleSectionItems} />
              {/* Social Media Section moved outside the centered max-w container so it can span the page */}
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
