import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  return NextResponse.json({ code: 0, data: { name: 'abc' } })
}
