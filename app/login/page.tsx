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
      minHeight: '100vh', display: 'flex',
      fontFamily: 'DM Sans, sans-serif',
      background: '#faf7f2',
    }}>
      {/* Left — text side */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '72px 72px',
        borderRight: '1px solid rgba(139,90,60,0.15)',
      }}>
        {/* Logo */}
        <div className="fade-up d1" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 64 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 9,
            background: 'rgba(196,98,45,0.1)', border: '1px solid rgba(196,98,45,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
          }}>🔖</div>
          <span style={{ fontFamily: 'Lora, serif', fontSize: '1.2rem', fontWeight: 500, color: '#2c1810' }}>
            Smart Bookmark
          </span>
        </div>

        {/* Headline */}
        <div className="fade-up d2" style={{ marginBottom: 20 }}>
          <h1 style={{
            fontFamily: 'Lora, serif', fontWeight: 500,
            fontSize: 'clamp(2.8rem, 4.5vw, 4rem)',
            color: '#2c1810', lineHeight: 1.15, letterSpacing: '-0.02em',
            marginBottom: 16,
          }}>
            Your bookmarks,<br />
            <span style={{ color: '#c4622d' }}>beautifully kept.</span>
          </h1>
<p style={{ fontSize: '1.05rem', color: '#9c7b6b', lineHeight: 1.7, maxWidth: 420 }}>
                A private space to save, organize and rediscover the pages that matter — with AI-powered search to find anything instantly.
          </p>
        </div>

        {/* Features list */}
        <div className="fade-up d3" style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 48 }}>
          {[
            ['🔒', 'Private by default — only you can see your bookmarks'],
            ['📁', 'Collections to organize everything neatly'],
            ['✨', 'Ask your bookmarks using natural language AI search'],
            ['⚡', 'Real-time sync across all your tabs'],
          ].map(([icon, text]) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: '0.9rem', flexShrink: 0 }}>{icon}</span>
              <span style={{ fontSize: '0.92rem', color: '#5a3825' }}>{text}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="fade-up d4">
          <button onClick={handleLogin}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '15px 36px', borderRadius: 10,
              background: '#c4622d', color: '#fff',
              border: 'none', cursor: 'pointer',
              fontSize: '1rem', fontWeight: 500,
              fontFamily: 'DM Sans, sans-serif',
              transition: 'all 0.18s',
              boxShadow: '0 2px 12px rgba(196,98,45,0.25)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#d4784a'
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(196,98,45,0.35)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#c4622d'
              e.currentTarget.style.boxShadow = '0 2px 12px rgba(196,98,45,0.25)'
            }}>
            <svg width="17" height="17" viewBox="0 0 24 24">
              <path fill="white" opacity="0.9" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="white" opacity="0.9" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="white" opacity="0.9" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="white" opacity="0.9" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
          <p style={{ marginTop: 12, fontSize: '0.72rem', color: '#c4a99a' }}>
            Free · No password needed · Your data stays yours
          </p>
        </div>
      </div>

      {/* Right — mockup side */}
      <div style={{
        flex: 1, background: '#f5f0e8',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '60px 48px',
      }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          {/* Fake browser chrome */}
          <div style={{
            background: '#ede8df', borderRadius: '14px 14px 0 0',
            padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 6,
            borderBottom: '1px solid rgba(139,90,60,0.15)',
          }}>
            {['#e08a7a', '#e8c47a', '#8abf8a'].map(c => (
              <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
            ))}
            <div style={{
              flex: 1, marginLeft: 8, background: '#faf7f2',
              borderRadius: 5, padding: '3px 10px',
              fontSize: '0.68rem', color: '#c4a99a',
              border: '1px solid rgba(139,90,60,0.12)',
            }}>
              smartbookmark.app/dashboard
            </div>
          </div>

          {/* Fake dashboard */}
          <div style={{
            background: '#faf7f2', borderRadius: '0 0 14px 14px',
            border: '1px solid rgba(139,90,60,0.15)',
            borderTop: 'none', padding: 16,
            boxShadow: '0 16px 48px rgba(139,90,60,0.12)',
          }}>
            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 12 }}>
              {[['24', 'Saved'], ['6', 'This week'], ['48', 'Clicks']].map(([v, l]) => (
                <div key={l} style={{
                  background: '#f5f0e8', borderRadius: 9,
                  padding: '10px 12px', border: '1px solid rgba(139,90,60,0.12)',
                }}>
                  <div style={{ fontFamily: 'Lora, serif', fontSize: '1.2rem', color: '#2c1810' }}>{v}</div>
                  <div style={{ fontSize: '0.6rem', color: '#c4a99a', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{l}</div>
                </div>
              ))}
            </div>

            {/* Fake cards */}
            {[
              { title: 'GitHub — Build software', domain: 'github.com', emoji: '🐙' },
              { title: 'Linear — Issue Tracking', domain: 'linear.app', emoji: '📋' },
              { title: 'Figma — Design Tool', domain: 'figma.com', emoji: '🎨' },
            ].map((card, i) => (
              <div key={i} style={{
                background: '#f5f0e8', borderRadius: 10, padding: '10px 12px',
                marginBottom: 8, border: '1px solid rgba(139,90,60,0.12)',
                borderLeft: '3px solid #c4622d', display: 'flex',
                alignItems: 'center', gap: 10,
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                  background: '#ede8df', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: 16,
                }}>
                  {card.emoji}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 500, color: '#2c1810', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {card.title}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#c4a99a' }}>{card.domain}</div>
                </div>
              </div>
            ))}

            {/* Fake ask bar */}
            <div style={{
              marginTop: 10, padding: '8px 12px', borderRadius: 9,
              background: '#f5f0e8', border: '1px solid rgba(196,98,45,0.2)',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ fontSize: '0.8rem' }}>✨</span>
              <span style={{ fontSize: '0.72rem', color: '#c4a99a' }}>Ask your bookmarks...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}