import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function middleware(request: NextRequest) {
    // Create a Supabase client configured to use cookies
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
        cookies: {
            get(name: string) {
                return request.cookies.get(name)?.value
            },
        },
    })

    // Refresh session if expired
    const {
        data: { session },
    } = await supabase.auth.getSession()

    // If no session and trying to access protected routes
    if (!session && request.nextUrl.pathname.startsWith("/dashboard")) {
        const redirectUrl = new URL("/auth/login", request.url)
        return NextResponse.redirect(redirectUrl)
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/dashboard/:path*"],
}
