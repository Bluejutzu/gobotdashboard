"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ServerList } from "@/components/dashboard/server-list"
import type { Server } from "@/lib/types/types"
import { toast } from "sonner"
import axios from "axios"
import supabase from "@/lib/supabase/client"

/**
 * Displays a list of Discord servers associated with the authenticated user and provides options to refresh the list or navigate to a server's dashboard.
 *
 * Fetches the user's servers from the backend on mount and when refreshed, handling loading and error states. Allows navigation to a detailed dashboard for each server.
 */
export default function GuildsPage() {
    const [stateServers, setServers] = useState<Server[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const router = useRouter()

    const fetchServers = useCallback(async (forceRefresh = false) => {
        try {
            const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
            const discordId = sessionData.session?.user.user_metadata.sub

            if (sessionError) {
                // Preserve the original error as `cause` (Node ≥ 16.9 / modern browsers)
                throw new Error("Error fetching session data", { cause: sessionError })
            }

            console.log(
                discordId,
                sessionData.session?.user.id,
                forceRefresh,
            )

            const res = await axios.post(
                "/api/guilds",
                {
                    userId: discordId,
                    supabase_user_id: sessionData.session?.user.id,
                    forceRefresh,
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )

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
                servers={stateServers}
                loading={loading}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                onServerSelect={handleServerSelect}
            />
        </div>
    )
}
