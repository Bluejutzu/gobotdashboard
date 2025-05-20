import { NextResponse } from "next/server"
import { getFormattedServerList } from "@/lib/redis-service/guild-service"

/**
 * Handles POST requests to fetch a formatted list of servers for a user.
 *
 * Expects a JSON body containing `userId` and `supabase_user_id`. Optionally accepts `forceRefresh`.
 * Returns a JSON response with the server list or an error message if validation fails or an internal error occurs.
 *
 * @returns A JSON response containing the server list or an error message.
 *
 * @remark Returns a 400 status if required parameters are missing, or a 500 status if an unexpected error occurs.
 */
export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { userId, supabase_user_id, forceRefresh } = body

        // Validate required parameters
        if (!userId || !supabase_user_id) {
            console.error("Missing required parameters:", { userId, supabase_user_id })
            return NextResponse.json(
                { error: "Missing required parameters: userId and supabase_user_id are required" },
                { status: 400 }
            )
        }

        // Log the request for debugging
        console.log("Fetching servers for:", { userId, supabase_user_id, forceRefresh })

        const servers = await getFormattedServerList(userId, supabase_user_id, forceRefresh, "api-route")
        return NextResponse.json(servers)
    } catch (e) {
        console.error("Error in server fetch API route:", e)
        return NextResponse.json(
            { error: `Failed to fetch servers: ${e instanceof Error ? e.message : String(e)}` },
            { status: 500 }
        )
    }
}