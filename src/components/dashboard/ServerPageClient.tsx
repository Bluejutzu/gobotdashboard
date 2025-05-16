"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, BarChart3, MessageSquare, RefreshCw, Server, Settings, Shield } from 'lucide-react'
import Link from "next/link"
import { Avatar } from "@radix-ui/react-avatar"
import { createClient } from "@/lib/supabase/client"
import { CommandHistory } from "@/components/dashboard/command-history"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import type { CommandLog, Server as ServerType } from "@/lib/types"
import { AvatarFallback, AvatarImage } from "../ui/avatar"

export interface ServerPageClientProps {
    id: string
    server: ServerType
    commands: CommandLog[]
}

export default function ServerPageClient({ id, server, commands = [] }: ServerPageClientProps) {
    const [recentCommands, setRecentCommands] = useState<CommandLog[]>(commands)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false)
    const router = useRouter()

    const fetchCommands = useCallback(async () => {
        setLoading(true)
        setIsRefreshing(true)
        setError(null)

        const supabase = createClient()

        // Check if user is still authenticated
        const {
            data: { session },
            error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
            setError("Authentication error. Please log in again.")
            setLoading(false)
            setIsRefreshing(false)
            return
        }

        if (!session) {
            // Handle this without try-catch
            router.push("/auth/login")
            return
        }

        // Fetch recent commands
        const { data: recentCommandsData, error: commandsError } = await supabase
            .from("commands_log")
            .select("*")
            .eq("server_id", id)
            .order("executed_at", { ascending: false })
            .limit(5)

        if (commandsError) {
            setError("Failed to load recent commands. Please try again.")
            console.error("Error fetching commands:", commandsError)
        } else {
            const formattedCommands =
                recentCommandsData?.map((cmd) => ({
                    id: cmd.id as string,
                    server_id: cmd.server_id as string,
                    user_id: cmd.user_id as string,
                    command: cmd.command as string,
                    executed_at: cmd.executed_at as string,
                })) || []

            setRecentCommands(formattedCommands)
        }

        setLoading(false)
        setIsRefreshing(false)
    }, [id, router])

    useEffect(() => {
        // If we already have commands from props, don't fetch again initially
        if (commands.length === 0) {
            fetchCommands()
        }
    }, [id, commands.length, fetchCommands])

    const handleRefresh = () => {
        fetchCommands()
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {server.icon_url ? (
                        <Avatar>    
                            <AvatarImage src={server.icon_url || "/placeholder.svg"} alt={server.name} className="w-10 h-10 rounded-full" />
                            <AvatarFallback>
                                {server.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                    ) : (
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Server className="h-5 w-5 text-primary" />
                        </div>
                    )}
                    <h2 className="text-2xl font-bold">{server.name}</h2>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="flex items-center gap-2"
                >
                    <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                    Refresh
                </Button>
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid grid-cols-4 md:w-auto w-full">
                    <TabsTrigger value="overview" className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        <span className="hidden sm:inline">Overview</span>
                    </TabsTrigger>
                    <TabsTrigger value="commands" className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        <span className="hidden sm:inline">Commands</span>
                    </TabsTrigger>
                    <TabsTrigger value="moderation" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        <span className="hidden sm:inline">Moderation</span>
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        <span className="hidden sm:inline">Settings</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Server Overview</CardTitle>
                            <CardDescription>Key information about your Discord server</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <div className="text-sm font-medium text-muted-foreground">Server ID</div>
                                    <div className="font-mono text-sm">{server.discord_id}</div>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-sm font-medium text-muted-foreground">Created</div>
                                    <div>{new Date(server.created_at).toLocaleDateString()}</div>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-sm font-medium text-muted-foreground">Members</div>
                                    <div>{server.member_count?.toLocaleString() || "Unknown"}</div>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-sm font-medium text-muted-foreground">Bot Status</div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                        <span>Active</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div>
                        <h3 className="text-lg font-medium mb-4">Recent Commands</h3>
                        {loading ? (
                            <div className="space-y-2">
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                            </div>
                        ) : recentCommands.length > 0 ? (
                            <CommandHistory commands={recentCommands} />
                        ) : (
                            <div className="rounded-md border p-8 text-center">
                                <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                <p className="text-muted-foreground">No recent commands</p>
                                <p className="text-sm text-muted-foreground mt-2">Commands used in your server will appear here</p>
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="commands" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Command Management</CardTitle>
                            <CardDescription>Configure and manage bot commands</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">
                                This section allows you to customize commands, create custom commands, and view command usage
                                statistics.
                            </p>
                            <Button asChild>
                                <Link href={`/dashboard/servers/${id}/commands`}>Manage Commands</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="moderation" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Moderation Tools</CardTitle>
                            <CardDescription>Keep your server safe and organized</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">
                                Configure auto-moderation, word filters, anti-spam measures, and view moderation logs.
                            </p>
                            <Button asChild>
                                <Link href={`/dashboard/servers/${id}/moderation`}>Moderation Settings</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="settings" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Server Settings</CardTitle>
                            <CardDescription>Configure your server and bot settings</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">
                                Manage welcome messages, auto-roles, prefix settings, and other server configurations.
                            </p>
                            <Button asChild>
                                <Link href={`/dashboard/servers/${id}/settings`}>Server Settings</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
