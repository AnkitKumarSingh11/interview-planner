import { NextResponse } from 'next/server';
import { getPendingQuestions } from '@/db';
import { isAdminAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
    }
    const pendingQuestions = getPendingQuestions();
    return NextResponse.json(pendingQuestions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
