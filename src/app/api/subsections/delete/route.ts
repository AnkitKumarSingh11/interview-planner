import { NextResponse } from 'next/server';
import { deleteSubsectionFromSection } from '@/db';
import { isAdminAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
    }

    const { subsectionId } = await request.json();
    if (!subsectionId) {
      return NextResponse.json({ error: 'Sub-section ID is required' }, { status: 400 });
    }

    deleteSubsectionFromSection(subsectionId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
