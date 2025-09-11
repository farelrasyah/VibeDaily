'use client'

import { ChevronDown, Plus } from 'lucide-react'

interface NavChip {
  label: string
  href?: string
  icon?: 'chevron' | 'plus'
  caret?: boolean
  active?: boolean
}

interface NavChipsProps {
  items: NavChip[]
  onChipClick?: (item: NavChip) => void
}

export default function NavChips({ items, onChipClick }: NavChipsProps) {
  return (
    <nav className="flex gap-2 overflow-x-auto scrollbar-hide">
      {items.map((item, index) => (
        <button
          key={index}
          className={`pill ${item.active ? 'active' : ''}`}
          onClick={() => onChipClick?.(item)}
        >
          {item.active && <span className="w-1.5 h-1.5 bg-slate-700 rounded-full mr-2"></span>}
          <span className={item.caret || item.icon ? 'mr-1' : ''}>{item.label}</span>
          {item.caret && <ChevronDown className="w-3.5 h-3.5 stroke-[1.5] opacity-70" />}
          {item.icon === 'chevron' && <ChevronDown className="w-3.5 h-3.5 stroke-[1.5] opacity-70" />}
          {item.icon === 'plus' && <Plus className="w-3.5 h-3.5 stroke-[1.5] opacity-70" />}
        </button>
      ))}
    </nav>
  )
}
