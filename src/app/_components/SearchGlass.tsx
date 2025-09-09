'use client'

import { Search } from 'lucide-react'

interface SearchGlassProps {
  placeholder?: string
  onSearch?: (query: string) => void
}

export default function SearchGlass({ 
  placeholder = "Article name, tag, category...",
  onSearch 
}: SearchGlassProps) {
  return (
    <div className="search-glass w-80 max-w-full">
      <input 
        className="bg-transparent placeholder:text-slate-500/70 text-slate-800 flex-1 focus:outline-none text-sm"
        placeholder={placeholder}
        onChange={(e) => onSearch?.(e.target.value)}
      />
      <Search className="w-5 h-5 opacity-70 stroke-[1.5] flex-shrink-0" />
    </div>
  )
}
