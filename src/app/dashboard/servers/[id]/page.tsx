import { redirect } from "next/navigation"
import { Suspense } from "react"
import { StatsCard } from "@/components/dashboard/stats-card"
import { BarChart3, MessageSquare, Users } from "lucide-react"
import ServerPageClient from "@/components/dashboard/ServerPageClient"
import { ServerError } from "@/components/dashboard/server-error"
import { ServerCreated } from "@/components/dashboard/server-created"
import axios from "axios"
import { getBearerToken } from "@/lib/utils"
import { getSupabaseClient } from "@/lib/supabase/client"
import type { Server as ServerType, CommandLog } from "@/lib/types"
import { ServerLoading } from "@/components/dashboard/server-loading"
import { createServerClient } from "@/lib/supabase/server"


export default async function ServerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }: { id: string } = await params

  if (!id) {
    return redirect("/dashboard")
  }

  const supabase = createServerClient()

  const { data: sessionData } = await supabase.auth.getSession()
  console.log(sessionData)
  if (!sessionData.session) {
    redirect("/auth/login")
  }

  // Get user data - do this outside try/catch
  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("discord_id", sessionData.session.user.user_metadata.sub)
    .single()

  if (!userData) {
    redirect("/dashboard/onboarding")
  }

  // Now we can use try/catch for the rest of the operations that don't involve redirects
  try {
    // Try to fetch the server
    const { data: server, error: serverError } = await supabase
      .from("servers")
      .select("*")
      .eq("discord_id", id)
      .single<ServerType>()

    // If server doesn't exist, create it
    if (serverError && serverError.code === "PGRST116") {
      try {
        // Get Discord token
        const bearerToken = await getBearerToken(sessionData.session.user.user_metadata.sub)

        if (!bearerToken) {
          throw new Error("Could not retrieve Discord token")
        }

        // Fetch server data from Discord API
        const response = await axios.get(`https://discord.com/api/v10/guilds/${id}/preview`, {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        })

        // Create server in our database
        const { data: newServer, error: createError } = await supabase
          .from("servers")
          .insert({
            name: response.data.name,
            discord_id: id,
            icon_url: response.data.icon ? `https://cdn.discordapp.com/icons/${id}/${response.data.icon}.png` : null,
            member_count: response.data.approximate_member_count || 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (createError) {
          throw new Error(`Error creating server: ${createError.message}`)
        }

        // Create user_server relationship
        await supabase.from("user_servers").insert({
          user_id: userData.id,
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

        return <ServerCreated serverName={response.data.name} serverId={id} />
      } catch (error: any) {
        // Handle Discord API errors
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
            title="Server Creation Failed"
            message={error.message || "An unexpected error occurred while creating the server."}
          />
        )
      }
    }

    // Handle other server fetch errors
    if (serverError) {
      return (
        <ServerError
          title="Database Error"
          message="We couldn't retrieve your server data from our database."
          code={serverError.code}
        />
      )
    }

    if (!server) {
      return (
        <ServerError
          title="Server Not Found"
          message="The server you're looking for doesn't exist or you don't have access to it."
        />
      )
    }

    // Get recent commands
    const { data: recentCommands, error: commandsError } = await supabase
      .from("commands_log")
      .select("*")
      .eq("server_id", server.id)
      .order("executed_at", { ascending: false })
      .limit(5)
      .returns<CommandLog[]>()

    if (commandsError) {
      console.error("Error fetching commands:", commandsError)
    }

    // Render the server page
    return (
      <div className="space-y-8">
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <StatsCard title="Total Members" value={server.member_count?.toLocaleString() || "N/A"} icon={Users} />
          <StatsCard
            title="Commands Used"
            value={recentCommands?.length ? `${recentCommands.length} recent` : "0"}
            icon={MessageSquare}
          />
          <StatsCard title="Bot Status" value="Online" description="Last updated 2 minutes ago" icon={BarChart3} />
        </div>

        <Suspense fallback={<ServerLoading />}>
          <ServerPageClient id={id} server={server} commands={recentCommands || []} />
        </Suspense>
      </div>
    )
  } catch (error: any) {
    console.error("Unexpected error:", error)
    return (
      <ServerError
        title="Unexpected Error"
        message="Something went wrong while loading your server. Please try again later."
        code={error.message}
      />
    )
  }
}
