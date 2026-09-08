import { NextResponse } from 'next/server';
import { updateQuestionNotes } from '@/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { questionId, notes } = await request.json();
    if (!questionId) {
      return NextResponse.json({ error: 'Question ID is required' }, { status: 400 });
    }
    updateQuestionNotes(questionId, notes || '');
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
