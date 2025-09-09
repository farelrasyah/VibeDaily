'use client'

import { useState } from 'react'
import NavChips from './_components/NavChips'
import Hero from './_components/Hero'
import Ticker from './_components/Ticker'
import RightRailList from './_components/RightRailList'

export default function Home() {
  const [activeChip, setActiveChip] = useState('All')

  const navItems = [
    { label: 'All', active: activeChip === 'All', caret: true },
    { label: 'News', active: activeChip === 'News' },
    { label: 'Exclusives', active: activeChip === 'Exclusives' },
    { label: 'Guides', active: activeChip === 'Guides' },
    { label: 'Recommended', active: activeChip === 'Recommended' },
  ]

  const heroData = {
    category: 'Blockchain News',
    time: '4 hours ago',
    title: 'Top Analyst Unveils Ethereum Catalyst That Could Trigger Nearly 50% Surge for ETH — Here\'s His Outlook',
    tags: ['Ethereum', 'Analytics'],
    ctaText: 'Read article',
    onCta: () => console.log('Hero CTA clicked'),
  }

  const tickerItems = [
    {
      thumb: 'https://picsum.photos/64/64?random=1',
      title: 'Top Analyst Unveils Ethereum Catalyst That Could Trigger Nearly 50% Surge',
      href: '#',
      category: 'Blockchain News',
      time: '4 hours ago',
    },
    {
      thumb: 'https://picsum.photos/64/64?random=2',
      title: 'Over 65% of Crypto-Related Tweets and 84% of Conversations on Reddit Were Positive',
      href: '#',
      category: 'Blockchain News',
      time: '4 hours ago',
    },
    {
      thumb: 'https://picsum.photos/64/64?random=3',
      title: 'STX Price Prediction: After 100% Price Jump in December, What\'s in Store',
      href: '#',
      category: 'Blockchain News',
      time: '4 hours ago',
    },
    {
      thumb: 'https://picsum.photos/64/64?random=4',
      title: 'US-Approved Spot Bitcoin ETFs Could Surpass Entire $50 Million Crypto ETF Market',
      href: '#',
      category: 'Blockchain News',
      time: '2 hours ago',
    },
  ]

  const recommendedItems = [
    {
      thumb: 'https://picsum.photos/380/214?random=5',
      meta: 'Blockchain News • 4 hours ago',
      title: 'US-Approved Spot Bitcoin ETFs Could Surpass Entire $50 Million Crypto ETF Market: Bitwise',
      href: '#',
      featured: true,
    },
    {
      thumb: 'https://picsum.photos/64/64?random=6',
      meta: 'Blockchain News • 4 hours ago',
      title: 'STX Price Prediction: After 100% Price Jump in December, What\'s in Store for 2024?',
      href: '#',
    },
    {
      thumb: 'https://picsum.photos/64/64?random=7',
      meta: 'Blockchain News • 3 hours ago',
      title: 'Over 65% of Crypto-Related Tweets and 84% of Conversations on Reddit Were Positive in 2023',
      href: '#',
    },
    {
      thumb: 'https://picsum.photos/64/64?random=8',
      meta: 'Blockchain News • 2 hours ago',
      title: 'Former FTX CEO Sam Bankman-Fried and Caroline Heads Sentencing Delayed Pending Discovery',
      href: '#',
    },
    {
      thumb: 'https://picsum.photos/64/64?random=9',
      meta: 'Blockchain News • 1 hour ago',
      title: 'Bitcoin Mining Difficulty Reaches All-Time High as Network Security Strengthens',
      href: '#',
    },
    {
      thumb: 'https://picsum.photos/64/64?random=10',
      meta: 'Blockchain News • 30 min ago',
      title: 'Ethereum Layer 2 Solutions See Record Transaction Volume Growth',
      href: '#',
    },
  ]

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="max-w-[1440px] mx-auto">
        {/* Header - Logo + Navigation chips only */}
        <header className="mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
            {/* Logo */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">◉</span>
              </div>
              <span className="text-xl font-bold text-slate-900">VibeDaily</span>
            </div>
            
            {/* Navigation Chips */}
            <div className="flex-1 min-w-0 overflow-hidden">
              <NavChips 
                items={navItems} 
                onChipClick={(item) => setActiveChip(item.label)} 
              />
            </div>
          </div>
        </header>

        {/* Main Layout - Flexbox untuk layout 2 kolom yang reliable */}
        <main className="flex flex-col xl:flex-row gap-6 sm:gap-8 xl:items-start">
          {/* Left Column - Main Content (flexible width) */}
          <div className="flex-1 min-w-0">
            {/* Section Badge */}
            <div className="mb-4 sm:mb-6">
              <span className="section-badge">Best of the week</span>
            </div>
            
            {/* Hero */}
            <Hero {...heroData} />
            
            {/* Ticker */}
            <Ticker items={tickerItems} />
          </div>

          {/* Right Rail - Responsive: full width mobile, 380px desktop */}
          <div className="w-full xl:w-[380px] xl:flex-shrink-0 xl:-mt-[72px]">
            <RightRailList 
              items={recommendedItems} 
              onSearch={(query) => console.log('Search:', query)}
            />
          </div>
        </main>
        </div>
      </div>
    </div>
  )
}
