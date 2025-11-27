import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization');
    const { id } = params;

    console.log(`API Proxy - GET workout ${id}`);
    console.log('API Proxy - Token:', token ? 'Present' : 'Missing');

    const response = await fetch(`${BACKEND_URL}/api/workouts/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: token }),
      },
    });

    console.log(`API Proxy - Backend response status for GET workout ${id}:`, response.status);

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('API Proxy - Error fetching workout:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workout', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization');
    const { id } = params;

    console.log(`API Proxy - DELETE workout ${id}`);
    console.log('API Proxy - Token:', token ? 'Present' : 'Missing');

    const response = await fetch(`${BACKEND_URL}/api/workouts/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: token }),
      },
    });

    console.log(`API Proxy - Backend response status for DELETE workout ${id}:`, response.status);

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('API Proxy - Error deleting workout:', error);
    return NextResponse.json(
      { error: 'Failed to delete workout', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization');
    const { id } = params;
    const body = await request.json();

    console.log(`API Proxy - PATCH workout ${id}`);
    console.log('API Proxy - Token:', token ? 'Present' : 'Missing');
    console.log('API Proxy - Body:', JSON.stringify(body, null, 2));

    const response = await fetch(`${BACKEND_URL}/api/workouts/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: token }),
      },
      body: JSON.stringify(body),
    });

    console.log(`API Proxy - Backend response status for PATCH workout ${id}:`, response.status);

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('API Proxy - Error updating workout:', error);
    return NextResponse.json(
      { error: 'Failed to update workout', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
