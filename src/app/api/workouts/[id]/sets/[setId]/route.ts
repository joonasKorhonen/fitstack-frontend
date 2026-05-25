import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; setId: string }> }
) {
  try {
    const token = request.headers.get('authorization');
    const { id, setId } = await params;
    const body = await request.json();

    const response = await fetch(`${BACKEND_URL}/api/workouts/${id}/sets/${setId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: token }),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update set', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; setId: string }> }
) {
  try {
    const token = request.headers.get('authorization');
    const { id, setId } = await params;

    console.log(`API Proxy - DELETE workout ${id} set ${setId}`);
    console.log('API Proxy - Token:', token ? 'Present' : 'Missing');

    const response = await fetch(`${BACKEND_URL}/api/workouts/${id}/sets/${setId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: token }),
      },
    });

    console.log(`API Proxy - Backend response status for DELETE set ${setId}:`, response.status);

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('API Proxy - Error deleting set:', error);
    return NextResponse.json(
      { error: 'Failed to delete set', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
