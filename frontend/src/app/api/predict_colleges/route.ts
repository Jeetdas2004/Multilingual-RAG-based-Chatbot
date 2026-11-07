import { NextResponse } from 'next/server';
import { predictColleges } from '@/lib/ragEngine';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const score = parseFloat(body.score);
    const category = body.category || 'General';

    if (isNaN(score) || score <= 0) {
      return NextResponse.json({ error: 'Valid score is required' }, { status: 400 });
    }

    const result = predictColleges(score, category);
    return NextResponse.json(result, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to predict colleges' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
