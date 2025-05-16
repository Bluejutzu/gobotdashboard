"use client"

import { useState } from "react"
import axios from "axios"
import { createClient } from "@/lib/supabase/client"
import { getBearerToken } from "@/lib/utils"
import type { Server as ServerType } from "@/lib/types"
import { ServerError } from "./server-error"
import { ServerLoading } from "./server-loading"

interface CustomError extends Error {
  title?: string
  code?: string
}

interface ServerCreatorProps {
  discordId: string
  userId: string
  onServerCreated: (server: ServerType) => void
}

export function ServerCreator({ discordId, userId, onServerCreated }: ServerCreatorProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<CustomError | null>(null)
  const supabase = createClient()

  const createServer = async () => {
    try {
      // Get Discord token
      const bearerToken = await getBearerToken(userId)

      if (!bearerToken) {
        throw new Error("Could not retrieve Discord token")
      }

      // Fetch server data from Discord API
      const response = await axios.get(`https://discord.com/api/v10/guilds/${discordId}/preview`, {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      })

      // Create server in our database
      const { data: newServer, error: createError } = await supabase
        .from("servers")
        .insert({
          name: response.data.name,
          discord_id: discordId,
          icon_url: response.data.icon ? `https://cdn.discordapp.com/icons/${discordId}/${response.data.icon}.png` : null,
          member_count: response.data.approximate_member_count || 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single<ServerType>()

      if (createError) {
        throw new Error(`Error creating server: ${createError.message}`)
      }

      // Create user_server relationship
      await supabase.from("user_servers").insert({
        user_id: userId,
        server_id: newServer.id,
        is_admin: true,
      })

      // Create default bot settings
      await supabase.from("bot_settings").insert({
        server_id: newServer.id,
        prefix: "!",
        welcome_message: "Welcome to the server, {user}!",
        auto_role: "",
        moderation_enabled: true,
      })

      onServerCreated(newServer)
      setLoading(false)
    } catch (error: any) {
      setError(error)
      setLoading(false)
    }
  }

  // Start server creation process
  createServer()

  if (loading) {
    return <ServerLoading />
  }

  if (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        return (
          <ServerError
            title="Authentication Error"
            message="You don't have permission to access this server. Make sure you have the 'Manage Server' permission."
            code="401 Unauthorized"
          />
        )
      }

      if (error.response?.status === 404) {
        return (
          <ServerError
            title="Server Not Found"
            message="The Discord server you're trying to access doesn't exist or you don't have access to it."
            code="404 Not Found"
          />
        )
      }

      return (
        <ServerError
          title="Discord API Error"
          message={error.response?.data?.message || "An error occurred while communicating with Discord."}
          code={`${error.response?.status || "Unknown"}`}
        />
      )
    }

    return (
      <ServerError
        title={error.title || "Unexpected Error"}
        message={error.message || "Something went wrong while creating your server. Please try again later."}
        code={error.code}
      />
    )
  }

  return null
} 