import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { createServerSupabaseClient } from "./supabase/server"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getBearerToken(userId: string, superbase_user_id: string) {
  console.log("Lmao", userId, superbase_user_id)

  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from("users")
    .select("discord_token")
    .eq("supabase_user_id", superbase_user_id)
    .single()

  if (error || !data) {
    console.error("Error fetching bearer token:", error)
    return null
  }

  return data.discord_token
} 