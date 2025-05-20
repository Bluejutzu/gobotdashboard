import { SupabaseClient } from "@supabase/supabase-js"
import axios from "axios"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

const BASE_URL = process.env.NODE_ENV === "production" ? "https://gobotdashboard.vercel.app" : "http://localhost:3000"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function refreshDiscordToken(userId: string, supabase_user_id: string, supabase: SupabaseClient): Promise<{ success: boolean, error?: string, data?: { discord_access_token: any, discord_refresh_token: any } }> {
  if (!userId || !supabase_user_id) {
    return { success: false, error: "Invalid user ID or supabase user ID", data: { discord_access_token: "", discord_refresh_token: "" } }
  } 

  if (!supabase) {
    return { success: false, error: "Supabase client is required" }
  }

  console.log("Refreshing token...")
  let refreshToken;
  try {
    refreshToken = await axios.post(
      `${BASE_URL}/api/refresh-token`,
      {
        userId,
        supabase_user_id,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    // If axios throws an error, handle it properly
    if (axios.isAxiosError(error)) {
      throw new Error(`Could not refresh Discord token: ${error.response?.data?.error || error.message}`);
    }
    throw error; // Re-throw if it's not an axios error
  }

  if (refreshToken.status !== 200) {
    throw new Error("Could not refresh Discord token", { cause: refreshToken.statusText })
  }

  const refreshTokenData = refreshToken.data
  const newBearerToken = refreshTokenData.access_token

  const { error: updateError } = await supabase.from("users").update({
    discord_access_token: newBearerToken,
    discord_refresh_token: refreshTokenData.refresh_token,
  })
    .eq("supabase_user_id", supabase_user_id)
    .eq("discord_id", userId)

  if (updateError) {
    return { success: false, error: "Could not update Discord token", data: { discord_access_token: "", discord_refresh_token: "" } }
  }

  console.log("Token refreshed successfully")
  return {
    success: true,
    data: {
      discord_access_token: newBearerToken,
      discord_refresh_token: refreshTokenData.refresh_token,
    }
  }
}