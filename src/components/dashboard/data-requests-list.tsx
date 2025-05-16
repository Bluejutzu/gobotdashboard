"use client"

import { useEffect, useState } from "react"
import { AlertCircle, CheckCircle, Clock, Download, FileText, XCircle } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { createClient } from "@/lib/supabase/client"

interface DataRequest {
    id: string
    request_type: string
    request_reason: string
    status: string
    created_at: string
    updated_at: string
    rejection_reason?: string
    data_url?: string
    expires_at?: string
    server: {
        name: string
    }
}

interface DataRequestsListProps {
    serverId?: string // Optional - if provided, only show requests for this server
}

export function DataRequestsList({ serverId }: DataRequestsListProps) {
    const [requests, setRequests] = useState<DataRequest[] | null>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                // Get current user
                const {
                    data: { user },
                } = await supabase.auth.getUser()

                if (!user) {
                    throw new Error("User not authenticated")
                }

                // Get user ID from database
                const { data: userData } = await supabase
                    .from("users")
                    .select("discord_id")
                    .eq("discord_id", user.user_metadata.sub)
                    .single<{ discord_id: string }>()

                if (!userData) {
                    throw new Error("User not found in database")
                }

                let query = supabase
                    .from("data_requests")
                    .select(`
            id,
            request_type,
            request_reason,
            status,
            created_at,
            updated_at,
            rejection_reason,
            data_url,
            expires_at,
            server:server_id (name)
          `)
                    .eq("user_id2", userData.discord_id)
                    .order("created_at", { ascending: false })

                if (serverId) {
                    query = query.eq("server_id", serverId)
                }

                const { data, error } = await query.overrideTypes<DataRequest[]>()

                if (error) throw error

                setRequests(data)
            } catch (error) {
                console.error("Error fetching data requests:", error)
                toast.error("Error", {
                    description: "Failed to load data requests. Please try again.",
                })
            } finally {
                setLoading(false)
            }
        }

        fetchRequests()
    }, [supabase, serverId])

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending":
                return (
                    <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Pending
                    </Badge>
                )
            case "approved":
                return (
                    <Badge variant="default" className="flex items-center gap-1 bg-green-500">
                        <CheckCircle className="h-3 w-3" /> Approved
                    </Badge>
                )
            case "rejected":
                return (
                    <Badge variant="destructive" className="flex items-center gap-1">
                        <XCircle className="h-3 w-3" /> Rejected
                    </Badge>
                )
            default:
                return (
                    <Badge variant="secondary" className="flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> {status}
                    </Badge>
                )
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const getRequestTypeLabel = (type: string) => {
        switch (type) {
            case "full_export":
                return "Full Data Export"
            case "analytics_only":
                return "Analytics Only"
            case "logs_only":
                return "Command Logs Only"
            case "settings_only":
                return "Settings Only"
            default:
                return type
        }
    }

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>
                        <Skeleton className="h-6 w-48" />
                    </CardTitle>
                    <CardDescription>
                        <Skeleton className="h-4 w-64" />
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="border rounded-lg p-4 space-y-2">
                                <div className="flex justify-between">
                                    <Skeleton className="h-5 w-32" />
                                    <Skeleton className="h-5 w-24" />
                                </div>
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (!requests || requests.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Data Requests</CardTitle>
                    <CardDescription>
                        {serverId
                            ? "You haven't made any data requests for this server yet."
                            : "You haven't made any data requests yet."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-6 text-center">
                        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-sm text-muted-foreground max-w-md">
                            When you request server data, your requests will appear here.
                        </p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Data Requests</CardTitle>
                <CardDescription>
                    {serverId ? "Your data requests for this server" : "Your data requests across all servers"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {requests.map((request) => (
                        <div key={request.id} className="border rounded-lg p-4 space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">{getRequestTypeLabel(request.request_type)}</span>
                                    {!serverId && <span className="text-sm text-muted-foreground">for {request.server.name}</span>}
                                </div>
                                <div className="flex items-center gap-2">
                                    {getStatusBadge(request.status)}
                                    <span className="text-xs text-muted-foreground">{formatDate(request.created_at)}</span>
                                </div>
                            </div>

                            <div className="text-sm">
                                <div className="font-medium text-xs text-muted-foreground mb-1">Reason:</div>
                                <p>{request.request_reason}</p>
                            </div>

                            {request.status === "rejected" && request.rejection_reason && (
                                <div className="text-sm bg-destructive/10 p-2 rounded">
                                    <div className="font-medium text-xs text-destructive mb-1">Rejection Reason:</div>
                                    <p className="text-destructive-foreground">{request.rejection_reason}</p>
                                </div>
                            )}

                            {request.status === "approved" && request.data_url && (
                                <div className="flex justify-end">
                                    <Button size="sm" asChild>
                                        <a href={request.data_url} download>
                                            <Download className="mr-2 h-4 w-4" />
                                            Download Data
                                        </a>
                                    </Button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
