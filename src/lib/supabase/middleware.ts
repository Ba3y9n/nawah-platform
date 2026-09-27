import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zpnafbfgmnpsctliqbab.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_jh91DJ1-nrdHpsQwuwT5xg_vgBDkHZd'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const path = request.nextUrl.pathname
  const isAuthRoute = path === '/login' || path === '/register'

  try {
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

    // Check if user has auth cookies or is on login/register route
    const allCookies = request.cookies.getAll()
    const hasAuthCookie = allCookies.some(c => c.name.includes('auth-token') || c.name.startsWith('sb-'))

    if (isAuthRoute || hasAuthCookie) {
      // Race getUser with a 800ms timeout to prevent 504 MIDDLEWARE_INVOCATION_TIMEOUT on Edge
      const userPromise = supabase.auth.getUser()
      const timeoutPromise = new Promise<any>((resolve) =>
        setTimeout(() => resolve({ data: { user: null }, error: new Error('Timeout') }), 800)
      )

      const result = await Promise.race([userPromise, timeoutPromise])
      const user = result?.data?.user

      if (user && isAuthRoute) {
        const url = request.nextUrl.clone()
        url.pathname = '/pit-management/dashboard'
        return NextResponse.redirect(url)
      }
    }
  } catch (err) {
    // Fail silently to avoid blocking the whole website
    console.warn('Middleware auth error:', err)
  }

  return supabaseResponse
}
