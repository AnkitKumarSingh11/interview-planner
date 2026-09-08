import { NextResponse } from 'next/server';
import { submitQuestionForApproval } from '@/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { trackId, sectionId, newTopicName, subsectionTitle, title, difficulty, url, notes } = body;

    if ((!sectionId && (!trackId || !newTopicName)) || !title) {
      return NextResponse.json(
        { error: 'Section or new topic name and question title are required' },
        { status: 400 }
      );
    }

    const questionId = submitQuestionForApproval({
      trackId,
      sectionId,
      newTopicName,
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
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
