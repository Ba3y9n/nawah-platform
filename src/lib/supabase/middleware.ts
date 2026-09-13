import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zpnafbfgmnpsctliqbab.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_jh91DJ1-nrdHpsQwuwT5xg_vgBDkHZd'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // Remove hard redirects for protected routes to allow guest exploration
  // We will handle auth checks on the client side with a graceful Auth Modal
  const isAuthRoute = path === '/login' || path === '/register'

  if (user && isAuthRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/pit-management/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
