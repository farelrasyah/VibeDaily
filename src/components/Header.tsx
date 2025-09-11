'use client'

import React, { useState } from 'react';
import Link from 'next/link';

const Header = () => {
  const [activeTab, setActiveTab] = useState('All')
  
  const navItems = [
    { name: 'All', count: 3 },
    { name: 'News', count: 3 },
    { name: 'Exclusives', count: 1 },
    { name: 'Guides', count: 2 },
    { name: 'Recommended', count: 3 }
  ]

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">◉</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Logo</span>
            </Link>
            
            {/* Navigation */}
            <nav className="flex items-center space-x-6">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className="flex items-center space-x-1 header-pill-button"
                  style={{ 
                    color: '#000',
                    fontFamily: 'Sequel Sans, sans-serif',
                    fontSize: '14px',
                    fontWeight: '700'
                  }}
                >
                  <span style={{ 
                    color: '#000',
                    fontFamily: 'Sequel Sans, sans-serif',
                    fontSize: '14px',
                    fontWeight: '700'
                  }}>
                    {item.name}
                  </span>
                  <svg className="w-3 h-3 text-gray-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              ))}
            </nav>
          </div>
          
          {/* Right side - Search and Language */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Article name, tag, category..."
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 pl-10 text-sm w-80 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <svg 
                className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            {/* Language Selector */}
            <div className="flex items-center space-x-1 text-sm">
              <span className="font-medium text-gray-700">EN</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
