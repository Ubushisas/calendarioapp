import { NextResponse } from 'next/server';
import { initializeAppointmentsSheet, initializeMessagesSheet } from '../../../../lib/google-sheets.js';

export async function POST() {
  try {
    await initializeAppointmentsSheet();
    await initializeMessagesSheet();

    return NextResponse.json({
      success: true,
      message: 'Google Sheets initialized with headers',
    });
  } catch (error) {
    console.error('Error initializing sheets:', error);
    return NextResponse.json(
      { error: 'Failed to initialize sheets', details: error.message },
      { status: 500 }
    );
  }
}
