'use client'
import { createClient } from '@/lib/supabaseClient'

export default function LoginPage() {
  const supabase = createClient()

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-2xl shadow-md text-center space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Smart Bookmark</h1>
        <p className="text-gray-500">Save and manage your bookmarks privately</p>
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  )
}