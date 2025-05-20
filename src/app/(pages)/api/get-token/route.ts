import { createServerSupabaseClient } from "@/lib/supabase/server"
import axios from "axios"

export async function POST(req: Request) {
    const supabase = await createServerSupabaseClient()
    const body = await req.json()

    const { userId, superbase_user_id } = body

    if (!userId || !superbase_user_id) {
        return Response.json({ error: "Invalid session object" }, { status: 400 })
    }

    const { data, error } = await supabase
        .from("users")
        .select("discord_refresh_token")
        .eq("discord_id", userId)
        .eq("supabase_user_id", superbase_user_id)
        .single()

    if (error || !data) {
        console.error("Error fetching refresh token:", error)
        return Response.json({ error: "Error fetching refresh token" }, { status: 500 })
    }

    const response = await axios.post(`https://discord.com/api/v10/oauth2/token`, {
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: data.discord_refresh_token,
    })

    if (response.status !== 200) {
        return Response.json({ error: "Error refreshing token" }, { status: 500 })
    }

    const tokenData = response.data

    const { error: updateError } = await supabase
        .from("users")
        .update({
            discord_access_token: tokenData.access_token,
            discord_refresh_token: tokenData.refresh_token,
        })
        .eq("discord_id", userId)
        .eq("supabase_user_id", superbase_user_id)

    if (updateError) {
        console.error("Error updating token:", updateError)
        return Response.json({ error: "Error updating token" }, { status: 500 })
    }

    return Response.json({ token: tokenData.access_token, refresh_token: tokenData.refresh_token }, { status: 200 })
}