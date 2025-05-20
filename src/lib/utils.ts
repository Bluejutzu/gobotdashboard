import { SupabaseClient } from "@supabase/supabase-js"
import axios from "axios"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

const BASE_URL = process.env.NODE_ENV === "production" ? "https://gobotdashboard.vercel.app" : "http://localhost:3000"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function refreshDiscordToken(userId: string, supabase_user_id: string, supabase: SupabaseClient) {
  if (!userId || !supabase_user_id) {
    throw new Error("Invalid user ID or supabase user ID")
  }

  if (!supabase) {
    throw new Error("Supabase client is required")
  }

  console.log("Refreshing token...")
  const refreshToken = await axios.post(
    `${BASE_URL}/api/refresh-token`,
    {
      userId,
      supabase_user_id,
    },
    {
      headers: { "Content-Type": "application/json" },
    }
  )

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
    throw new Error("Could not update Discord token", { cause: updateError.message })
  }

  console.log("Token refreshed successfully")
}