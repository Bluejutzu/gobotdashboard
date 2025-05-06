import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { StatsCard } from "@/components/dashboard/stats-card"
import { CommandHistory } from "@/components/dashboard/command-history"
import { BarChart3, MessageSquare, Users } from "lucide-react"

interface ServerPageProps {
  params: {
    id: string
  }
}

export default async function ServerPage({ params }: ServerPageProps) {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/login")
  }

  // Get server data
  const { data: server } = await supabase.from("servers").select("*").eq("id", params.id).single()

  if (!server) {
    redirect("/dashboard")
  }

  // Get user access to this server
  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("discord_id", session.user.user_metadata.sub)
    .single()

  const { data: userServer } = await supabase
    .from("user_servers")
    .select("*")
    .eq("user_id", userData?.id)
    .eq("server_id", server.id)
    .single()

  if (!userServer) {
    redirect("/dashboard")
  }

  // Get bot settings
  const { data: botSettings } = await supabase.from("bot_settings").select("*").eq("server_id", server.id).single()

  // Get recent commands
  const { data: recentCommands } = await supabase
    .from("commands_log")
    .select("*")
    .eq("server_id", server.id)
    .order("executed_at", { ascending: false })
    .limit(5)

  return (
    <>
      <div className="hidden md:flex w-64 flex-col border-r bg-muted/40">
        <DashboardSidebar serverId={params.id} />
      </div>
      <div className="flex-1">
        <div className="h-full px-4 py-6 lg:px-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{server.name}</h2>
            <p className="text-muted-foreground">Server overview and statistics</p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <StatsCard title="Total Members" value={server.member_count.toLocaleString()} icon={Users} />
            <StatsCard title="Commands Used" value={(recentCommands?.length || 0) + " today"} icon={MessageSquare} />
            <StatsCard title="Bot Status" value="Online" description="Last updated 2 minutes ago" icon={BarChart3} />
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Recent Commands</h3>
            {recentCommands && recentCommands.length > 0 ? (
              <CommandHistory commands={recentCommands} />
            ) : (
              <div className="rounded-md border p-8 text-center">
                <p className="text-muted-foreground">No recent commands</p>
              </div>
            )}
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Bot Configuration</h3>
            <div className="rounded-md border p-4">
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Command Prefix</dt>
                  <dd className="mt-1 text-sm">{botSettings?.prefix || "!"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Auto Role</dt>
                  <dd className="mt-1 text-sm">{botSettings?.auto_role || "None"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Moderation</dt>
                  <dd className="mt-1 text-sm">{botSettings?.moderation_enabled ? "Enabled" : "Disabled"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Custom Commands</dt>
                  <dd className="mt-1 text-sm">
                    {botSettings?.custom_commands && Object.keys(botSettings.custom_commands).length > 0
                      ? Object.keys(botSettings.custom_commands).join(", ")
                      : "None"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
