import type { SupabaseClient } from "@supabase/supabase-js";
import axios from "axios";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const BASE_URL = process.env.NODE_ENV === "production" ? "https://gobotdashboard.vercel.app" : "http://localhost:3000";

/**
 * Merges multiple class name values into a single string, resolving Tailwind CSS conflicts.
 *
 * Accepts any combination of string, array, or object class values and returns a deduplicated, merged class name string.
 *
 * @returns A single string of merged class names.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Refreshes a user's Discord OAuth token and updates the tokens in the Supabase database.
 *
 * Attempts to obtain new Discord access and refresh tokens for the specified user by calling an internal API endpoint, then updates the user's record in the Supabase `users` table with the new tokens.
 *
 * @param userId - The Discord user ID.
 * @param supabase_user_id - The Supabase user ID associated with the Discord user.
 * @returns An object indicating success or failure. On success, includes the new Discord access and refresh tokens.
 *
 * @throws {Error} If the token refresh API request fails or returns a non-200 status.
 */
export async function refreshDiscordToken(
    userId: string,
    supabase_user_id: string,
    supabase: SupabaseClient
): Promise<{
    success: boolean;
    error?: string;
    data?: { discord_access_token: string; discord_refresh_token: string };
}> {
    if (!userId || !supabase_user_id) {
        return {
            success: false,
            error: "Invalid user ID or supabase user ID",
            data: {
                discord_access_token: "",
                discord_refresh_token: ""
            }
        };
    }

    if (!supabase) {
        return {
            success: false,
            error: "Supabase client is required",
            data: {
                discord_access_token: "",
                discord_refresh_token: ""
            }
        };
    }

    console.log("Refreshing token...");
    let refreshToken;
    try {
        refreshToken = await axios.post(
            `${BASE_URL}/api/refresh-token`,
            {
                userId,
                supabase_user_id
            },
            {
                headers: { "Content-Type": "application/json" }
            }
        );
    } catch (error) {
        // If axios throws an error, handle it properly
        if (axios.isAxiosError(error)) {
            return {
                success: false,
                error: `Could not refresh Discord token: ${error.response?.data?.error || error.message}`
            };
        }
        throw error; // Re-throw if it's not an axios error
    }

    if (refreshToken.status !== 200) {
        return {
            success: false,
            error: `Could not refresh Discord token: ${refreshToken.statusText}`
        };
    }

    const refreshTokenData = refreshToken.data;
    const newBearerToken = refreshTokenData.access_token;

    const { error: updateError } = await supabase
        .from("users")
        .update({
            discord_access_token: newBearerToken,
            discord_refresh_token: refreshTokenData.refresh_token
        })
        .eq("supabase_user_id", supabase_user_id)
        .eq("discord_id", userId);

    if (updateError) {
        return {
            success: false,
            error: "Could not update Discord token",
            data: { discord_access_token: "", discord_refresh_token: "" }
        };
    }

    return {
        success: true,
        data: {
            discord_access_token: newBearerToken,
            discord_refresh_token: refreshTokenData.refresh_token
        }
    };
}
