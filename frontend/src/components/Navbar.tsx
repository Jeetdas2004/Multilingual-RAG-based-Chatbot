'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { collegeNames } from '../utils/collegeNameUtils';
import { Input } from '@/components/ui/input';
import { Button } from './ui/button';
import { Search, Bot, School, Newspaper, ExternalLink } from 'lucide-react';

const Navbar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredColleges, setFilteredColleges] = useState(collegeNames);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);

    // Filter colleges based on search term
    setFilteredColleges(
      collegeNames.filter((name) =>
        name.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:scale-105 transition">
            🏛️
          </div>
          <div>
            <span className="font-extrabold text-gray-900 text-lg tracking-tight flex items-center gap-1.5">
              Pragya <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold">DTE</span>
            </span>
            <p className="text-[11px] text-gray-500 hidden sm:block">Govt of Rajasthan • Student Portal</p>
          </div>
        </Link>

        {/* Middle: College Search Dropdown */}
        <div className="relative w-full max-w-xs md:max-w-sm hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search Rajasthan colleges..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border-gray-200 focus:border-blue-500 bg-gray-50/50"
            />
          </div>
          {searchTerm && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-xl max-h-56 overflow-auto divide-y divide-gray-50">
              {filteredColleges.length > 0 ? (
                filteredColleges.map((college, index) => (
                  <div
                    key={index}
                    className="p-2.5 hover:bg-blue-50/60 cursor-pointer text-sm text-gray-700 transition"
                    onClick={() => {
                      setSearchTerm(college);
                      setFilteredColleges([]);
                    }}
                  >
                    {college}
                  </div>
                ))
              ) : (
                <div className="p-3 text-xs text-gray-400">No colleges matched</div>
              )}
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="#predictor-section"
            className="text-xs sm:text-sm font-semibold text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-gray-50 transition"
          >
            Predictor
          </a>
          <a
            href="#news-section"
            className="text-xs sm:text-sm font-semibold text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-gray-50 transition hidden sm:inline-block"
          >
            News
          </a>
          <a
            href="/assistant"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition hover:shadow"
          >
            <Bot className="w-4 h-4" />
            <span>AI Assistant</span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
