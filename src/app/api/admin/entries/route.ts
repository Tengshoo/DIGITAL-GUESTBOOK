import { NextRequest, NextResponse } from 'next/server';
import { getAllEntries, updateEntryStatus, deleteEntry } from '@/lib/db';

export const dynamic = 'force-dynamic';

const ADMIN_PIN = process.env.ADMIN_PIN || '1234';

function verifyPin(request: NextRequest, bodyPin?: string): boolean {
  const headerPin = request.headers.get('x-admin-pin');
  const queryPin = request.nextUrl.searchParams.get('pin');
  const provided = bodyPin || headerPin || queryPin;
  return provided === ADMIN_PIN;
}

export async function GET(request: NextRequest) {
  if (!verifyPin(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Invalid PIN.' },
      { status: 401 }
    );
  }

  try {
    const entries = getAllEntries();
    return NextResponse.json({ success: true, entries });
  } catch (error) {
    console.error('Error fetching admin entries:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch entries' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, is_approved, pin } = body;

    if (!verifyPin(request, pin)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Invalid PIN.' },
        { status: 401 }
      );
    }

    if (typeof id !== 'number' && typeof id !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid entry ID' },
        { status: 400 }
      );
    }

    const numId = Number(id);
    const newStatus = is_approved ? 1 : 0;
    const updated = updateEntryStatus(numId, newStatus);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Entry #${numId} is now ${newStatus === 1 ? 'Approved' : 'Hidden'}`,
    });
  } catch (error) {
    console.error('Error updating entry status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update entry' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    let id: number | undefined;
    let pin: string | undefined;

    // Support both URL search param and JSON body
    const searchId = request.nextUrl.searchParams.get('id');
    if (searchId) {
      id = Number(searchId);
    } else {
      const body = await request.json().catch(() => ({}));
      id = body.id !== undefined ? Number(body.id) : undefined;
      pin = body.pin;
    }

    if (!verifyPin(request, pin)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Invalid PIN.' },
        { status: 401 }
      );
    }

    if (!id || isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid entry ID' },
        { status: 400 }
      );
    }

    const deleted = deleteEntry(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Entry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Entry #${id} was deleted successfully.`,
    });
  } catch (error) {
    console.error('Error deleting entry:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete entry' },
      { status: 500 }
    );
  }
}
