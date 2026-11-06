'use client';

import React, { useState } from 'react';
import { Calculator, Award, CheckCircle2, AlertCircle } from 'lucide-react';

interface College {
  name: string;
  minScore: number;
  value: string;
  city: string;
}

const collegesList: College[] = [
  { name: "Government Polytechnic College, Jaipur", minScore: 86, value: "gpcjaipur", city: "Jaipur" },
  { name: "Government Polytechnic College, Ajmer", minScore: 82, value: "gpcajmer", city: "Ajmer" },
  { name: "Government Polytechnic College, Jodhpur", minScore: 81, value: "gpcjodhpur", city: "Jodhpur" },
  { name: "Government Polytechnic College, Kota", minScore: 80, value: "gpckota", city: "Kota" },
  { name: "Government Polytechnic College, Bikaner", minScore: 79, value: "gpcbikaner", city: "Bikaner" },
  { name: "Government Polytechnic College, Alwar", minScore: 78, value: "gpcalwar", city: "Alwar" },
  { name: "Government Polytechnic College, Bundi", minScore: 75, value: "gpcbundi", city: "Bundi" },
  { name: "Government Polytechnic College, Baran", minScore: 74, value: "gpcbaran", city: "Baran" },
  { name: "Government Polytechnic College, Bhilwara", minScore: 74, value: "gpcbhilwara", city: "Bhilwara" },
  { name: "Government Polytechnic College, Banswara", minScore: 73, value: "gpcbanswara", city: "Banswara" },
  { name: "Government Polytechnic College, Chittorgarh", minScore: 72, value: "gpcchittorgarh", city: "Chittorgarh" },
  { name: "Government Polytechnic College, Bharatpur", minScore: 72, value: "gpcbharatpur", city: "Bharatpur" },
  { name: "Government Polytechnic College, Barmer", minScore: 70, value: "gpcbarmer", city: "Barmer" }
];

const CollegePredictor: React.FC = () => {
  const [score, setScore] = useState<string>('');
  const [category, setCategory] = useState<string>('General');
  const [predicted, setPredicted] = useState<Array<College & { chance: string; eligible: boolean }>>([]);

  const handlePredict = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(score);
    if (isNaN(val) || val <= 0) return;

    let relaxation = 0;
    if (category === 'OBC') relaxation = 3;
    if (category === 'SC' || category === 'ST') relaxation = 8;
    if (category === 'EWS') relaxation = 2;

    const adjusted = val + relaxation;

    const results = collegesList.map(c => {
      let chance = "Low";
      if (adjusted >= c.minScore + 3) chance = "High Chance";
      else if (adjusted >= c.minScore - 3) chance = "Moderate Chance";
      else if (adjusted >= c.minScore - 6) chance = "Competitive";

      return {
        ...c,
        chance,
        eligible: adjusted >= (c.minScore - 3)
      };
    })
    .sort((a, b) => (b.eligible ? 1 : 0) - (a.eligible ? 1 : 0))
    .slice(0, 5);

    setPredicted(results);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
          <Calculator className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">College Predictor</h3>
          <p className="text-sm text-gray-500">Calculate eligibility for Rajasthan Polytechnic institutes</p>
        </div>
      </div>

      <form onSubmit={handlePredict} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Exam Percentage / Percentile (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            placeholder="e.g. 84.5"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
            Category Reservation
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium bg-white"
          >
            <option value="General">General / Open</option>
            <option value="OBC">OBC (Non-Creamy Layer)</option>
            <option value="SC">SC (Scheduled Caste)</option>
            <option value="ST">ST (Scheduled Tribe)</option>
            <option value="EWS">EWS (Economically Weaker Section)</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition shadow-sm"
        >
          Check Eligible Colleges
        </button>
      </form>

      {predicted.length > 0 && (
        <div className="mt-6 pt-5 border-t border-gray-100">
          <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">
            Top Recommendations:
          </h4>
          <div className="space-y-2.5">
            {predicted.map((item, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border flex items-center justify-between ${
                  item.eligible ? 'bg-green-50/50 border-green-200' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div>
                  <h5 className="text-sm font-bold text-gray-900">{item.name}</h5>
                  <span className="text-xs text-gray-500">{item.city} • Cutoff ~{item.minScore}%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {item.eligible ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-md">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> {item.chance}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md">
                      <AlertCircle className="w-3.5 h-3.5 text-gray-500" /> Competitive
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CollegePredictor;
