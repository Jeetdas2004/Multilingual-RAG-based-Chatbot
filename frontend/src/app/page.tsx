import Image from "next/image";
import Navbar from "../components/Navbar";
import { Calculator, Newspaper, Bot, MessageSquare } from "lucide-react";
import CollegeList from "@/components/CollegeList"; 
import CollegePredictor from "@/components/CollegePredictor";
import News from "@/components/News";
import PragyaFloatingWidget from "@/components/PragyaFloatingWidget";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <Navbar />
        
        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 lg:py-24 bg-gradient-to-b from-blue-50/70 via-indigo-50/30 to-transparent">
          <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:px-12 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-900 text-xs font-semibold mb-6 shadow-sm">
              <span>🏛️ Department of Technical Education, Government of Rajasthan</span>
            </div>
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-tight text-gray-900 md:text-5xl lg:text-6xl">
              Pragya (प्रज्ञा) — AI Assistant & Student Portal
            </h1>
            <p className="mb-8 text-lg font-normal text-gray-600 lg:text-xl sm:px-16 xl:px-48 leading-relaxed">
              Real-time multilingual guidance for 14+ Government Polytechnic Colleges across Rajasthan. Calculate your admission eligibility, explore fee waivers, scholarships, and chat with our RAG-powered AI assistant.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <a
                href="#predictor-section"
                className="w-full sm:w-auto inline-flex justify-center items-center py-3.5 px-6 text-base font-semibold text-white rounded-xl bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition"
              >
                Predict Your College
              </a>
              <a
                href="/assistant"
                className="w-full sm:w-auto inline-flex justify-center items-center gap-2 py-3.5 px-6 text-base font-semibold text-blue-700 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 shadow-sm transition"
              >
                <Bot className="w-5 h-5" /> Open Pragya Assistant
              </a>
              <a
                href="#news-section"
                className="w-full sm:w-auto inline-flex justify-center items-center py-3.5 px-6 text-base font-semibold text-gray-800 rounded-xl bg-white hover:bg-gray-100 border border-gray-200 shadow-sm transition"
              >
                Latest Announcements
              </a>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-12 px-4 mx-auto max-w-screen-xl lg:px-12">
          <div className="text-center mb-10">
            <h2 className="font-extrabold text-3xl text-gray-900">Features Built For Rajasthan Students</h2>
            <p className="text-gray-500 mt-2">Tools designed to streamline your technical education journey</p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-md transition">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-fit mb-4">
                <Bot className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Multilingual RAG Chatbot</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Answers all admission, fee structure, hostel, cutoff, and 100% girls tuition fee waiver queries in Hindi, English, and regional languages.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-md transition">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl w-fit mb-4">
                <Calculator className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">College Predictor</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Enter your 10th or 12th score to calculate admission probability with official OBC, SC, ST, and EWS category relaxation rules.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-md transition">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl w-fit mb-4">
                <Newspaper className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Live DTE Announcements</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Stay updated with timely circulars, admission deadlines, post-matric scholarship programs, and campus placement drives.
              </p>
            </div>
          </div>
        </section>

        {/* College Predictor & College List Section */}
        <section id="predictor-section" className="py-12 bg-white px-4 mx-auto max-w-screen-xl lg:px-12 rounded-3xl my-8 border border-gray-100 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <CollegePredictor />
            <CollegeList />
          </div>
        </section>

        {/* News Section */}
        <section id="news-section" className="py-12 px-4 mx-auto max-w-screen-xl lg:px-12">
          <News />
        </section>
      </div>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-gray-400 text-center text-sm mt-12">
        <div className="max-w-screen-xl mx-auto px-4">
          <p>© 2026 Department of Technical Education (DTE), Government of Rajasthan. All Rights Reserved.</p>
          <p className="mt-1 text-xs text-gray-500">Pragya AI Assistant • Powered by RAG & Multilingual Intelligence</p>
        </div>
      </footer>

      {/* Floating Chatbot Assistant */}
      <PragyaFloatingWidget />
    </div>
  );
};

export default Home;
