import { NextResponse } from 'next/server';
import { updateTrackTimelineSettings } from '@/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { trackId, roadmapStartDate, targetDays, sections } = await request.json();
    if (!trackId || !sections) {
      return NextResponse.json({ error: 'Track ID and sections are required' }, { status: 400 });
    }
    updateTrackTimelineSettings(trackId, roadmapStartDate, targetDays, sections);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
