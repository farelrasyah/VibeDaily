import { newsService, newsApiOrg, beritaIndo } from '@/lib/api'
import { getRelativeTime } from '@/lib/utils/date-formatter'
import HomeClient from './HomeClient'

export const revalidate = 300 // Revalidate every 5 minutes

export default async function Home() {
  // Fetch real data from APIs with larger datasets to avoid duplicates
  const [heroResult, trendingResult, mixedNewsResult, indonesiaNewsResult, internationalNewsResult, extraInternationalResult] = await Promise.allSettled([
    newsApiOrg.getTopHeadlines({ country: 'us', pageSize: 10 }), // Fetch more for variety
    newsService.getTrendingNews(25), // Fetch more for deduplication
    newsService.getMixedNews(35), // Fetch more articles
    beritaIndo.getAllIndonesiaNews(),
    newsApiOrg.getTopHeadlines({ country: 'us', pageSize: 30 }), // Fetch more
    newsApiOrg.searchNews({ query: 'news', pageSize: 25 }), // Additional source for social media
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

  // Hero data (first unique international article)
  const heroArticle = heroResult.status === 'fulfilled' && heroResult.value.success 
    ? heroResult.value.data.find(article => isUnique(article)) || heroResult.value.data[0]
    : null
  
  if (heroArticle) markAsUsed(heroArticle)

  const heroData = heroArticle ? {
    category: heroArticle.source.name,
    time: getRelativeTime(heroArticle.publishedAt, 'en'),
    title: heroArticle.title,
    tags: heroArticle.category ? [heroArticle.category] : ['News'],
    ctaText: 'Read article',
    articleUrl: heroArticle.url,
  } : {
    category: 'News',
    time: 'Loading...',
    title: 'Stay informed with the latest news and updates',
    tags: ['News'],
    ctaText: 'Read article',
    articleUrl: '#',
  }

  // Ticker items (trending news - filter out used articles)
  const trendingArticles = trendingResult.status === 'fulfilled' ? trendingResult.value : []
  const uniqueTrendingArticles = trendingArticles.filter(article => isUnique(article)).slice(0, 6)
  
  const tickerItems = uniqueTrendingArticles.map(article => {
    markAsUsed(article)
    return {
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

  // Recommended items (Indonesia news for sidebar - filter duplicates and ensure valid images)
  const indonesiaNews = indonesiaNewsResult.status === 'fulfilled' && indonesiaNewsResult.value.success
    ? indonesiaNewsResult.value.data
        .filter(article => isUnique(article))
        .filter(article => !article.imageUrl || article.imageUrl.trim() === '' || !article.imageUrl.includes('picsum.photos'))
        .slice(0, 6)
    : []

  // Fallback jika Indonesia news kosong - gunakan international news (filter duplicates and dummy images)
  const internationalForFallback = internationalNewsResult.status === 'fulfilled' && internationalNewsResult.value.success
    ? internationalNewsResult.value.data
        .filter(article => isUnique(article))
        .filter(article => article.imageUrl && article.imageUrl.trim() !== '' && !article.imageUrl.includes('picsum.photos'))
        .slice(0, 6)
    : []
  
  const fallbackNews = indonesiaNews.length === 0 ? internationalForFallback : []

  const newsForSidebar = indonesiaNews.length > 0 ? indonesiaNews : fallbackNews

  const recommendedItems = newsForSidebar.length > 0 
    ? newsForSidebar.map((article, index) => {
        markAsUsed(article)
        return {
          thumb: article.imageUrl || '', // Empty string, bukan picsum dummy
          meta: `${article.source.name} • ${getRelativeTime(article.publishedAt, article.language)}`,
          title: article.title,
          href: article.url,
          featured: index === 0,
        }
      })
    : [] // Empty array jika tidak ada data, bukan dummy fallback

  console.log(`✅ Recommended items count: ${recommendedItems.length}`);

  // NewsSlide items (international news - filter duplicates and invalid images)
  const internationalNews = internationalNewsResult.status === 'fulfilled' && internationalNewsResult.value.success
    ? internationalNewsResult.value.data
        .filter(article => isUnique(article))
        .filter(article => article.imageUrl && article.imageUrl.trim() !== '' && !article.imageUrl.includes('oval.gif'))
        .slice(0, 8)
    : []

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

  // ArticleSection items (trending Indonesia news - filter duplicates and dummy images)
  // Use remaining Indonesia news that haven't been used
  const remainingIndonesiaNews = indonesiaNewsResult.status === 'fulfilled' && indonesiaNewsResult.value.success
    ? indonesiaNewsResult.value.data
        .filter(article => isUnique(article))
        .filter(article => !article.imageUrl || article.imageUrl.trim() === '' || !article.imageUrl.includes('picsum.photos'))
        .slice(0, 8)
    : []
  
  const newsForArticleSection = remainingIndonesiaNews.length > 0 
    ? remainingIndonesiaNews 
    : internationalForFallback
        .filter(article => isUnique(article))
        .filter(article => !article.imageUrl || !article.imageUrl.includes('picsum.photos'))
        .slice(0, 8)
  
  const articleSectionItems = newsForArticleSection.map(article => {
    markAsUsed(article)
    return {
      id: article.id,
      title: article.title,
      category: article.source.name,
      time: getRelativeTime(article.publishedAt, article.language),
      href: article.url,
      image: article.imageUrl || '', // Empty string, bukan picsum dummy
      description: article.description,
    }
  })

  console.log(`✅ Article section items count: ${articleSectionItems.length}`)
  console.log(`✅ Total unique articles used: ${usedArticles.size}`)

  // Social Media Section data (ambil artikel baru dari multiple sources yang belum terpakai)
  const allInternationalArticles = internationalNewsResult.status === 'fulfilled' && internationalNewsResult.value.success
    ? internationalNewsResult.value.data
    : []
  
  const extraInternationalArticles = extraInternationalResult.status === 'fulfilled' && extraInternationalResult.value.success
    ? extraInternationalResult.value.data
    : []
  
  // Combine multiple sources for social media section
  const combinedArticlesForSocial = [
    ...allInternationalArticles,
    ...extraInternationalArticles,
    ...(mixedNewsResult.status === 'fulfilled' ? mixedNewsResult.value : []),
  ]
  
  const remainingNewsForSocial = combinedArticlesForSocial
    .filter(article => isUnique(article)) // Filter yang belum digunakan
    .filter(article => article.imageUrl && article.imageUrl.trim() !== '' && !article.imageUrl.includes('oval.gif') && !article.imageUrl.includes('picsum.photos')) // Prioritize articles with valid images
    .slice(0, 20) // Ambil 20 artikel untuk social media section

  console.log(`🔍 Debug Social Media Section:`)
  console.log(`- Total international articles: ${allInternationalArticles.length}`)
  console.log(`- Extra international articles: ${extraInternationalArticles.length}`)
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
    featuredNews: allInternationalArticles.length > 0 ? {
      id: allInternationalArticles[0].id,
      title: allInternationalArticles[0].title,
      category: allInternationalArticles[0].source.name,
      time: getRelativeTime(allInternationalArticles[0].publishedAt, 'en'),
      href: allInternationalArticles[0].url,
      description: allInternationalArticles[0].description,
      tags: ['News', 'Tech', 'Business'],
    } : undefined,
    newsList: [],
    newsImages: ['', '', ''],
    backgroundImage: undefined,
    allArticles: allInternationalArticles.slice(0, 10).map(article => ({
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

