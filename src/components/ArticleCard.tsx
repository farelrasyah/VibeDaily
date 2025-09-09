import { ChevronRight } from 'lucide-react';

interface ArticleCardProps {
  title: string;
  category: string;
  timeAgo: string;
  variant?: 'small' | 'sidebar' | 'medium';
}

export default function ArticleCard({ 
  title, 
  category, 
  timeAgo, 
  variant = 'medium' 
}: ArticleCardProps) {
  
  if (variant === 'sidebar') {
    return (
      <div className="glass-card p-4 transition-all duration-150 ease-out hover:bg-white/50 hover:transform hover:translate-y-[-1px]">
        <div className="meta mb-2">
          {category} • {timeAgo}
        </div>
        <h3 className="text-[14px] font-semibold text-slate-800/90 leading-tight line-clamp-2">
          {title}
        </h3>
      </div>
    );
  }

  if (variant === 'small') {
    return (
      <div className="glass-card p-5 transition-all duration-150 ease-out hover:bg-white/50 hover:transform hover:translate-y-[-1px]">
        <div className="meta mb-3">
          {category} • {timeAgo}
        </div>
        <h3 className="text-[16px] font-semibold text-slate-800/90 leading-tight mb-4 line-clamp-2">
          {title}
        </h3>
        <button className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors text-[14px]">
          <span>Read article</span>
          <ChevronRight className="w-4 h-4 stroke-[1.5]" />
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 transition-all duration-150 ease-out hover:bg-white/50 hover:transform hover:translate-y-[-1px]">
      <div className="meta mb-3">
        {category} • {timeAgo}
      </div>
      <h3 className="text-[18px] font-semibold text-slate-800/90 leading-tight mb-4">
        {title}
      </h3>
      <button className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors text-[15px]">
        <span>Read article</span>
        <ChevronRight className="w-4 h-4 stroke-[1.5]" />
      </button>
    </div>
  );
}
