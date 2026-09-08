import { NextResponse } from 'next/server';
import { addSectionToTrack } from '@/db';
import { isAdminAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
    }

    const { trackId, topic, sectionTitle, startDate, endDate, initialSubsections } = await request.json();
    if (!trackId || !topic) {
      return NextResponse.json({ error: 'Track ID and Topic are required' }, { status: 400 });
    }

    const sectionId = await addSectionToTrack(trackId, {
      topic,
      sectionTitle,
      startDate: startDate || 'TBD',
      endDate: endDate || 'TBD',
      initialSubsections,
    });

    return NextResponse.json({ success: true, sectionId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
