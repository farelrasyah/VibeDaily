'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [activeChip, setActiveChip] = useState('All')
  const [selectedSource, setSelectedSource] = useState<NewsSource | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [filteredArticles, setFilteredArticles] = useState<any[]>([])

  // Function to load filtered articles
  const loadFilteredArticles = useCallback(async (source: NewsSource, category: string) => {
    setIsLoading(true)
    try {
      console.log(`� Auto-loading articles for ${source}/${category}`)
      const articles = await newsService.getNewsBySourceAndCategory(source, category, 20)
      console.log(`✅ Auto-loaded ${articles.length} articles`)
      setFilteredArticles(articles)
    } catch (error) {
      console.error(`❌ Failed to auto-load articles for ${source}/${category}:`, error)
      setFilteredArticles([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Load articles when source/category changes
  useEffect(() => {
    if (selectedSource && selectedCategory) {
      loadFilteredArticles(selectedSource, selectedCategory)
    } else {
      setFilteredArticles([])
    }
  }, [selectedSource, selectedCategory, loadFilteredArticles])

  // Read filter state from URL on mount
  useEffect(() => {
    const sourceParam = searchParams.get('source')
    const categoryParam = searchParams.get('category')
    
    if (sourceParam && categoryParam) {
      console.log('� Restoring filter state from URL:', { source: sourceParam, category: categoryParam })
      setSelectedSource(sourceParam as NewsSource)
      setSelectedCategory(categoryParam)
      setActiveChip('Category')  // Set active chip to Category when restoring from URL
    } else {
      // Clear state if no params
      setSelectedSource(null)
      setSelectedCategory(null)
      setActiveChip('All')
    }
  }, [searchParams])

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
    console.log('\n📋 Category Selection Debug Log:')
    console.log(`🎯 Selection Details:`);
    console.log(`  - Parent Label: ${parentLabel}`);
    console.log(`  - Selected Item: ${dropdownItem}`);
    console.log(`  - Category ID: ${dropdownId || 'undefined'}`);
    console.log(`  - Source: ${source || 'undefined'}`);

    // Validate category ID
    if (!dropdownId) {
      console.error('❌ Error: No category ID provided');
      return;
    }

    if (parentLabel === 'Category' && dropdownId) {
      // For unified Category dropdown, find the first source that has this category
      const allSources = getAllNewsSources();
      let foundSource: NewsSource | null = null;
      
      console.log('🔍 Searching for valid source for category:', dropdownId);
      console.log('Available sources:', allSources.map(s => s.id).join(', '));

      for (const sourceInfo of allSources) {
        console.log(`Checking source ${sourceInfo.id}...`);
        const isValid = isValidCategoryForSource(sourceInfo.id, dropdownId);
        console.log(`  - Is ${dropdownId} valid for ${sourceInfo.id}? ${isValid ? '✅ Yes' : '❌ No'}`);
        if (isValid) {
          foundSource = sourceInfo.id;
          console.log(`  ✨ Found valid source: ${sourceInfo.id}`);
          break;
        }
      }

      if (foundSource) {
        console.log(`🔍 Testing API call for ${foundSource}/${dropdownId}`)
        setIsLoading(true)
        setSelectedSource(foundSource)
        setSelectedCategory(dropdownId)
        setActiveChip(parentLabel)

        // Update URL with filter params
        const params = new URLSearchParams()
        params.set('source', foundSource)
        params.set('category', dropdownId)
        router.replace(`?${params.toString()}`, { scroll: false })

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

      // Update URL with filter params
      const params = new URLSearchParams()
      params.set('source', source)
      params.set('category', dropdownId)
      router.replace(`?${params.toString()}`, { scroll: false })

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
      
      // Clear URL params
      router.replace('/', { scroll: false })
    }
  }, [])

  const handleNavItemClick = (item: any) => {
    console.log(`🎯 Nav item clicked: ${item.label}`)
    if (item.label === 'All') {
      setActiveChip('All')
      setSelectedSource(null)
      setSelectedCategory(null)
      setFilteredArticles([])
      
      // Clear URL params
      router.replace('/', { scroll: false })
    }
  }

  const handleHeroCta = () => {
    if (heroData.articleId) {
      window.location.href = `/article/${heroData.articleId}`;
    }
  }

  // Transform filtered articles to match component data structures
  const getDisplayData = () => {
    // If we have filtered articles, transform them for all components
    if (selectedSource && selectedCategory && filteredArticles.length > 0) {
      const articles = filteredArticles;
      console.log(`🔄 Transforming ${articles.length} filtered articles for all components`);
      
      // Transform for Hero (use first article)
      const heroArticle = articles[0];
      const transformedHero = heroArticle ? {
        category: heroArticle.category || selectedSource?.toUpperCase() || 'NEWS',
        time: heroArticle.publishedAt ? new Date(heroArticle.publishedAt).toLocaleString() : 'Just now',
        title: heroArticle.title || 'Loading...',
        tags: heroArticle.tags || [],
        ctaText: 'Read article',
        articleId: heroArticle.id
      } : heroData;

      // Transform for Ticker (use articles 1-5, fallback to cycling through available articles)
      const getTickerArticles = () => {
        if (articles.length <= 1) return [];
        const tickerArticles = articles.slice(1, 6);
        // If we don't have enough articles, cycle through them
        while (tickerArticles.length < 5 && articles.length > 1) {
          const nextIndex = tickerArticles.length % (articles.length - 1) + 1;
          tickerArticles.push(articles[nextIndex]);
        }
        return tickerArticles;
      };

      const transformedTicker = getTickerArticles().map(article => ({
        id: article.id,
        title: article.title,
        href: `/article/${article.id}`,
        category: article.category || selectedSource?.toUpperCase() || 'NEWS',
        time: article.publishedAt ? new Date(article.publishedAt).toLocaleString() : 'Just now'
      }));

      // Transform for ArticleGrid (ensure we have enough articles)
      const getArticleGridData = () => {
        const gridArticles = [...articles];
        // Ensure we have at least 6 articles for proper grid display
        while (gridArticles.length < 6 && articles.length > 0) {
          gridArticles.push(...articles.slice(0, Math.min(6 - gridArticles.length, articles.length)));
        }
        return gridArticles.slice(0, 15);
      };

      const transformedArticleGrid = getArticleGridData().map((article, index) => ({
        id: `${article.id}-grid-${index}`,
        title: article.title,
        category: article.category || selectedSource?.toUpperCase() || 'NEWS',
        time: article.publishedAt ? new Date(article.publishedAt).toLocaleString() : 'Just now',
        href: `/article/${article.id}`,
        image: article.imageUrl,
        featured: index === 0, // Make first article featured
        tags: article.tags,
        description: article.description
      }));

      // Transform for NewsSlide (use different articles or cycle if needed)
      const getNewsSlideData = () => {
        if (articles.length <= 6) return articles;
        return articles.slice(6, 16);
      };

      const transformedNewsSlide = getNewsSlideData().map((article, index) => ({
        id: `${article.id}-slide-${index}`,
        title: article.title,
        category: article.category || selectedSource?.toUpperCase() || 'NEWS',
        time: article.publishedAt ? new Date(article.publishedAt).toLocaleString() : 'Just now',
        href: `/article/${article.id}`,
        image: article.imageUrl || '/placeholder-image.jpg',
        tags: article.tags
      }));

      // Transform for ArticleSection (use articles ensuring variety)
      const transformedArticleSection = articles.slice(0, 7).map((article, index) => ({
        id: `${article.id}-section-${index}`,
        title: article.title,
        category: article.category || selectedSource?.toUpperCase() || 'NEWS',
        time: article.publishedAt ? new Date(article.publishedAt).toLocaleString() : 'Just now',
        href: `/article/${article.id}`,
        image: article.imageUrl || '/placeholder-image.jpg',
        description: article.description,
        tags: article.tags
      }));

      // Transform for SearchRecommendCard (use different articles if available)
      const getRecommendedData = () => {
        if (articles.length <= 7) return articles.slice(0, 6);
        return articles.slice(7, 13);
      };

      const transformedRecommended = getRecommendedData().map((article, index) => ({
        id: `${article.id}-rec-${index}`,
        thumb: article.imageUrl || '/placeholder-image.jpg',
        meta: article.category || selectedSource?.toUpperCase() || 'NEWS',
        title: article.title,
        href: `/article/${article.id}`,
        featured: index === 0
      }));

      // Transform for SocialMediaSection
      const transformedSocialMedia = {
        featuredNews: articles[0] ? {
          id: articles[0].id,
          title: articles[0].title,
          category: articles[0].category || selectedSource?.toUpperCase() || 'NEWS',
          time: articles[0].publishedAt ? new Date(articles[0].publishedAt).toLocaleString() : 'Just now',
          href: `/article/${articles[0].id}`,
          description: articles[0].description,
          tags: articles[0].tags
        } : undefined,
        newsList: articles.slice(1, 9).map((article, index) => ({
          id: `${article.id}-social-${index}`,
          title: article.title,
          category: article.category || selectedSource?.toUpperCase() || 'NEWS',
          time: article.publishedAt ? new Date(article.publishedAt).toLocaleString() : 'Just now',
          href: `/article/${article.id}`,
          description: article.description,
          tags: article.tags
        })),
        newsImages: articles.slice(0, 3).map(article => article.imageUrl).filter(Boolean),
        backgroundImage: articles.find(article => article.imageUrl)?.imageUrl,
        allArticles: articles.slice(0, 20).map((article, index) => ({
          id: `${article.id}-all-${index}`,
          title: article.title,
          category: article.category || selectedSource?.toUpperCase() || 'NEWS',
          time: article.publishedAt ? new Date(article.publishedAt).toLocaleString() : 'Just now',
          href: `/article/${article.id}`,
          description: article.description,
          tags: article.tags,
          imageUrl: article.imageUrl
        }))
      };

      console.log(`✅ Transformed data:`, {
        hero: !!transformedHero,
        ticker: transformedTicker.length,
        articleGrid: transformedArticleGrid.length,
        newsSlide: transformedNewsSlide.length,
        articleSection: transformedArticleSection.length,
        recommended: transformedRecommended.length,
        socialMedia: !!transformedSocialMedia.featuredNews
      });

      return {
        hero: transformedHero,
        ticker: transformedTicker,
        articleGrid: transformedArticleGrid,
        newsSlide: transformedNewsSlide,
        articleSection: transformedArticleSection,
        recommended: transformedRecommended,
        socialMedia: transformedSocialMedia
      };
    }

    // Return original data when no filter is applied
    return {
      hero: heroData,
      ticker: tickerItems,
      articleGrid: articleGridItems,
      newsSlide: newsSlideItems,
      articleSection: articleSectionItems,
      recommended: recommendedItems,
      socialMedia: socialMediaSectionData
    };
  }

  const displayData = getDisplayData();

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

              {/* Show filter info when category is selected */}
              {selectedSource && selectedCategory && !isLoading && (
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
              )}

              {/* Always show same layout structure with appropriate data */}
              {!isLoading && (
                <div className={`space-y-8 ${isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'} transition-opacity duration-300`}>
                  <Hero {...displayData.hero} onCta={handleHeroCta} />
                  <Ticker items={displayData.ticker} />
                  <ArticleGrid items={displayData.articleGrid} />
                  <NewsSlide items={displayData.newsSlide} />
                  <ArticleSection items={displayData.articleSection} />
                </div>
              )}

              {/* Show "no articles" message only when filtering returns no results */}
              {selectedSource && selectedCategory && !isLoading && filteredArticles.length === 0 && (
                <div className="text-center py-12">
                  <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No articles found</h3>
                    <p className="text-slate-500">
                      No articles were found for {selectedCategory} category from {selectedSource}. 
                      Try selecting a different category or check back later.
                    </p>
                    <button
                      onClick={() => {
                        setActiveChip('All')
                        setSelectedSource(null)
                        setSelectedCategory(null)
                        setFilteredArticles([])
                      }}
                      className="mt-4 px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                    >
                      Show All Articles
                    </button>
                  </div>
                </div>
              )}
            </div>

            <aside className="w-full xl:w-[380px] xl:flex-shrink-0 xl:-mt-[72px] order-last xl:order-none">
              <div className="sticky top-4 xl:top-20">
                <SearchRecommendCard
                  items={displayData.recommended}
                  onSearch={(query: string) => console.log('Search:', query)}
                />
              </div>
            </aside>
          </main>
        </div>
      </div>

      {/* Social Media Section (full-bleed within page padding) */}
      <SocialMediaSection 
        featuredNews={displayData.socialMedia?.featuredNews}
        newsList={displayData.socialMedia?.newsList || []}
        newsImages={displayData.socialMedia?.newsImages || []}
        backgroundImage={displayData.socialMedia?.backgroundImage}
        allArticles={displayData.socialMedia?.allArticles || []}
      />
      
      {/* Footer Section */}
      <Footer />
    </div>
  )
}
