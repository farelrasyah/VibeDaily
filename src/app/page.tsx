import { newsService } from '@/lib/api'
import { getRelativeTime } from '@/lib/utils/date-formatter'
import HomeClient from './HomeClient'

export const revalidate = 300 // Revalidate every 5 minutes

export default async function Home() {
  // Use the improved API services that already handle multiple sources
  const [heroResult, trendingResult, mixedNewsResult, socialMediaResult] = await Promise.allSettled([
    newsService.getMixedNews(15), // For hero section - already includes multiple sources
    newsService.getTrendingNews(25), // For trending section - already includes multiple sources  
    newsService.getMixedNews(40), // For main grid - larger dataset for deduplication
    newsService.getMixedNews(30), // For social media section
  ])

  // Deduplication tracker - track used articles by URL, title, and ID
  const usedArticles = new Set<string>()
  
  /**
   * Check if article is unique (not already used)
   * Normalize title and URL for better duplicate detection
   */
  const isUnique = (article: any): boolean => {
    const normalizedTitle = article.title?.toLowerCase().trim()
    const normalizedUrl = article.url?.toLowerCase().trim()
    const articleId = article.id?.toLowerCase().trim()
    
    // Check if any identifier already exists
    if (usedArticles.has(normalizedTitle)) return false
    if (usedArticles.has(normalizedUrl)) return false
    if (articleId && usedArticles.has(articleId)) return false
    
    return true
  }
  
  /**
   * Mark article as used
   */
  const markAsUsed = (article: any): void => {
    const normalizedTitle = article.title?.toLowerCase().trim()
    const normalizedUrl = article.url?.toLowerCase().trim()
    const articleId = article.id?.toLowerCase().trim()
    
    if (normalizedTitle) usedArticles.add(normalizedTitle)
    if (normalizedUrl) usedArticles.add(normalizedUrl)
    if (articleId) usedArticles.add(articleId)
  }

  // Hero data (first unique article from mixed news)
  const heroArticles = heroResult.status === 'fulfilled' ? heroResult.value : []
  const heroArticle = heroArticles.find((article: any) => isUnique(article)) || heroArticles[0] || null
  
  if (heroArticle) markAsUsed(heroArticle)

  const heroData = heroArticle ? {
    category: heroArticle.source.name,
    time: getRelativeTime(heroArticle.publishedAt, 'en'),
    title: heroArticle.title,
    tags: heroArticle.category ? [heroArticle.category] : ['News'],
    ctaText: 'Read article',
    articleId: heroArticle.id, // Use article ID for internal routing
  } : {
    category: 'News',
    time: 'Loading...',
    title: 'Stay informed with the latest news and updates',
    tags: ['News'],
    ctaText: 'Read article',
    articleId: null,
  }

  // Ticker items (trending news - filter out used articles)
  const trendingArticles = trendingResult.status === 'fulfilled' ? trendingResult.value : []
  const uniqueTrendingArticles = trendingArticles.filter(article => isUnique(article)).slice(0, 6)
  
  const tickerItems = uniqueTrendingArticles.map(article => {
    markAsUsed(article)
    return {
      id: article.id,
      title: article.title,
      href: article.url,
      category: article.source.name,
      time: getRelativeTime(article.publishedAt, article.language),
    }
  })

  // Article Grid items (mixed news with featured - filter duplicates and ensure valid images)
  const mixedNews = mixedNewsResult.status === 'fulfilled' ? mixedNewsResult.value : []
  const uniqueMixedNews = mixedNews
    .filter(article => isUnique(article))
    .filter(article => !article.imageUrl || article.imageUrl.trim() === '' || !article.imageUrl.includes('oval.gif') && !article.imageUrl.includes('picsum.photos'))
    .slice(0, 15)
  
  const articleGridItems = uniqueMixedNews.map((article, index) => {
    markAsUsed(article)
    return {
      id: article.id,
      title: article.title,
      category: article.source.name,
      time: getRelativeTime(article.publishedAt, article.language),
      href: article.url,
      featured: index === 0 || index === 7, // Make first and 8th item featured
      description: article.description,
      tags: article.category ? [article.category] : ['News'],
      image: article.imageUrl || '', // Empty string jika tidak ada gambar, bukan dummy
    }
  })

  // Recommended items (from mixed news for sidebar - filter duplicates and ensure valid images)
  const allMixedNews = mixedNewsResult.status === 'fulfilled' ? mixedNewsResult.value : []
  const indonesiaNews = allMixedNews
    .filter((article: any) => isUnique(article))
    .filter((article: any) => !article.imageUrl || article.imageUrl.trim() === '' || !article.imageUrl.includes('picsum.photos'))
    .slice(0, 6)

  // Fallback from social media result if needed
  const socialMediaNews = socialMediaResult.status === 'fulfilled' ? socialMediaResult.value : []
  const internationalForFallback = socialMediaNews
    .filter((article: any) => isUnique(article))
    .filter((article: any) => article.imageUrl && article.imageUrl.trim() !== '' && !article.imageUrl.includes('picsum.photos'))
    .slice(0, 6)
  
  const fallbackNews = indonesiaNews.length === 0 ? internationalForFallback : []

  const newsForSidebar = indonesiaNews.length > 0 ? indonesiaNews : fallbackNews

  const recommendedItems = newsForSidebar.length > 0 
    ? newsForSidebar.map((article, index) => {
        markAsUsed(article)
        return {
          id: article.id,
          thumb: article.imageUrl || '', // Empty string, bukan picsum dummy
          meta: `${article.source.name} • ${getRelativeTime(article.publishedAt, article.language)}`,
          title: article.title,
          href: article.url,
          featured: index === 0,
        }
      })
    : [] // Empty array jika tidak ada data, bukan dummy fallback

  console.log(`✅ Recommended items count: ${recommendedItems.length}`);

  // NewsSlide items (from social media news - filter duplicates and invalid images)
  const internationalNews = socialMediaNews
    .filter((article: any) => isUnique(article))
    .filter((article: any) => article.imageUrl && article.imageUrl.trim() !== '' && !article.imageUrl.includes('oval.gif'))
    .slice(0, 8)

  const newsSlideItems = internationalNews.map(article => {
    markAsUsed(article)
    return {
      id: article.id,
      title: article.title,
      category: article.source.name,
      time: getRelativeTime(article.publishedAt, 'en'),
      href: article.url,
      image: article.imageUrl!, // Non-null karena sudah di-filter
      tags: article.category ? [article.category] : [],
    }
  })

  // ArticleSection items (fresh data from multiple sources - NOT from remaining)
  const articleSectionResult = await Promise.allSettled([
    newsService.getMixedNews(20), // Fresh mixed news for ArticleSection
  ])
  
  const articleSectionRawData = articleSectionResult[0].status === 'fulfilled' ? articleSectionResult[0].value : []
  
  // For ArticleSection, we want diverse articles from different sources
  // Don't use the global deduplication since we want variety
  const articleSectionItems = articleSectionRawData
    .filter(article => article && article.title && article.url)
    .slice(0, 15) // Get more articles for better selection
    .map(article => ({
      id: article.id,
      title: article.title,
      category: article.source?.name || 'News',
      time: getRelativeTime(article.publishedAt, article.language),
      href: article.url,
      image: article.imageUrl || '',
      description: article.description,
      tags: article.category ? [article.category] : [],
    }))

  console.log(`✅ Article section items count: ${articleSectionItems.length}`)
  console.log(`✅ Article section sources:`, [...new Set(articleSectionItems.map(item => item.category))])
  console.log(`✅ Total unique articles used: ${usedArticles.size}`)

  // Social Media Section data (from social media news)
  const allSocialArticles = socialMediaNews
  const extraSocialArticles = socialMediaNews
    .slice(10) // Take remaining articles  // Combine multiple sources for social media section
  const combinedArticlesForSocial = [
    ...allSocialArticles,
    ...extraSocialArticles,
    ...(mixedNewsResult.status === 'fulfilled' ? mixedNewsResult.value : []),
  ]
  
  const remainingNewsForSocial = combinedArticlesForSocial
    .filter(article => isUnique(article)) // Filter yang belum digunakan
    .filter(article => article.imageUrl && article.imageUrl.trim() !== '' && !article.imageUrl.includes('oval.gif') && !article.imageUrl.includes('picsum.photos')) // Prioritize articles with valid images
    .slice(0, 20) // Ambil 20 artikel untuk social media section

  console.log(`🔍 Debug Social Media Section:`)
  console.log(`- Total social articles: ${allSocialArticles.length}`)
  console.log(`- Extra social articles: ${extraSocialArticles.length}`)
  console.log(`- Combined articles for social: ${combinedArticlesForSocial.length}`)
  console.log(`- Remaining articles for social: ${remainingNewsForSocial.length}`)
  console.log(`- Used articles so far: ${usedArticles.size}`)

  const socialMediaSectionData = remainingNewsForSocial.length > 0 ? {
    featuredNews: {
      id: remainingNewsForSocial[0].id,
      title: remainingNewsForSocial[0].title,
      category: remainingNewsForSocial[0].source.name,
      time: getRelativeTime(remainingNewsForSocial[0].publishedAt, 'en'),
      href: remainingNewsForSocial[0].url,
      description: remainingNewsForSocial[0].description,
      tags: remainingNewsForSocial[0].category ? [remainingNewsForSocial[0].category, 'Tech', 'Business'] : ['News', 'Tech', 'Business'],
    },
    newsList: remainingNewsForSocial.length > 1 
      ? remainingNewsForSocial.slice(1, 9).map(article => {
          markAsUsed(article) // Mark as used
          return {
            id: article.id,
            title: article.title,
            category: article.source.name,
            time: getRelativeTime(article.publishedAt, 'en'),
            href: article.url,
          }
        })
      : [], // Empty array if not enough articles
    // Use news images for Instagram cards and background (improved logic)
    newsImages: (() => {
      // Get all images from remaining articles (including the featured one)
      const allImages = remainingNewsForSocial
        .map(article => article.imageUrl)
        .filter((url): url is string => Boolean(url && url.trim() !== ''));
      
      console.log(`🖼️ Available images for social media: ${allImages.length}`, allImages.slice(0, 5));
      
      // If we have valid images, use them. If not enough, repeat the first one or use empty string
      if (allImages.length >= 3) {
        return allImages.slice(0, 3);
      } else if (allImages.length > 0) {
        // Repeat images to fill 3 slots
        const result = [...allImages];
        while (result.length < 3) {
          result.push(allImages[0]);
        }
        return result;
      } else {
        // No valid images, return empty strings (will use fallback gradients)
        return ['', '', ''];
      }
    })(),
    backgroundImage: remainingNewsForSocial.find(article => 
      article.imageUrl && article.imageUrl.trim() !== ''
    )?.imageUrl || undefined,
    // Add all articles with images for the component to use
    allArticles: remainingNewsForSocial.map(article => ({
      id: article.id,
      title: article.title,
      category: article.source.name,
      time: getRelativeTime(article.publishedAt, 'en'),
      href: article.url,
      description: article.description || undefined,
      tags: article.category ? [article.category] : ['News'],
      imageUrl: article.imageUrl || undefined,
    })),
  } : {
    // Fallback: create from any available articles if no remaining articles
    featuredNews: allSocialArticles.length > 0 ? {
      id: allSocialArticles[0].id,
      title: allSocialArticles[0].title,
      category: allSocialArticles[0].source.name,
      time: getRelativeTime(allSocialArticles[0].publishedAt, 'en'),
      href: allSocialArticles[0].url,
      description: allSocialArticles[0].description,
      tags: ['News', 'Tech', 'Business'],
    } : undefined,
    newsList: [],
    newsImages: ['', '', ''],
    backgroundImage: undefined,
    allArticles: allSocialArticles.slice(0, 10).map((article: any) => ({
      id: article.id,
      title: article.title,
      category: article.source.name,
      time: getRelativeTime(article.publishedAt, 'en'),
      href: article.url,
      description: article.description || undefined,
      tags: article.category ? [article.category] : ['News'],
      imageUrl: article.imageUrl || undefined,
    })),
  }

  // Mark featured news as used if exists
  if (socialMediaSectionData?.featuredNews) {
    markAsUsed(remainingNewsForSocial[0])
  }

  return (
    <HomeClient 
      heroData={heroData}
      tickerItems={tickerItems}
      articleGridItems={articleGridItems}
      recommendedItems={recommendedItems}
      newsSlideItems={newsSlideItems}
      articleSectionItems={articleSectionItems}
      socialMediaSectionData={socialMediaSectionData}
    />
  )
}

