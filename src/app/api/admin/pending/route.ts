import { NextResponse } from 'next/server';
import { getPendingQuestions } from '@/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const pendingQuestions = getPendingQuestions();
    return NextResponse.json(pendingQuestions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
