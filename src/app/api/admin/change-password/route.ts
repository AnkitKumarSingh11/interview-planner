import { NextResponse } from 'next/server';
import { verifyAdminCredentials, updateAdminPassword } from '@/db';
import { isAdminAuthenticated } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized admin access' }, { status: 401 });
    }

    const { username, currentPassword, newPassword } = await request.json();

    if (!username || !currentPassword || !newPassword) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const isValid = await verifyAdminCredentials(username, currentPassword);
    if (!isValid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
    }

    const updated = await updateAdminPassword(username, newPassword);
    if (updated) {
      return NextResponse.json({ success: true, message: 'Password updated successfully!' });
    } else {
      return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
