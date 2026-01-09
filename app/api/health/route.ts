import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'audit-trail-microservice',
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 3003,
    version: '1.0.0'
  }, { status: 200 });
}
