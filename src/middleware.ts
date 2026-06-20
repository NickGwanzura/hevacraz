import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;

  // Allow login page
  if (pathname === "/admin/login") {
    const sessionCookie = request.cookies.get("authjs.session-token")?.value ||
                          request.cookies.get("__Secure-authjs.session-token")?.value;
    if (sessionCookie) {
      return NextResponse.redirect(new URL("/admin", origin));
    }
    return NextResponse.next();
  }

  // Protect all /admin routes
  if (pathname.startsWith("/admin")) {
    const sessionCookie = request.cookies.get("authjs.session-token")?.value ||
                          request.cookies.get("__Secure-authjs.session-token")?.value;

    if (!sessionCookie) {
      const loginUrl = new URL("/admin/login", origin);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin"],
};
