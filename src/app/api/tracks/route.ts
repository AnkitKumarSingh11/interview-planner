import { NextResponse } from 'next/server';
import { getAllTracks, createNewTrack } from '@/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const tracks = await getAllTracks();
    return NextResponse.json(tracks);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description } = body;
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    const trackId = await createNewTrack(title, description || '');
    const tracks = await getAllTracks();
    return NextResponse.json({ trackId, tracks });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
