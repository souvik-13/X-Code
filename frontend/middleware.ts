import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt';

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


    if (request.nextUrl.pathname === '/home')
        return NextResponse.redirect(new URL('/~', request.url))

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$|.*\\.svg$|.*\\.jpg$|.*\\.ico$|.*\\.webp$).*)'],
}