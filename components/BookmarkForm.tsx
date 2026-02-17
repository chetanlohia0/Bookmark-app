'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabaseClient'

export default function BookmarkForm({ userId }: { userId: string }) {
  const supabase = createClient()
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!title.trim() || !url.trim()) {
      setError('Both fields are required')
      return
    }

    let finalUrl = url.trim()
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = 'https://' + finalUrl
    }

    try {
      new URL(finalUrl)
    } catch {
      setError('Please enter a valid URL')
      return
    }

    setLoading(true)
    const { error } = await supabase.from('bookmarks').insert({
      user_id: userId,
      title: title.trim(),
      url: finalUrl,
    })

    if (error) setError(error.message)
    else {
      setTitle('')
      setUrl('')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
      <h2 className="text-lg font-semibold text-gray-700">Add Bookmark</h2>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        maxLength={100}
        className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <input
        type="text"
        placeholder="URL (e.g. github.com)"
        value={url}
        onChange={e => setUrl(e.target.value)}
        className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? 'Adding...' : 'Add Bookmark'}
      </button>
    </form>
  )
}