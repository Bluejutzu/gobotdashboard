import { createServerSupabaseClient } from "@/lib/supabase/server";
import { refreshDiscordToken } from "@/lib/utils/utils";

/**
 * Handles a POST request to refresh a user's Discord OAuth access token.
 *
 * Validates the authorization header and request body, retrieves the current Discord refresh token from the database, obtains new tokens from Discord, updates the database, and returns the refreshed access token.
 *
 * @param req - The incoming HTTP request containing the authorization header and user identifiers in the JSON body.
 * @returns A JSON response with the refreshed Discord access token on success, or an error message with the appropriate HTTP status code on failure.
 */
export async function POST(req: Request) {
    // 1. Header validation
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createServerSupabaseClient();
    const { userId, supabase_user_id } = await req.json();

    if (!userId || !supabase_user_id) {
        return Response.json({ error: "Invalid session object" }, { status: 400 });
    }

    try {
        // 2. Fetch current refresh token
        const { data, error } = await supabase
            .from("users")
            .select("discord_refresh_token")
            .eq("discord_id", userId)
            .eq("supabase_user_id", supabase_user_id)
            .single();

        if (error || !data) {
            console.error("Error fetching user data:", error);
            return Response.json({ error: "Error fetching user data" }, { status: 500 });
        }

        // 3. Call Discord API to refresh the token
        const tokenData = await refreshDiscordToken(userId, supabase_user_id, supabase);

        // 4. Update the database with the new tokens
        const { error: updateError } = await supabase
            .from("users")
            .update({
                discord_token: tokenData.data?.discord_access_token,
                discord_refresh_token: tokenData.data?.discord_refresh_token
            })
            .eq("discord_id", userId)
            .eq("supabase_user_id", supabase_user_id);

        if (updateError) {
            console.error("Error updating tokens:", updateError);
            return Response.json({ error: "Error updating tokens" }, { status: 500 });
        }

        // 5. Return the refreshed access token
        if (!tokenData.data?.discord_access_token) {
            console.error("Missing access token in response");
            return Response.json({ error: "Invalid token data received" }, { status: 500 });
        }

        return Response.json({ token: tokenData.data?.discord_access_token }, { status: 200 });
    } catch (err) {
        console.error("Unexpected error during token refresh:", err);
        return Response.json({ error: "Failed to refresh token" }, { status: 500 });
    }
}
