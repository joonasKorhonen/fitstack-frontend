import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization');

    const response = await fetch(`${BACKEND_URL}/api/workouts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: token }),
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch workouts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization');
    const body = await request.json();

    console.log('API Proxy - Received token:', token ? 'Present' : 'Missing');
    console.log('API Proxy - Request body:', JSON.stringify(body, null, 2));
    console.log('API Proxy - Backend URL:', `${BACKEND_URL}/api/workouts`);

    const response = await fetch(`${BACKEND_URL}/api/workouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: token }),
      },
      body: JSON.stringify(body),
    });

    console.log('API Proxy - Backend response status:', response.status);

    const data = await response.json();
    console.log('API Proxy - Backend response data:', JSON.stringify(data, null, 2));

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('API Proxy - Error:', error);
    return NextResponse.json(
      { error: 'Failed to create workout', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
