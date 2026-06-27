import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { ADMIN_EMAIL } from '@/lib/config'

// Next.js 16 renamed the "middleware" convention to "proxy".
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Refresh the session (critical for Supabase auth to work properly)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect admin routes — only the admin email can access
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user || user.email !== ADMIN_EMAIL) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Protect user-specific routes — must be logged in
  if (request.nextUrl.pathname.startsWith('/orders')) {
    if (!user) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static assets and public files
     * (logos, hero animation, robots, sitemap).
     */
    '/((?!_next/static|_next/image|favicon.ico|logo.svg|dark-themelogo.svg|hero-animation.gif|robots.txt|sitemap.xml).*)',
  ],
}
