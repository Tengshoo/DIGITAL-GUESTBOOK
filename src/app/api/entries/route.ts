import { NextRequest, NextResponse } from 'next/server';
import { getApprovedEntries, createEntry } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const entries = getApprovedEntries();
    return NextResponse.json({ success: true, entries });
  } catch (error) {
    console.error('Error fetching entries:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch guestbook entries' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, message, photo_url, signature_svg, audio_url } = body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Please enter your name.' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        { success: false, error: 'Please enter your message or well-wishes.' },
        { status: 400 }
      );
    }

    if (name.trim().length > 100) {
      return NextResponse.json(
        { success: false, error: 'Name is too long (max 100 characters).' },
        { status: 400 }
      );
    }

    if (message.trim().length > 2000) {
      return NextResponse.json(
        { success: false, error: 'Message is too long (max 2000 characters).' },
        { status: 400 }
      );
    }

    const newEntry = createEntry({
      name: name.trim(),
      message: message.trim(),
      photo_url: photo_url || null,
      signature_svg: signature_svg || null,
      audio_url: audio_url || null,
      is_approved: 1, // Auto-approved for live celebration experience
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you! Your note has been added to the guestbook.',
        entry: newEntry,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating entry:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save guestbook entry' },
      { status: 500 }
    );
  }
}
