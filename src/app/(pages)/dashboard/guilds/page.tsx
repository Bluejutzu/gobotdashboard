"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ServerList } from "@/components/dashboard/server-list"
import type { Server } from "@/lib/types"
import { toast } from "sonner"
import axios from "axios"
import supabase from "@/lib/supabase/client"

export default function GuildsPage() {
    const [servers, setServers] = useState<Server[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const router = useRouter()

    const fetchServers = useCallback(async (forceRefresh = false) => {
        try {
            const { data: sessionData } = await supabase.auth.getSession()
            const discordId = sessionData.session?.user.user_metadata.sub

            const res = await axios.post("/api/guilds", {
                userId: discordId,
                superbase_user_id: sessionData.session?.user.id,
                forceRefresh,
            })

            const { servers } = res.data
            setServers(servers)
        } catch (error) {
            console.error("Error fetching servers:", error)
            toast.error("Error refreshing servers")
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }, [])


    useEffect(() => {
        fetchServers(false)
    }, [fetchServers])

    const handleRefresh = () => {
        fetchServers(true)
    }

    const handleServerSelect = (serverId: string) => {
        router.push(`/dashboard/servers/${serverId}`)
    }

    return (
        <div className="pt-16 pb-16">
            <ServerList
                servers={servers}
                loading={loading}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                onServerSelect={handleServerSelect}
            />
        </div>
    )
}
