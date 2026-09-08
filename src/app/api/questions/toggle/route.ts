import { NextResponse } from 'next/server';
import { toggleQuestionCompletion } from '@/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { questionId } = await request.json();
    if (!questionId) {
      return NextResponse.json({ error: 'Question ID is required' }, { status: 400 });
    }
    await toggleQuestionCompletion(questionId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
