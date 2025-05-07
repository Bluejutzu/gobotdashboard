import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { getSupabaseClient } from "./supabase/client"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getBearerToken(userId: string) {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from("users")
    .select("discord_bearer_token")
    .eq("id", userId)
    .single()

  if (error || !data) {
    console.error("Error fetching bearer token:", error)
    return null
  }

  return data.discord_bearer_token
}