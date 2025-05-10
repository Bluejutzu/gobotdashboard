import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DataRequestForm } from "@/components/dashboard/data-request-form"
import { DataRequestsList } from "@/components/dashboard/data-requests-list"

interface DataRequestsPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function DataRequestsPage(props: Promise<{ id: string }>) {
    const { id }: { id: string } = await props
    const supabase = await createClient()

    const {
        data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
        redirect("/auth/login")
    }

    // Get server data
    const { data: server } = await supabase.from("servers").select("*").eq("id", id).single()

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

    return (
        <>
            <div className="hidden md:flex w-64 flex-col border-r bg-muted/40">
                <DashboardSidebar serverId={id} />
            </div>
            <div className="flex-1">
                <div className="h-full px-4 py-6 lg:px-8">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Data Requests</h2>
                        <p className="text-muted-foreground">Request and manage data exports for {server.name}</p>
                    </div>

                    <div className="mt-8 grid gap-8 md:grid-cols-2">
                        <DataRequestForm serverId={id} serverName={server.name} />
                        <DataRequestsList serverId={id} />
                    </div>
                </div>
            </div>
        </>
    )
}
