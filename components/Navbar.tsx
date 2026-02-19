'use client'
import { createClient } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function Navbar({ email }: { email: string }) {
  const supabase = createClient()
  const router = useRouter()
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <div className="navbar-icon">🔖</div>
        <span className="navbar-title">Smart Bookmark</span>
      </div>
      <div className="navbar-right">
        <div className="navbar-user hidden sm:flex">
          <div className="navbar-avatar">{email.charAt(0).toUpperCase()}</div>
          <span className="navbar-email">{email}</span>
        </div>
        <button onClick={handleLogout} className="btn-ghost">Sign out</button>
      </div>
    </nav>
  )
}