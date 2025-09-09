import React from 'react';

interface SidebarArticle {
  title: string;
  timestamp: string;
  source: string;
  imageUrl?: string;
}

const Sidebar: React.FC = () => {
  const articles: SidebarArticle[] = [
    {
      title: "US-Approved Spot Bitcoin ETFs Could Surpass Entire $50 Billion Crypto ETP Market: BISMAL",
      timestamp: "4 hours ago",
      source: "Blockchain News",
      imageUrl: "/api/placeholder/300/200"
    },
    {
      title: "Over 65% of Crypto-Related Tweets and 84% of Conversations on Reddit Were Positive in 2023",
      timestamp: "4 hours ago", 
      source: "Blockchain News",
      imageUrl: "/api/placeholder/300/200"
    },
    {
      title: "STX Price Prediction: After 100% Price Jump in December, What's in Store for 2024?",
      timestamp: "4 hours ago",
      source: "Blockchain News",
      imageUrl: "/api/placeholder/300/200"
    },
    {
      title: "Former FTX CEO Sam Bankman-Fried and Debtors Reach Settlement in Criminal Proceedings",
      timestamp: "4 hours ago",
      source: "Blockchain News", 
      imageUrl: "/api/placeholder/300/200"
    }
  ];
  return (
    <aside className="w-full">
      {/* Recommended Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Recommended</h2>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
          View all
          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Recommended Articles */}
      <div className="space-y-4">
        {articles.map((article, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            {article.imageUrl && (
              <div className="relative h-32 bg-gray-200">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
                <span>{article.source}</span>
                <span>•</span>
                <span>{article.timestamp}</span>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 line-clamp-2 leading-5">
                {article.title}
              </h3>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Read article
              </button>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
