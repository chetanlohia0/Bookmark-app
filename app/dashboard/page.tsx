import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Navbar from '@/components/Navbar'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: bookmarks }, { data: collections }] = await Promise.all([
    supabase.from('bookmarks').select('*').order('created_at', { ascending: false }),
    supabase.from('collections').select('*').order('created_at', { ascending: true }),
  ])

  return (
    <div className="min-h-screen" style={{ background: '#0f1117' }}>
      <div className="mesh-bg" />
      <Navbar email={user.email!} />
      <DashboardClient
        userId={user.id}
        initialBookmarks={bookmarks ?? []}
        initialCollections={collections ?? []}
      />
    </div>
  )
}