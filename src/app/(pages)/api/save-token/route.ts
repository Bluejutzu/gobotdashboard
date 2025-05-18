import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
    const supabase = await createServerSupabaseClient()
    const body = await req.json()

    const { session, token, refreshToken } = body

    if (!session || !session.user) {
        return Response.json({ error: "Invalid session object" }, { status: 400 })
    }

    const user = session.user
    const email = user.email
    const userId = user.user_metadata?.provider_id
    const fullName = user.user_metadata?.full_name
    const avatarUrl = user.user_metadata?.avatar_url

    if (!token || !refreshToken) {
        return new Response(
            JSON.stringify({ error: "Missing access or refresh token" }),
            { status: 400 }
        )
    }

    if (!userId || !email) {
        return new Response(
            JSON.stringify({ error: "Missing user ID or email" }),
            { status: 400 }
        )
    }

    // 🔍 Get Discord token expiration
    let expiresAt: number | null = null
    try {
        const discordRes = await fetch("https://discord.com/api/oauth2/@me", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        if (!discordRes.ok) {
            throw new Error("Failed to fetch token info from Discord")
        }

        const discordData = await discordRes.json()
        if (discordData.expires) {
            expiresAt = Math.floor(new Date(discordData.expires).getTime() / 1000) // convert to UNIX seconds
        }
    } catch (err) {
        console.error("Error fetching Discord token metadata:", err)
        return new Response(
            JSON.stringify({ error: "Failed to validate token with Discord" }),
            { status: 400 }
        )
    }

    const { data, error } = await supabase
        .from("users")
        .upsert(
            {
                username: fullName,
                discord_token: token,
                discord_refresh_token: refreshToken,
                discord_token_expires_at: expiresAt,
                discord_id: userId,
                supabase_user_id: user.id,
                email,
                avatar_url: avatarUrl,
            },
            {
                onConflict: "supabase_user_id",
            }
        ).eq("supabase_user_id", user.id)

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }

    return new Response(JSON.stringify({ success: true, user: data }), { status: 200 })
}
