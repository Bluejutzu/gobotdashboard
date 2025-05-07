"use client"

import { useEffect, useState } from "react"
import { getSupabaseClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { CommandLog } from "@/lib/types"

interface ClientComponentProps {
    id: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    server: any,
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ServerPageClient: React.FC<ClientComponentProps> = ({ id, server }) => {
    const [recentCommands, setRecentCommands] = useState<CommandLog[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [, setSession] = useState<unknown>()
    const router = useRouter()

    useEffect(() => {
        const fetchSession = async () => {
            const supabase = getSupabaseClient()

            const { data: { session }, error } = await supabase.auth.getSession()

            if (error || !session) {
                router.push("/auth/login")
            }

            setSession(session)

            const { data: recentCommandsData, error: commandsError } = await supabase
                .from("commands_log")
                .select("*")
                .eq("server_id", id)
                .order("executed_at", { ascending: false })
                .limit(5)

            if (commandsError) {
                console.log("Error fetching commands:", commandsError)
            } else {
                const formattedCommands = recentCommandsData.map((cmd) => ({
                    id: cmd.id as string,
                    server_id: cmd.server_id as string,
                    user_id: cmd.user_id as string,
                    command: cmd.command as string,
                    executed_at: cmd.executed_at as string,
                }))
                setRecentCommands(formattedCommands)
            }

            setLoading(false)
        }

        fetchSession()
    }, [id, router])

    return (
        <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Recent Commands</h3>
            {loading ? (
                <div>Loading...</div>
            ) : recentCommands.length > 0 ? (
                <></>
                // <CommandHistory commands={recentCommands} />
            ) : (
                <div className="rounded-md border p-8 text-center">
                    <p className="text-muted-foreground">No recent commands</p>
                </div>
            )}
        </div>
    )
}

export default ServerPageClient
