'use client'
import { createClient } from '@/lib/supabaseClient'

export default function LoginPage() {
  const supabase = createClient()
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0d0d0f',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'Outfit, sans-serif',
    }}>
      {/* Top bar */}
      <header style={{
        padding: '20px 32px', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: 'linear-gradient(135deg, rgba(232,113,74,0.25), rgba(232,113,74,0.06))',
            border: '1px solid rgba(232,113,74,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15,
          }}>🔖</div>
          <span style={{ fontFamily: 'Fraunces, serif', fontSize: '1rem', color: '#f0ece6' }}>
            Smart Bookmark
          </span>
        </div>
        <button onClick={handleLogin} className="btn-ghost" style={{ fontSize: '0.8rem' }}>
          Sign in →
        </button>
      </header>

      {/* Hero */}
      <main style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '60px 32px',
      }}>
        <div style={{ maxWidth: 640, width: '100%' }}>

          {/* Badge */}
          <div className="fade-up d1" style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '5px 12px', borderRadius: 999,
            background: 'rgba(232,113,74,0.08)',
            border: '1px solid rgba(232,113,74,0.2)',
            marginBottom: 28,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#e8714a', display: 'inline-block' }} />
            <span style={{ fontSize: '0.72rem', color: '#e8714a', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Personal bookmark manager
            </span>
          </div>

          {/* Headline */}
          <h1 className="fade-up d2 font-display" style={{
            fontSize: 'clamp(2.8rem, 6vw, 4.5rem)',
            fontWeight: 300, lineHeight: 1.1,
            color: '#f0ece6', letterSpacing: '-0.03em',
            marginBottom: 20,
          }}>
            Save what matters.<br />
            <span style={{
              background: 'linear-gradient(135deg, #e8714a, #f5a882)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Find it instantly.
            </span>
          </h1>

          {/* Subtext */}
          <p className="fade-up d3" style={{
            fontSize: '1rem', color: '#6b7280', lineHeight: 1.7,
            maxWidth: 480, marginBottom: 40,
          }}>
            A private, real-time bookmark manager with collections, notes,
            and smart search. Everything in one place, always in sync.
          </p>

          {/* CTA row */}
          <div className="fade-up d4" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 52 }}>
            <button onClick={handleLogin} className="btn-primary"
              style={{ padding: '12px 28px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 10, borderRadius: 11 }}>
              <svg width="17" height="17" viewBox="0 0 24 24">
                <path fill="white" opacity="0.9" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="white" opacity="0.9" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="white" opacity="0.9" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="white" opacity="0.9" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
            <span style={{ fontSize: '0.78rem', color: '#374151' }}>Free · No credit card needed</span>
          </div>

          {/* Feature grid */}
          <div className="fade-up d4" style={{
            display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10,
            paddingTop: 40, borderTop: '1px solid rgba(255,255,255,0.06)',
          }}>
            {[
              { icon: '🔒', title: 'Fully Private', desc: 'Your bookmarks are only visible to you, enforced at database level.' },
              { icon: '⚡', title: 'Real-time Sync', desc: 'Changes appear instantly across all your open tabs.' },
              { icon: '📁', title: 'Collections', desc: 'Organize bookmarks into folders that make sense to you.' },
              { icon: '🔍', title: 'Smart Search', desc: 'Find anything instantly by title, domain, or collection.' },
            ].map(f => (
              <div key={f.title} style={{
                padding: '16px', borderRadius: 12,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: '1rem' }}>{f.icon}</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 500, color: '#f0ece6' }}>{f.title}</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        padding: '16px 32px', borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', justifyContent: 'center',
      }}>
        <span style={{ fontSize: '0.72rem', color: '#374151' }}>
          Built with Next.js · Supabase · Deployed on Vercel
        </span>
      </footer>
    </div>
  )
}