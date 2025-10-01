# 🚀 Quick Start Guide - API Integration

## ⚡ Immediate Actions Required

### 1. **RESTART Development Server** (CRITICAL!)

```powershell
# Stop current server if running (Ctrl+C)
# Then restart:
npm run dev
```

**Why?** `.env.local` environment variables are only loaded at server startup.

---

## ✅ What Was Done

### Files Created (7 new files)
1. `.env.local` - API configuration
2. `src/types/news.types.ts` - TypeScript interfaces
3. `src/lib/api/newsapi-org.ts` - International news service
4. `src/lib/api/berita-indo.ts` - Indonesia news service
5. `src/lib/api/index.ts` - Unified API facade
6. `src/lib/utils/date-formatter.ts` - Date utilities
7. `src/app/HomeClient.tsx` - Client wrapper component

### Files Modified (3 files)
1. `src/app/page.tsx` - Now fetches real data from APIs
2. `src/modules/landing-page/sections/NewsSlide.tsx` - Accepts real data
3. `src/modules/landing-page/sections/ArticleSection.tsx` - Accepts real data

### What Did NOT Change
- ❌ No UI components changed
- ❌ No styling modified  
- ❌ No layout altered
- ✅ **Only data source changed from dummy to real!**

---

## 🔍 Verify Integration

After restarting the server, check:

### Hero Section
- ✅ Should show latest US news from NewsAPI.org
- ✅ Title, category, and time should be real data
- ✅ Click should open real article URL

### Ticker (Scrolling news)
- ✅ Should show trending news from both APIs
- ✅ Time stamps should be relative ("2 hours ago")

### Article Grid
- ✅ Should show mix of international + Indonesia news
- ✅ Images should load (or fallback images)

### News Slide (Breaking News)
- ✅ Should show international breaking news
- ✅ Carousel should work with real articles

### Article Section (News Update)
- ✅ Should show Indonesia news (CNN, CNBC, Tempo)
- ✅ Featured article + 6 smaller articles

### Recommended Sidebar
- ✅ Should show Indonesia news articles
- ✅ First item is featured with large image

---

## 🐛 If Something's Wrong

### Problem: TypeScript errors in IDE
**Solution:** Restart VS Code or TypeScript server
```
Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

### Problem: No data showing
**Solution:**
1. Check `.env.local` exists in root folder
2. Verify API key: `NEWSAPI_ORG_API_KEY=912e88a93b5f40a09cefa4bb0a7de0f5`
3. Restart dev server

### Problem: "Cannot find module" errors
**Solution:**
```powershell
# Clear Next.js cache
Remove-Item -Recurse -Force .next
npm run dev
```

---

## 📊 API Info

### NewsAPI.org
- **Used For:** Hero, Ticker, News Slide
- **Rate Limit:** 100 requests/day (free)
- **Cache:** 5 minutes

### Berita Indo API  
- **Used For:** Article Section, Recommended
- **Rate Limit:** Unlimited
- **Cache:** 5 minutes

---

## 🎯 Next Steps

1. ✅ **Restart dev server** (if not done)
2. ✅ **Test all sections** work with real data
3. ✅ **Click on articles** to verify URLs work
4. ✅ **Check responsive** design on mobile
5. ✅ **Monitor console** for any errors

---

## 📝 Important Notes

- Data refreshes every 5 minutes (automatic)
- All article links open in new tabs
- Images have fallbacks if API doesn't provide
- Dates shown in relative time format
- No UI changes - looks exactly the same!

---

## 🎉 You're Done!

Your website now shows **real, live news** instead of dummy data!

Read `API_INTEGRATION_COMPLETE.md` for full documentation.
