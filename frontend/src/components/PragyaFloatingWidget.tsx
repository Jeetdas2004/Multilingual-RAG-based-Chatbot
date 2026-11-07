'use client';

import React, { useState } from 'react';
import { MessageSquare, X, Maximize2, Minimize2, ExternalLink } from 'lucide-react';

export default function PragyaFloatingWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3.5 bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-full shadow-2xl hover:shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-white/20"
          aria-label="Open Pragya AI Assistant"
        >
          <div className="relative">
            <MessageSquare className="w-6 h-6 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white" />
          </div>
          <span className="font-semibold text-sm tracking-wide">Ask Pragya AI</span>
        </button>
      )}

      {/* Floating Widget Modal */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 ease-in-out shadow-2xl rounded-2xl overflow-hidden border border-slate-200 bg-white flex flex-col ${
            isExpanded
              ? 'inset-4 md:inset-8 w-auto h-auto'
              : 'bottom-4 right-4 md:bottom-6 md:right-6 w-[95vw] sm:w-[420px] h-[640px] max-h-[90vh]'
          }`}
        >
          {/* Top Bar Controls */}
          <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-indigo-900 text-white px-4 py-2.5 flex items-center justify-between text-xs select-none">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="font-semibold text-white">Pragya AI • Assistant Live</span>
            </div>
            <div className="flex items-center gap-1.5">
              <a
                href="/assistant"
                target="_blank"
                rel="noreferrer"
                title="Open in Full Page"
                className="p-1 hover:bg-white/20 rounded text-white/90 hover:text-white transition"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Minimize' : 'Expand'}
                className="p-1 hover:bg-white/20 rounded text-white/90 hover:text-white transition hidden sm:inline-flex"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close Widget"
                className="p-1 hover:bg-white/20 rounded text-white/90 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Assistant Iframe */}
          <iframe
            src="/assistant/index.html"
            title="Pragya AI Assistant"
            className="w-full h-full border-none flex-1 bg-slate-50"
          />
        </div>
      )}
    </>
  );
}
