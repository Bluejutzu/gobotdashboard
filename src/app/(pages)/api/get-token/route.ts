import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
    try {
        // Create Supabase client
        const supabase = await createServerSupabaseClient();

        // Parse request body
        let body;
        try {
            body = await req.json();
        } catch (parseError) {
            console.error("Failed to parse request body:", parseError);
            return Response.json({ error: "Invalid request body" }, { status: 400 });
        }

        // Validate request parameters
        const { userId, supabase_user_id } = body;
        if (!userId || !supabase_user_id) {
            return Response.json({ error: "Invalid session object" }, { status: 400 });
        }

        // Fetch user data from Supabase
        let data, supabaseError;
        try {
            const result = await supabase
                .from("users")
                .select("discord_refresh_token")
                .eq("discord_id", userId)
                .eq("supabase_user_id", supabase_user_id)
                .single();

            data = result.data;
            supabaseError = result.error;
        } catch (dbError) {
            console.error("Database operation failed:", dbError);
            return Response.json(
                {
                    error: "Database operation failed",
                    details: (dbError as any).message
                },
                { status: 500 }
            );
        }

        // Handle Supabase errors or missing data
        if (supabaseError) {
            console.error("Error fetching access token:", supabaseError);
            return Response.json(
                {
                    error: "Error fetching access token",
                    details: supabaseError.message
                },
                { status: 500 }
            );
        }

        if (!data || !data.discord_refresh_token) {
            console.error("No refresh token found for user");
            return Response.json({ error: "No refresh token found for user" }, { status: 404 });
        }

        // Check for required environment variables
        const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
        const clientSecret = process.env.DISCORD_CLIENT_SECRET;
        if (!clientId || !clientSecret) {
            console.error("Missing Discord OAuth configuration");
            return Response.json({ error: "Missing Discord OAuth configuration" }, { status: 500 });
        }

        // Request new token from Discord
        let tokenResponse;
        try {
            tokenResponse = await fetch("https://discord.com/api/v10/oauth2/token", {
                method: "POST",
                body: new URLSearchParams({
                    client_id: clientId,
                    client_secret: clientSecret,
                    grant_type: "refresh_token",
                    refresh_token: data.discord_refresh_token
                }),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });
        } catch (apiError: any) {
            console.error(`Discord API request failed: ${apiError}`);

            // Handle specific API errors
            if (apiError.response) {
                const status = apiError.response.status;
                const errorData = apiError.response.data || {};

                if (status === 401) {
                    return Response.json(
                        {
                            error: "Invalid refresh token",
                            details: errorData.error || "Unauthorized"
                        },
                        { status: 401 }
                    );
                }

                return Response.json(
                    {
                        error: "Discord token refresh failed",
                        details: errorData.error || `HTTP status ${status}`
                    },
                    { status: status || 500 }
                );
            }

            // Network or other errors
            return Response.json(
                {
                    error: "Failed to connect to Discord API",
                    details: apiError.message
                },
                { status: 500 }
            );
        }

        // Extract token data
        const tokenData = await tokenResponse.json();
        if (!tokenData.access_token || !tokenData.refresh_token) {
            console.error("Invalid token data received from Discord:", tokenData);
            return Response.json({ error: "Invalid token data received from Discord" }, { status: 500 });
        }

        // Update tokens in database
        try {
            const updateResult = await supabase
                .from("users")
                .update({
                    discord_token: tokenData.access_token,
                    discord_refresh_token: tokenData.refresh_token
                })
                .eq("discord_id", userId)
                .eq("supabase_user_id", supabase_user_id);

            if (updateResult.error) {
                console.error("Error updating token:", updateResult.error);
                // We successfully got a new token but couldn't save it
                // Return the token anyway, but log the error
                return Response.json(
                    {
                        token: tokenData.access_token,
                        refresh_token: tokenData.refresh_token,
                        warning: "Token was refreshed but could not be saved to database"
                    },
                    { status: 200 }
                );
            }
        } catch (updateError) {
            console.error("Failed to update database with new tokens:", updateError);
            // Return the token anyway since we got it successfully
            return Response.json(
                {
                    token: tokenData.access_token,
                    refresh_token: tokenData.refresh_token,
                    warning: "Token was refreshed but could not be saved to database"
                },
                { status: 200 }
            );
        }

        // Success case - return the new tokens
        return Response.json(
            { token: tokenData.access_token, refresh_token: tokenData.refresh_token },
            { status: 200 }
        );
    } catch (unhandledError) {
        // Global error handler for any unhandled exceptions
        console.error("Unhandled error in token refresh endpoint:", unhandledError);
        return Response.json(
            {
                error: "An unexpected error occurred",
                details: (unhandledError as any as any).message
            },
            { status: 500 }
        );
    }
}
