import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(request: NextRequest) {
    const response = NextResponse.next()

    const supabase = createMiddlewareClient({ req: request, res: response })

    const {
        data: { session },
    } = await supabase.auth.getSession()

    if (!session && request.nextUrl.pathname.startsWith("/dashboard")) {
        const redirectUrl = new URL("/auth/login", request.url)
        return NextResponse.redirect(redirectUrl)
    }

    return response
}

export const config = {
    matcher: ["/dashboard/:path*"],
}
