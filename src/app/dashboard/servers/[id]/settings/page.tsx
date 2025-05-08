import { redirect } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { SettingsForm } from "@/components/dashboard/settings-form"
import { RoleAccessControl } from "@/components/dashboard/role-access-control"
import { getSupabaseClient } from "@/lib/supabase/client"
import type { Server, BotSettings, User, UserServer } from "@/lib/types"

type SettingsPageProps = Promise<{ id: string }>

export default async function SettingsPage({ params }: { params: SettingsPageProps }) {
    const { id }: { id: string } = await params
    const supabase = getSupabaseClient()

    const {
        data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
        redirect("/auth/login")
    }

    // Get server data
    const { data: server } = await supabase
        .from("servers")
        .select("*")
        .eq("id", id)
        .single<Server>()

    if (!server) {
        redirect("/dashboard")
    }

    // Get user access to this server
    const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("discord_id", session.user.user_metadata.sub)
        .single<User>()

    if (!userData) {
        redirect("/dashboard")
    }

    const { data: userServer } = await supabase
        .from("user_servers")
        .select("*")
        .eq("user_id", userData.id)
        .eq("server_id", server.id)
        .single<UserServer>()

    // Check if user is admin
    if (!userServer || !userServer.is_admin) {
        redirect(`/dashboard/servers/${id}`)
    }

    // Get bot settings
    const { data: botSettings } = await supabase
        .from("bot_settings")
        .select("*")
        .eq("server_id", server.id)
        .single<BotSettings>()

    if (!botSettings) {
        redirect(`/dashboard/servers/${id}`)
    }

    return (
        <>
            <div className="hidden md:flex w-64 flex-col border-r bg-muted/40">
                <DashboardSidebar serverId={id} />
            </div>
            <div className="flex-1">
                <div className="h-full px-4 py-6 lg:px-8">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Bot Settings</h2>
                        <p className="text-muted-foreground">Configure Sapphire for {server.name}</p>
                    </div>

                    <div className="mt-8 grid gap-8">
                        <div className="max-w-2xl">
                            <SettingsForm settings={botSettings} />
                        </div>

                        <div className="max-w-2xl">
                            <RoleAccessControl serverId={id} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
