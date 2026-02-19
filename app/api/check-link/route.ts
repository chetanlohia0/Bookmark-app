import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) return NextResponse.json({ status: 'unknown' })

  try {
    const res = await fetch(url, {
      method: 'HEAD',
      signal: AbortSignal.timeout(5000),
    })
    return NextResponse.json({
      status: res.ok || res.status === 405 ? 'ok' : 'dead'
    })
  } catch {
    return NextResponse.json({ status: 'dead' })
  }
}