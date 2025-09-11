'use client'

import { Search, ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface SearchGlassProps {
  placeholder?: string
  onSearch?: (query: string) => void
  showLanguageSelector?: boolean
}

export default function SearchGlass({ 
  placeholder = "Article name, tag, category...",
  onSearch,
  showLanguageSelector = true
}: SearchGlassProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('En')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const languages = [
    { code: 'En', name: 'English' },
    { code: 'Id', name: 'Indonesia' },
    { code: 'Es', name: 'Español' },
    { code: 'Fr', name: 'Français' },
    { code: 'De', name: 'Deutsch' },
  ]

  return (
    <div className="flex items-center gap-3">
      {showLanguageSelector && (
        <div className="relative">
          <button 
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {selectedLanguage}
            <ChevronDown className="w-4 h-4" />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 py-2 bg-white/90 backdrop-blur-md border border-white/25 rounded-lg shadow-lg z-50 min-w-[120px]">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-white/50 hover:text-slate-900 transition-colors"
                  onClick={() => {
                    setSelectedLanguage(lang.code)
                    setIsDropdownOpen(false)
                  }}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      
      <div className="search-glass flex-1 max-w-md">
        <input 
          className="bg-transparent placeholder:text-slate-500/70 text-slate-800 flex-1 focus:outline-none text-sm"
          placeholder={placeholder}
          onChange={(e) => onSearch?.(e.target.value)}
        />
        <Search className="w-5 h-5 opacity-70 stroke-[1.5] flex-shrink-0" />
      </div>
    </div>
  )
}
