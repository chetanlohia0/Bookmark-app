'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabaseClient'

type Bookmark = {
  id: string
  title: string
  url: string
  created_at: string
}

export default function BookmarkCard({ bookmark }: { bookmark: Bookmark }) {
  const supabase = createClient()
  const [copied, setCopied] = useState(false)

  const domain = new URL(bookmark.url).hostname

  const handleCopy = () => {
    navigator.clipboard.writeText(bookmark.url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDelete = async () => {
    await supabase.from('bookmarks').delete().eq('id', bookmark.id)
  }

  return (
    <div className="bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md transition space-y-3">
      <div className="flex items-center gap-2">
        <img
          src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
          alt="favicon"
          className="w-5 h-5"
        />
        <h3 className="font-semibold text-gray-800 truncate">{bookmark.title}</h3>
      </div>
      <a 
        href={bookmark.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 text-sm truncate block hover:underline"
      >
        {bookmark.url}
      </a>
      <p className="text-xs text-gray-400">
        {new Date(bookmark.created_at).toLocaleDateString()}
      </p>
      <div className="flex gap-2">
        <button
          onClick={handleCopy}
          className="flex-1 text-sm border rounded-lg py-1.5 hover:bg-gray-50 transition"
        >
          {copied ? '✅ Copied!' : '📋 Copy'}
        </button>
        <button
          onClick={handleDelete}
          className="flex-1 text-sm bg-red-50 text-red-500 border border-red-200 rounded-lg py-1.5 hover:bg-red-100 transition"
        >
          🗑 Delete
        </button>
      </div>
    </div>
  )
}