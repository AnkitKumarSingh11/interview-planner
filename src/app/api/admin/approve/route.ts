import { NextResponse } from 'next/server';
import { approveQuestion, rejectQuestion } from '@/db';
import { isAdminAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
    }

    const { questionId, action } = await request.json();
    if (!questionId || !action) {
      return NextResponse.json({ error: 'Question ID and action are required' }, { status: 400 });
    }

    if (action === 'approve') {
      await approveQuestion(questionId);
    } else if (action === 'reject') {
      await rejectQuestion(questionId);
    }

    return NextResponse.json({ success: true, action });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
