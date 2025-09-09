import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Best of the Week Badge */}
            <div className="mb-6">
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                BEST OF THE WEEK
              </span>
            </div>

            {/* Featured Article */}
            <div className="relative bg-gradient-to-r from-purple-100 via-blue-50 to-purple-50 rounded-2xl p-8 mb-8 overflow-hidden">
              {/* Gradient Circle */}
              <div className="absolute right-0 top-0 w-80 h-80 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full opacity-30 translate-x-20 -translate-y-20"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <span>Blockchain News</span>
                  <span>•</span>
                  <span>4 hours ago</span>
                </div>
                
                <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight max-w-2xl">
                  Top Analyst Unveils Ethereum Catalyst That Could Trigger Nearly 50% Surge for ETH – Here's His Outlook
                </h1>
                
                <button className="inline-flex items-center gap-2 text-gray-700 font-medium hover:text-gray-900 transition-colors">
                  Read article
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Secondary Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Article 1 */}
              <article className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <span>Blockchain News</span>
                  <span>•</span>
                  <span>4 hours ago</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-4 leading-tight">
                  Top Analyst Unveils Ethereum Catalyst That Could Trigger Nearly 50%
                </h3>
                <button className="text-gray-600 text-sm font-medium hover:text-gray-900 transition-colors">
                  Read article →
                </button>
              </article>

              {/* Article 2 */}
              <article className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <span>Blockchain News</span>
                  <span>•</span>
                  <span>4 hours ago</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-4 leading-tight">
                  Over 65% of Crypto-Related Tweets and 84% of Conversations on Reddit
                </h3>
                <button className="text-gray-600 text-sm font-medium hover:text-gray-900 transition-colors">
                  Read article →
                </button>
              </article>

              {/* Article 3 */}
              <article className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <span>Blockchain News</span>
                  <span>•</span>
                  <span>4 hours ago</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-4 leading-tight">
                  STX Price Prediction: After 100% Price Jump in December, What's in Store for 2024?
                </h3>
                <button className="text-gray-600 text-sm font-medium hover:text-gray-900 transition-colors">
                  Read article →
                </button>
              </article>
            </div>

            {/* Trending Now Section */}
            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                  TRENDING NOW
                </span>
                <button className="text-gray-600 text-sm font-medium hover:text-gray-900 transition-colors flex items-center gap-1">
                  View more
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Large trending article */}
                <div className="md:row-span-2">
                  <article className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow h-full">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <span>Blockchain News</span>
                      <span>•</span>
                      <span>4 hours ago</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                      Over 65% of Crypto-Related Tweets and 84% of Conversations on Reddit Were Positive in 2023
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      <span>5 min read</span>
                      <span>•</span>
                      <span>Analytics</span>
                    </div>
                    <button className="text-gray-600 text-sm font-medium hover:text-gray-900 transition-colors">
                      Read article →
                    </button>
                    
                    {/* Solana branding element */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                      <div className="text-white font-bold text-lg">SOLANA</div>
                    </div>
                  </article>
                </div>

                {/* Grid of smaller trending articles */}
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <article key={i} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="aspect-square bg-gray-100 rounded-lg mb-3"></div>
                      <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                        <span>Blockchain News</span>
                        <span>•</span>
                        <span>4 hours ago</span>
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 leading-tight">
                        Over 65% of Crypto-Related Tweets and 84% of Conversations on Reddit Were...
                      </h3>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </main>
    </div>
  )
}
