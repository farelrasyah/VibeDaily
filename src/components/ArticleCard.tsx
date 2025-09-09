import Image from 'next/image';

interface ArticleCardProps {
  title: string;
  category: string;
  timeAgo: string;
  imageUrl: string;
  variant?: 'small' | 'sidebar' | 'medium';
}

export default function ArticleCard({ 
  title, 
  category, 
  timeAgo, 
  imageUrl, 
  variant = 'medium' 
}: ArticleCardProps) {
  
  if (variant === 'sidebar') {
    return (
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
        <div className="aspect-video relative">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <div className="text-xs text-gray-500 mb-2">
            {category} • {timeAgo}
          </div>
          <h3 className="font-semibold text-sm text-gray-900 leading-tight line-clamp-3">
            {title}
          </h3>
        </div>
      </div>
    );
  }

  if (variant === 'small') {
    return (
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
        <div className="aspect-video relative">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-6">
          <div className="text-xs text-gray-500 mb-3">
            {category} • {timeAgo}
          </div>
          <h3 className="font-semibold text-lg text-gray-900 leading-tight mb-4 line-clamp-2">
            {title}
          </h3>
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm">
            <span>Read article</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      <div className="aspect-video relative">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <div className="text-xs text-gray-500 mb-3">
          {category} • {timeAgo}
        </div>
        <h3 className="font-semibold text-xl text-gray-900 leading-tight mb-4">
          {title}
        </h3>
        <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
          <span>Read article</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
