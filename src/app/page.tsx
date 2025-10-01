import { newsService, newsApiOrg, beritaIndo } from '@/lib/api'
import { getRelativeTime } from '@/lib/utils/date-formatter'
import HomeClient from './HomeClient'

export const revalidate = 300 // Revalidate every 5 minutes

export default async function Home() {
  // Fetch real data from APIs
  const [heroResult, trendingResult, mixedNewsResult, indonesiaNewsResult, internationalNewsResult] = await Promise.allSettled([
    newsApiOrg.getTopHeadlines({ country: 'us', pageSize: 1 }),
    newsService.getTrendingNews(6),
    newsService.getMixedNews(15),
    beritaIndo.getAllIndonesiaNews(),
    newsApiOrg.getTopHeadlines({ country: 'us', pageSize: 8 }),
  ])

  // Hero data (first international article)
  const heroArticle = heroResult.status === 'fulfilled' && heroResult.value.success 
    ? heroResult.value.data[0] 
    : null

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

  // Ticker items (trending news)
  const tickerItems = trendingResult.status === 'fulfilled' 
    ? trendingResult.value.slice(0, 6).map(article => ({
        title: article.title,
        href: article.url,
        category: article.source.name,
        time: getRelativeTime(article.publishedAt, article.language),
      }))
    : []

  // Article Grid items (mixed news with featured)
  const mixedNews = mixedNewsResult.status === 'fulfilled' ? mixedNewsResult.value : []
  const articleGridItems = mixedNews.map((article, index) => ({
    id: article.id,
    title: article.title,
    category: article.source.name,
    time: getRelativeTime(article.publishedAt, article.language),
    href: article.url,
    featured: index === 0 || index === 7, // Make first and 8th item featured
    description: article.description,
    tags: article.category ? [article.category] : ['News'],
    image: article.imageUrl || '',
  }))

  // Recommended items (Indonesia news for sidebar)
  const indonesiaNews = indonesiaNewsResult.status === 'fulfilled' && indonesiaNewsResult.value.success
    ? indonesiaNewsResult.value.data.slice(0, 6)
    : []

  // Fallback jika Indonesia news kosong - gunakan international news
  const fallbackNews = indonesiaNews.length === 0 && internationalNewsResult.status === 'fulfilled' && internationalNewsResult.value.success
    ? internationalNewsResult.value.data.slice(0, 6)
    : []

  const newsForSidebar = indonesiaNews.length > 0 ? indonesiaNews : fallbackNews

  const recommendedItems = newsForSidebar.length > 0 
    ? newsForSidebar.map((article, index) => ({
        thumb: article.imageUrl || `https://picsum.photos/380/214?random=${index}`,
        meta: `${article.source.name} • ${getRelativeTime(article.publishedAt, article.language)}`,
        title: article.title,
        href: article.url,
        featured: index === 0,
      }))
    : [
        // Fallback dummy data jika semua API gagal
        {
          thumb: 'https://picsum.photos/380/214?random=1',
          meta: 'News • Just now',
          title: 'Loading latest news...',
          href: '#',
          featured: true,
        },
        {
          thumb: 'https://picsum.photos/64/64?random=2',
          meta: 'News • 1 hour ago',
          title: 'Stay tuned for updates',
          href: '#',
          featured: false,
        },
      ]

  console.log(`✅ Recommended items count: ${recommendedItems.length}`);

  // NewsSlide items (international news)
  const internationalNews = internationalNewsResult.status === 'fulfilled' && internationalNewsResult.value.success
    ? internationalNewsResult.value.data.slice(0, 8)
    : []

  const newsSlideItems = internationalNews.map(article => ({
    id: article.id,
    title: article.title,
    category: article.source.name,
    time: getRelativeTime(article.publishedAt, 'en'),
    href: article.url,
    image: article.imageUrl || '/oval.gif',
    tags: article.category ? [article.category] : [],
  }))

  // ArticleSection items (trending Indonesia news)
  const newsForArticleSection = indonesiaNews.length > 0 ? indonesiaNews : fallbackNews
  
  const articleSectionItems = newsForArticleSection.slice(0, 8).map(article => ({
    id: article.id,
    title: article.title,
    category: article.source.name,
    time: getRelativeTime(article.publishedAt, article.language),
    href: article.url,
    image: article.imageUrl || 'https://picsum.photos/800/600?random=' + article.id,
    description: article.description,
  }))

  console.log(`✅ Article section items count: ${articleSectionItems.length}`);

  return (
    <HomeClient 
      heroData={heroData}
      tickerItems={tickerItems}
      articleGridItems={articleGridItems}
      recommendedItems={recommendedItems}
      newsSlideItems={newsSlideItems}
      articleSectionItems={articleSectionItems}
    />
  )
}

