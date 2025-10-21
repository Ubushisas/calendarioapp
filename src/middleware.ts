import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')

  // Redirect to login if accessing admin routes without auth
  if (isAdminRoute && !isLoggedIn && req.nextUrl.pathname !== '/admin/login') {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  // Redirect to settings if logged in and trying to access login page
  if (req.nextUrl.pathname === '/admin/login' && isLoggedIn) {
    return NextResponse.redirect(new URL('/admin/settings', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/admin/:path*']
}
