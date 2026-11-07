import { NextResponse } from 'next/server';
import { askGeminiOrFallback } from '@/lib/ragEngine';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const query = (body.query || '').trim();
    const college_name = (body.college_name || 'gpcajmer').trim();
    const lang = (body.lang || 'English').trim();

    if (!query) {
      return NextResponse.json(
        { error: 'Query cannot be empty.' },
        { status: 400 }
      );
    }

    const answer = await askGeminiOrFallback(query, college_name, lang);

    return NextResponse.json({
      answer,
      college_name,
      lang,
      status: 'success'
    });
  } catch (err: any) {
    console.error('API /ask_query error:', err);
    return NextResponse.json({
      answer: 'We encountered an issue retrieving detailed data. For direct assistance, please contact the DTE Rajasthan Student Helpline at **1800-180-6127** or visit [hte.rajasthan.gov.in](https://hte.rajasthan.gov.in).',
      college_name: 'gpcajmer',
      lang: 'English',
      status: 'partial'
    });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
