"use client"

import * as React from "react"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { getSupabaseClient } from "@/lib/supabase/client"
import {
    Home,
    Settings,
    MessageSquare,
    Shield,
    PaintBucket,
    Bell,
    UserPlus,
    Smile,
    Link2,
    FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import type { Server as ServerType } from "@/lib/types"

interface ServerLayoutProps {
    children: React.ReactNode
    params: { id: string }
}

export default function ServerLayout({ children, params }: ServerLayoutProps) {
    const { id } = React.use(params)
    
    const pathname = usePathname()
    const [server, setServer] = useState<ServerType | null>(null)
    const [loading, setLoading] = useState(true)
    const supabase = getSupabaseClient()

    useEffect(() => {
        const fetchServer = async () => {
            try {
                const { data, error } = await supabase.from("servers").select("*").eq("discord_id", id).single<ServerType>()

                if (data) {
                    setServer(data)
                }
            } catch (error) {
                console.error("Error fetching server:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchServer()
    }, [id, supabase])

    const navItems = [
        { href: `/dashboard/servers/${id}`, label: "Home", icon: Home },
        { href: `/dashboard/servers/${id}/settings`, label: "General Settings", icon: Settings },
        { href: `/dashboard/servers/${id}/commands`, label: "Commands", icon: MessageSquare },
        { href: `/dashboard/servers/${id}/messages`, label: "Messages", icon: MessageSquare },
        { href: `/dashboard/servers/${id}/branding`, label: "Custom Branding", icon: PaintBucket },
        {
            label: "MODULES",
            type: "header",
        },
        { href: `/dashboard/servers/${id}/auto-moderation`, label: "Auto Moderation", icon: Shield },
        { href: `/dashboard/servers/${id}/moderation`, label: "Moderation", icon: Shield },
        { href: `/dashboard/servers/${id}/notifications`, label: "Social Notifications", icon: Bell },
        { href: `/dashboard/servers/${id}/join-roles`, label: "Join Roles", icon: UserPlus },
        { href: `/dashboard/servers/${id}/reaction-roles`, label: "Reaction Roles", icon: Smile },
        { href: `/dashboard/servers/${id}/welcome`, label: "Welcome Messages", icon: MessageSquare },
        { href: `/dashboard/servers/${id}/connections`, label: "Role Connections", icon: Link2 },
        { href: `/dashboard/servers/${id}/logging`, label: "Logging", icon: FileText },
    ]

    return (
        <div className="flex min-h-screen bg-background">
            {/* Sidebar */}
            <div className="w-64 border-r border-slate-800 shrink-0 hidden md:block">
                <div className="h-full py-4 flex flex-col">
                    {/* Server selector */}
                    <div className="px-4 mb-6 flex items-center">
                        {loading ? (
                            <Skeleton className="h-8 w-full" />
                        ) : (
                            <Button variant="ghost" className="w-full justify-start text-left font-semibold text-lg gap-2 px-2">
                                <div className="flex items-center gap-2 overflow-hidden">
                                    {server?.icon_url ? (
                                        <img
                                            src={server.icon_url || "/placeholder.svg"}
                                            alt={server.name}
                                            className="h-6 w-6 rounded-full"
                                        />
                                    ) : (
                                        <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center">
                                            <span className="text-xs font-bold text-white">{server?.name?.charAt(0) || "S"}</span>
                                        </div>
                                    )}
                                    <span className="truncate">{server?.name || "Server"}</span>
                                </div>
                                <svg className="h-4 w-4 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </Button>
                        )}
                    </div>

                    {/* Navigation */}
                    <div className="flex-1 px-2 space-y-1 overflow-y-auto">
                        {navItems.map((item, i) =>
                            item.type === "header" ? (
                                <div key={i} className="px-3 py-2 text-xs font-semibold text-slate-500 mt-4">
                                    {item.label}
                                </div>
                            ) : (
                                <Link
                                    key={i}
                                    href={item.href || "#"}
                                    className={cn(
                                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                                        pathname === item.href
                                            ? "bg-blue-500/10 text-blue-400"
                                            : "text-muted-foreground hover:bg-slate-800/50 hover:text-foreground",
                                    )}
                                >
                                    {item.icon && <item.icon className="h-4 w-4" />}
                                    <span>{item.label}</span>
                                </Link>
                            ),
                        )}
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 p-8 overflow-auto">{children}</div>
        </div>
    )
}
