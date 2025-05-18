"use client"

import React, { Usable, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DataRequestForm } from "@/components/dashboard/data-request-form"
import { DataRequestsList } from "@/components/dashboard/data-requests-list"
import supabase from "@/lib/supabase/client"

interface PageParams {
    id: string;
}

interface ServerData {
    id: string;
    name: string;
    discord_id: string;
    [key: string]: unknown;
}

export default function DataRequestsPage({ params }: { params: Usable<PageParams> }) {
    const { id } = React.use(params)
    const router = useRouter()
    const [server, setServer] = useState<ServerData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const {
                    data: { session },
                } = await supabase.auth.getSession()

                if (!session) {
                    router.push("/auth/login")
                    return
                }

                // Get server data
                const { data: serverData, error: serverError } = await supabase
                    .from("servers")
                    .select("*")
                    .eq("discord_id", id)
                    .single()

                if (serverError) {
                    console.error("Error fetching server data:", serverError)
                    return <div>Error fetching server data</div>
                }

                setServer(serverData as ServerData)

                // Get user access to this server
                // const { data: userData } = await supabase
                //     .from("users")
                //     .select("*")
                //     .eq("discord_id", session.user.user_metadata.sub)
                //     .single()

                // const { data: userServerData } = await supabase
                //     .from("user_servers")
                //     .select("*")
                //     .eq("user_id", String(userData?.id))
                //     .eq("server_id", String(serverData.id))
                //     .single()

                // if (!userServerData) {
                //     console.log("No user server data")
                //     router.push("/dashboard")
                //     return
                // }

                setLoading(false)
            } catch (error) {
                console.error("Error fetching data:", error)
                router.push("/dashboard")
            }
        }

        fetchData()
    }, [id, router])

    if (loading) {
        return <div className="p-8">Loading...</div>
    }

    return (
        <>
            <div className="flex-1">
                <div className="h-full px-4 py-6 lg:px-8">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Data Requests</h2>
                        <p className="text-muted-foreground">Request and manage data exports for {server?.name || ""}</p>
                    </div>

                    <div className="mt-8 grid gap-8 md:grid-cols-2">
                        <DataRequestForm serverId={id} serverName={server?.name || ""} />
                        <DataRequestsList serverId={id} />
                    </div>
                </div>
            </div>
        </>
    )
}
