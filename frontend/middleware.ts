import { NextResponse, type NextRequest } from "next/server";

// const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(request: NextRequest) {
  // const token = await getToken({ req: request, secret });
  // console.log(token, request.nextUrl.pathname)

  // // // unauthorized
  // if (!token) {
  //     // && !request.nextUrl.pathname.startsWith('/login')
  //     if (request.nextUrl.pathname !== '/auth/login' && request.nextUrl.pathname !== '/auth/signup' && request.nextUrl.pathname !== '/auth/signout' && request.nextUrl.pathname !== '/')
  //         return NextResponse.redirect(new URL('/auth/login', request.url))
  // }

  if (request.nextUrl.pathname === "/home")
    return NextResponse.redirect(new URL("/~", request.url));

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - *.ico (favicon file)
     * - *.png (image file)
     * - *.svg (image file)
     * - *.jpg (image file)
     * - *.webp (image file)
     * - public (public directory)
     */
    "/((?!api|_next/static|_next/image|.*\\.png$|.*\\.svg$|.*\\.jpg$|.*\\.ico$|.*\\.webp$).*)",
  ],
};
