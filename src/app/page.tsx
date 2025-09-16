'use client'

import { useState } from 'react'
import NavigationDropdown from './_components/NavigationDropdown'
import Hero from './_components/Hero'
import Ticker from './_components/Ticker'
import ArticleGrid from './_components/ArticleGrid'
import NewsSlide from './_components/NewsSlide'
import ArticleSection from './_components/ArticleSection'
import SearchRecommendCard from './_components/SearchRecommendCard'

export default function Home() {
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

  const heroData = {
    category: 'Branding',
    time: 'a year ago',
    title: 'Corporate identity design that ensures brand recognition',
    tags: ['Ethereum', 'Analytics'],
    ctaText: 'Read article',
    onCta: () => console.log('Hero CTA clicked'),
  }

  const tickerItems = [
    {
      title: 'Top Analyst Unveils Ethereum Catalyst That Could Trigger Nearly 50% Surge',
      href: '#',
      category: 'Blockchain News',
      time: '4 hours ago',
    },
    {
      title: 'Over 65% of Crypto-Related Tweets and 84% of Conversations on Reddit Were Positive',
      href: '#',
      category: 'Blockchain News',
      time: '4 hours ago',
    },
    {
      title: 'STX Price Prediction: After 100% Price Jump in December, What\'s in Store',
      href: '#',
      category: 'Blockchain News',
      time: '4 hours ago',
    },
    {
      title: 'US-Approved Spot Bitcoin ETFs Could Surpass Entire $50 Million Crypto ETF Market',
      href: '#',
      category: 'Blockchain News',
      time: '2 hours ago',
    },
  ]

  // Penting: minimal 1 featured + >=6 thumbs agar slide awal penuh
  const articleGridItems = [
    {
      id: '1',
      title: '10 trends in ecommerce website design that are relevant in 2024',
      category: 'E-commerce',
      time: 'a year ago',
      href: '#',
      featured: true,
      description: 'Personalization and AI to offer personalized products; Minimalistic design, simplicity and ease of use; Mobile optimization; Using voice assistants is also important in ecommerce design; Utilizing AR and VR...',
      tags: ['Design', 'Trends', 'E-commerce'],
      image: '' // kosong => kita pakai gambar bawaan di komponen (agar layout cocok)
    },
    // 6 thumbs pertama
    { id: '2',  title: 'Best apps logo ideas', category: 'Logo',        time: '3 years ago', href: '#', image: 'https://picsum.photos/560/315?random=2'  },
    { id: '3',  title: 'How to make iphone app designs: a guide for beginners', category: 'iOS', time: 'a year ago', href: '#', image: 'https://picsum.photos/560/315?random=3' },
    { id: '4',  title: 'How to make an attractive social media app design',     category: 'Mobile app', time: 'a year ago', href: '#', image: 'https://picsum.photos/560/315?random=4' },
    { id: '5',  title: 'The main stages of creating a fitness app ui',          category: 'Mobile app', time: 'a year ago', href: '#', image: 'https://picsum.photos/560/315?random=5' },
    { id: '6',  title: 'How to make web application design that users will love', category: 'Mobile app', time: 'a year ago', href: '#', image: 'https://picsum.photos/560/315?random=6' },
    { id: '8',  title: 'Advanced UI/UX design patterns', category: 'Design',    time: '2 weeks ago', href: '#', image: 'https://picsum.photos/560/315?random=8' },

    // featured slide 2
    {
      id: '7',
      title: '10 trends in ecommerce website design that are relevant in 2024',
      category: 'E-commerce',
      time: 'a year ago',
      href: '#',
      featured: true,
      description: 'Personalization and AI to offer personalized products; Minimalistic design, simplicity and ease of use; Mobile optimization; Using voice assistants is also important in ecommerce design; Utilizing AR and VR...',
      tags: ['Design', 'Trends', 'E-commerce']
    },
    // thumbs tambahan
    { id: '9',  title: 'Modern web development frameworks', category: 'Development', time: '1 week ago', href: '#', image: 'https://picsum.photos/560/315?random=9'  },
    { id: '10', title: 'Digital marketing strategies for 2024', category: 'Marketing', time: '3 days ago', href: '#', image: 'https://picsum.photos/560/315?random=10' },
  ]

  const recommendedItems = [
    { thumb: 'https://picsum.photos/380/214?random=5',  meta: 'Blockchain News • 4 hours ago', title: 'US-Approved Spot Bitcoin ETFs Could Surpass Entire $50 Million Crypto ETF Market: Bitwise', href: '#', featured: true },
    { thumb: 'https://picsum.photos/64/64?random=6',   meta: 'Blockchain News • 4 hours ago', title: 'STX Price Prediction: After 100% Price Jump in December, What\'s in Store for 2024?', href: '#' },
    { thumb: 'https://picsum.photos/64/64?random=7',   meta: 'Blockchain News • 3 hours ago', title: 'Over 65% of Crypto-Related Tweets and 84% of Conversations on Reddit Were Positive in 2023', href: '#' },
    { thumb: 'https://picsum.photos/64/64?random=8',   meta: 'Blockchain News • 2 hours ago', title: 'Former FTX CEO Sam Bankman-Fried and Caroline Heads Sentencing Delayed Pending Discovery', href: '#' },
    { thumb: 'https://picsum.photos/64/64?random=9',   meta: 'Blockchain News • 1 hour ago',  title: 'Bitcoin Mining Difficulty Reaches All-Time High as Network Security Strengthens', href: '#' },
    { thumb: 'https://picsum.photos/64/64?random=10',  meta: 'Blockchain News • 30 min ago',  title: 'Ethereum Layer 2 Solutions See Record Transaction Volume Growth', href: '#' },
  ]

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

          {/* Main two-column layout */}
          <main className="flex flex-col xl:flex-row gap-6 sm:gap-8 xl:items-start">
            <div className="flex-1 min-w-0">
              <Hero {...heroData} />
              <Ticker items={tickerItems} />
              <ArticleGrid items={articleGridItems} />
              {/* News Slide Section (new, below ArticleGrid) */}
              <NewsSlide />
              {/* Article Section (new, after NewsSlide) */}
              <ArticleSection />
            </div>

            <aside className="w-full xl:w-[380px] xl:flex-shrink-0 xl:-mt-[72px]">
              <SearchRecommendCard
                items={recommendedItems}
                onSearch={(query: string) => console.log('Search:', query)}
              />
            </aside>
          </main>
        </div>
      </div>
    </div>
  )
}
