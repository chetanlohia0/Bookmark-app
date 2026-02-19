import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  const { bookmarks, query } = body

  if (!bookmarks || !Array.isArray(bookmarks)) {
    return NextResponse.json({ results: [] })
  }

  const bookmarkList = bookmarks.map((b: { title: string; url: string; notes: string }, i: number) =>
    `${i + 1}. Title: "${b.title}" | URL: ${b.url} | Notes: "${b.notes || 'none'}"`
  ).join('\n')

  const prompt = `You are a bookmark search assistant. The user has these saved bookmarks:
${bookmarkList}

User is looking for: "${query}"

Return ONLY a JSON array of matching bookmark numbers. Example: [{"index": 1, "reason": "This matches because..."}]
If nothing matches return []. No markdown, no explanation, just the JSON array.`

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      }
    )
    const data = await res.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '[]'
    const clean = text.replace(/```json|```/g, '').trim()
    return NextResponse.json({ results: JSON.parse(clean) })
  } catch (e) {
    console.error('Gemini error:', e)
    return NextResponse.json({ results: [] })
  }
}