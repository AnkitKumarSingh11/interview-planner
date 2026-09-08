import { NextResponse } from 'next/server';
import { submitQuestionForApproval } from '@/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sectionId, subsectionTitle, title, difficulty, url, notes } = body;

    if (!sectionId || !title) {
      return NextResponse.json({ error: 'Section and question title are required' }, { status: 400 });
    }

    const questionId = submitQuestionForApproval({
      sectionId,
      subsectionTitle: subsectionTitle || 'General Questions',
      title,
      difficulty: difficulty || 'Medium',
      url,
      notes,
    });

    return NextResponse.json({
      message: 'Question submitted successfully for admin approval!',
      questionId,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
