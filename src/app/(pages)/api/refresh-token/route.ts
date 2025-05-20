import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
    // Add header validation
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createServerSupabaseClient()
    const body = await req.json()

    const { userId, supabase_user_id } = body

    if (!userId || !supabase_user_id) {
        return Response.json({ error: "Invalid session object" }, { status: 400 })
    }

    const { data, error } = await supabase
        .from("users")
    const { error: updateError } = await supabase
        .from("users")
        .update({
            discord_token: tokenData.access_token,
            discord_refresh_token: tokenData.refresh_token,
        })
        .eq("discord_id", userId)
        .eq("supabase_user_id", superbase_user_id)

    if (error || !data) {
        console.error("Error fetching bearer token:", error)
        return Response.json({ error: "Error fetching bearer token" }, { status: 500 })
    }

    return Response.json({ token: data.discord_token }, { status: 200 })
}