import { createServerSupabaseClient } from "@/lib/supabase/server"
import axios from "axios"

/**
 * Handles a POST request to refresh a user's Discord OAuth2 access and refresh tokens.
 *
 * Expects a JSON body containing `userId` and `superbase_user_id`. Retrieves the user's stored Discord refresh token from the database, requests new tokens from Discord, updates the database with the new tokens, and returns them in the response.
 *
 * @returns A JSON response containing the new Discord access token and refresh token, or an error message with the appropriate HTTP status code.
 */
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

    const params = new URLSearchParams();
    params.append('client_id', process.env.DISCORD_CLIENT_ID || '');
    params.append('client_secret', process.env.DISCORD_CLIENT_SECRET || '');
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', data.discord_refresh_token);
    const response = await axios.post(
        'https://discord.com/api/v10/oauth2/token',
        params,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    if (response.status !== 200) {
        return Response.json({ error: "Error refreshing token" }, { status: 500 });
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