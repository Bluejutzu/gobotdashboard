import { createServerSupabaseClient } from "@/lib/supabase/server"

/**
 * Handles a POST request to retrieve a Discord token for a user after validating authorization and input.
 *
 * Validates the `authorization` header and required body fields, then queries the Supabase "users" table for the corresponding `discord_token`. Returns the token in a JSON response if found, or an appropriate error response otherwise.
 *
 * @returns A JSON response containing the Discord token on success, or an error message with the appropriate HTTP status code on failure.
 */
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
        .select("discord_token")
        .eq("discord_id", userId)
        .eq("supabase_user_id", supabase_user_id)
        .single()

    if (error || !data) {
        console.error("Error fetching bearer token:", error)
        return Response.json({ error: "Error fetching bearer token" }, { status: 500 })
    }

    return Response.json({ token: data.discord_token }, { status: 200 })
}