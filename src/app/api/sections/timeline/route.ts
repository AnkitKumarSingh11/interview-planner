import { NextResponse } from 'next/server';
import { updateSectionDates } from '@/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { sectionId, startDate, endDate } = await request.json();
    if (!sectionId) {
      return NextResponse.json({ error: 'Section ID is required' }, { status: 400 });
    }
    updateSectionDates(sectionId, startDate, endDate);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
