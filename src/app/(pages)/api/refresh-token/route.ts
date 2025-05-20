import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
    const supabase = await createServerSupabaseClient()
    const body = await req.json()

    const { userId, superbase_user_id } = body

    if (!userId || !superbase_user_id) {
        return Response.json({ error: "Invalid session object" }, { status: 400 })
    }

    const { data, error } = await supabase
        .from("users")
        .select("discord_token")
        .eq("discord_id", userId)
        .eq("supabase_user_id", superbase_user_id)
        .single()

    if (error || !data) {
        console.error("Error fetching bearer token:", error)
        return Response.json({ error: "Error fetching bearer token" }, { status: 500 })
    }

    return Response.json({ token: data.discord_token }, { status: 200 })
}