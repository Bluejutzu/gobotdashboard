import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { createClient } from "./supabase/client"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getBearerToken(userId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("users")
    .select("discord_token")
    .eq("discord_id", userId)
    .single()

  if (error || !data) {
    console.error("Error fetching bearer token:", error)
    return null
  }

  return data.discord_token
} 