import { NextResponse } from 'next/server';
import { COLLEGES_META } from '@/lib/ragEngine';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'Pragya — Multilingual RAG Chatbot API (Vercel Production)',
    engine: 'Next.js Serverless + Hybrid Native RAG / Gemini Flash',
    knowledge_base: 'Department of Technical Education, Government of Rajasthan',
    colleges_loaded: COLLEGES_META.length
  });
}
