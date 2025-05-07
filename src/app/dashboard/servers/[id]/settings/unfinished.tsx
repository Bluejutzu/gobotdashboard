import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { SettingsForm } from "@/components/dashboard/settings-form"

type SettingsPageProps = Promise<{ id: string }>

export default async function SettingsPage({ params }: { params: SettingsPageProps }) {
    const { id }: { id: string } = await params
    const supabase = createServerClient()

    const {
        data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
        redirect("/auth/login")
    }

    const { data: server } = await supabase.from("servers").select("*").eq("id", id).single()

    if (!server) {
        redirect("/dashboard")
    }

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

    if (!userServer || !userServer.is_admin) {
        redirect(`/dashboard/servers/${id}`)
    }

    const { data: botSettings } = await supabase.from("bot_settings").select("*").eq("server_id", server.id).single()

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
                        <p className="text-muted-foreground">Configure Gobot for {server.name}</p>
                    </div>

                    <div className="mt-8">
                        <div className="max-w-2xl">
                            <SettingsForm settings={botSettings} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
