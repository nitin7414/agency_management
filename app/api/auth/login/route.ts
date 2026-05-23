import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session'; 

export async function POST(request: Request) {
  try {
    const { pin } = await request.json();
    
    // Grabs the PIN from your .env file, or defaults to 123456 if it can't find it
    const correctPin = process.env.APP_SECURITY_PIN;

    if (pin === correctPin) {
      // Create a valid session
      const session = await getSession();
      session.isLoggedIn = true;
      await session.save();
      
      return NextResponse.json({ success: true });
    }

    // If the PIN doesn't match
    return NextResponse.json(
      { success: false, message: 'Invalid PIN' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}