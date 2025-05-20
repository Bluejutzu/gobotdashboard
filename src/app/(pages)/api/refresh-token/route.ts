import { createServerSupabaseClient } from "@/lib/supabase/server"
import { refreshDiscordToken } from "@/lib/utils"

export async function POST(req: Request) {
    // 1. Header validation
    const authHeader = req.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createServerSupabaseClient()
    const { userId, supabase_user_id } = await req.json()

    if (!userId || !supabase_user_id) {
        return Response.json({ error: "Invalid session object" }, { status: 400 })
    }

    try {
        // 2. Fetch current refresh token
        const { data, error } = await supabase
            .from("users")
            .select("discord_refresh_token")
            .eq("discord_id", userId)
            .eq("supabase_user_id", supabase_user_id)
            .single()

        if (error || !data) {
            console.error("Error fetching user data:", error)
            return Response.json({ error: "Error fetching user data" }, { status: 500 })
        }

        // 3. Call Discord API to refresh the token
        const tokenData = await refreshDiscordToken(
            userId,
            supabase_user_id,
            data.discord_refresh_token
        )

        // 4. Update the database with the new tokens
        const { error: updateError } = await supabase
            .from("users")
            .update({
                discord_token: tokenData.access_token,
                discord_refresh_token: tokenData.refresh_token,
            })
            .eq("discord_id", userId)
            .eq("supabase_user_id", supabase_user_id)

        if (updateError) {
            console.error("Error updating tokens:", updateError)
            return Response.json({ error: "Error updating tokens" }, { status: 500 })
        }

        // 5. Return the refreshed access token
        return Response.json({ token: tokenData.access_token }, { status: 200 })
    } catch (err) {
        console.error("Unexpected error during token refresh:", err)
        return Response.json({ error: "Failed to refresh token" }, { status: 500 })
    }
}