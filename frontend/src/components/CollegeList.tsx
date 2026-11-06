'use client';

import React, { useState } from 'react';
import { Building2, Search, ExternalLink, MapPin } from 'lucide-react';

interface College {
  name: string;
  code: string;
  city: string;
  minScore: number;
  branches: string[];
  website: string;
}

const colleges: College[] = [
  {
    name: "Government Polytechnic College, Ajmer",
    code: "gpcajmer",
    city: "Ajmer",
    minScore: 82,
    branches: ["Computer Science", "Civil", "Electrical", "Mechanical", "Electronics"],
    website: "https://hte.rajasthan.gov.in/college/gpcajmer"
  },
  {
    name: "Government Polytechnic College, Jaipur",
    code: "gpcjaipur",
    city: "Jaipur",
    minScore: 86,
    branches: ["Computer Science", "IT", "Electrical", "Civil", "Mechanical"],
    website: "https://hte.rajasthan.gov.in/college/gpcjaipur"
  },
  {
    name: "Government Polytechnic College, Alwar",
    code: "gpcalwar",
    city: "Alwar",
    minScore: 78,
    branches: ["Mechanical", "Electrical", "Computer Science", "Chemical"],
    website: "https://hte.rajasthan.gov.in/college/gpcalwar"
  },
  {
    name: "Government Polytechnic College, Jodhpur",
    code: "gpcjodhpur",
    city: "Jodhpur",
    minScore: 81,
    branches: ["Computer Science", "Civil", "Electrical", "Petroleum"],
    website: "https://hte.rajasthan.gov.in/college/gpcjodhpur"
  },
  {
    name: "Government Polytechnic College, Kota",
    code: "gpckota",
    city: "Kota",
    minScore: 80,
    branches: ["Electrical (Power)", "Mechanical", "Chemical", "Instrumentation"],
    website: "https://hte.rajasthan.gov.in/college/gpckota"
  },
  {
    name: "Government Polytechnic College, Bikaner",
    code: "gpcbikaner",
    city: "Bikaner",
    minScore: 79,
    branches: ["Renewable / Solar Energy", "Electrical", "Mechanical", "Civil"],
    website: "https://hte.rajasthan.gov.in/college/gpcbikaner"
  }
];

const CollegeList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = colleges.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.branches.some(b => b.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Institutions Directory</h3>
            <p className="text-sm text-gray-500">Government polytechnic & technical colleges in Rajasthan</p>
          </div>
        </div>
      </div>

      <div className="relative mb-4">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          placeholder="Search college, city, or branch..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        />
      </div>

      <div className="space-y-3 overflow-y-auto max-h-[360px] pr-1">
        {filtered.map((college, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/20 transition group"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition">
                  {college.name}
                </h4>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                  <MapPin className="w-3 h-3 text-gray-400" /> {college.city}, Rajasthan
                </div>
              </div>
              <a
                href={college.website}
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-indigo-600 p-1"
                title="Visit College Portal"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {college.branches.map((b, bIdx) => (
                <span
                  key={bIdx}
                  className="px-2 py-0.5 bg-gray-100 text-gray-700 text-[11px] font-medium rounded-md"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollegeList;
