import Header from '@/components/Header';
import ArticleCard from '@/components/ArticleCard';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-3">
            {/* Best of the Week Section */}
            <div className="mb-8">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-4 font-medium">
                BEST OF THE WEEK
              </div>
              
              {/* Featured Article */}
              <div className="relative bg-gradient-to-br from-purple-400 via-blue-400 to-purple-600 rounded-3xl p-8 text-white overflow-hidden">
                {/* Background decoration */}
                <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                <div className="absolute right-20 bottom-0 w-64 h-64 bg-white/5 rounded-full translate-y-20"></div>
                
                <div className="relative z-10">
                  <div className="text-xs text-white/80 mb-2">
                    Blockchain News • 4 hours ago
                  </div>
                  <h1 className="text-4xl font-bold mb-4 leading-tight max-w-md">
                    Top Analyst Unveils Ethereum Catalyst That Could Trigger Nearly 50% Surge for ETH – Here's His Outlook
                  </h1>
                  <div className="text-sm text-white/80 mb-6">
                    Miltation • Analytical
                  </div>
                  <button className="flex items-center gap-2 text-white hover:text-white/80 transition-colors">
                    <span>Read article</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ArticleCard
                title="Top Analyst Unveils Ethereum Catalyst That Could Trigger Nearly 50%..."
                category="Blockchain News"
                timeAgo="4 hours ago"
                imageUrl="https://picsum.photos/300/200?random=1"
                variant="small"
              />
              <ArticleCard
                title="Over 65% of Crypto-Related Tweets and 84% of Conversations on Red..."
                category="Blockchain News"
                timeAgo="4 hours ago"
                imageUrl="https://picsum.photos/300/200?random=2"
                variant="small"
              />
              <ArticleCard
                title="STX Price Prediction: After 100% Price Jump in December, What's in Sto..."
                category="Blockchain News"
                timeAgo="4 hours ago"
                imageUrl="https://picsum.photos/300/200?random=3"
                variant="small"
              />
            </div>
          </div>

          {/* Sidebar - Right Side */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              {/* Recommended Section Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Recommended</h2>
                <button className="text-sm text-gray-500 hover:text-gray-700">
                  View all
                </button>
              </div>

              {/* Recommended Articles */}
              <div className="space-y-4">
                <ArticleCard
                  title="Over 65% of Crypto-Related Tweets and 84% of Conversations on Reddit Were Positive in 2023"
                  category="Blockchain News"
                  timeAgo="4 hours ago"
                  imageUrl="https://picsum.photos/300/200?random=4"
                  variant="sidebar"
                />
                <ArticleCard
                  title="Over 65% of Crypto-Related Tweets and 84% of Conversations on Reddit Were Positive in 2023"
                  category="Blockchain News"
                  timeAgo="4 hours ago"
                  imageUrl="https://picsum.photos/300/200?random=5"
                  variant="sidebar"
                />
                <ArticleCard
                  title="STX Price Prediction: After 100% Price Jump in December, What's in Store for 2024?"
                  category="Blockchain News"
                  timeAgo="4 hours ago"
                  imageUrl="https://picsum.photos/300/200?random=6"
                  variant="sidebar"
                />
                <ArticleCard
                  title="US-Approved Spot Bitcoin ETFs Could Surpass Entire $50 Million Crypto ETF Market: Bitwise"
                  category="Blockchain News"
                  timeAgo="4 hours ago"
                  imageUrl="https://picsum.photos/300/200?random=7"
                  variant="sidebar"
                />
                <ArticleCard
                  title="Former FTX CEO Sam Bankman-Fried and Caroline Heads Sentencing Delayed Pending Discovery"
                  category="Blockchain News"
                  timeAgo="4 hours ago"
                  imageUrl="https://picsum.photos/300/200?random=8"
                  variant="sidebar"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
