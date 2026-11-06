'use client';

import React from 'react';
import { Newspaper, Calendar, ArrowUpRight } from 'lucide-react';

const newsItems = [
  {
    title: "DTE Rajasthan Polytechnic Admissions 2026 Announced",
    description: "Online registration opens for 1st Year Diploma and Lateral Entry 2nd Year courses on the centralized portal.",
    date: "November 2026",
    tag: "Admissions"
  },
  {
    title: "100% Tuition Fee Exemption for Female Students in Govt Colleges",
    description: "Zero tuition fee policy reaffirmed for all girls enrolling in government polytechnic and engineering colleges.",
    date: "Academic Year 2026-27",
    tag: "Scholarships"
  },
  {
    title: "Post-Matric Scholarship Applications Open on SJED Portal",
    description: "Complete fee reimbursement for SC, ST, OBC (BPL), and EWS students via the Rajasthan SSO scholarship portal.",
    date: "Active Now",
    tag: "Financial Aid"
  },
  {
    title: "Over 450 Diploma Engineers Recruited by Top Core Giants",
    description: "Tata Motors, L&T, Maruti Suzuki, and Havells visit GPC campuses with packages ranging up to ₹5.50 LPA.",
    date: "Recent",
    tag: "Placements"
  }
];

const News: React.FC = () => {
  return (
    <div className="py-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
          <Newspaper className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Latest News & Official Announcements</h3>
          <p className="text-sm text-gray-500">Official updates from the Department of Technical Education, Rajasthan</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {newsItems.map((item, index) => (
          <div
            key={index}
            className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-md">
                  {item.tag}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {item.date}
                </span>
              </div>
              <h4 className="text-base font-bold text-gray-900 mb-1.5">{item.title}</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-50 flex justify-end">
              <a
                href="https://hte.rajasthan.gov.in"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                Read on DTE Portal <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default News;
