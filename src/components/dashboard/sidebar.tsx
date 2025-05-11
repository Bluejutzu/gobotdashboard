"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Settings, MessageSquare, Shield, Home, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
    serverId?: string
}

export function DashboardSidebar({ className, serverId, ...props }: SidebarNavProps) {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push("/")
    }

    const items = [
        {
            title: "Overview",
            href: serverId ? `/dashboard/servers/${serverId}` : "/dashboard",
            icon: Home,
        },
        ...(serverId
            ? [
                {
                    title: "Analytics",
                    href: `/dashboard/servers/${serverId}/analytics`,
                    icon: BarChart3,
                },
                {
                    title: "Commands",
                    href: `/dashboard/servers/${serverId}/commands`,
                    icon: MessageSquare,
                },
                {
                    title: "Moderation",
                    href: `/dashboard/servers/${serverId}/moderation`,
                    icon: Shield,
                },
                {
                    title: "Settings",
                    href: `/dashboard/servers/${serverId}/settings`,
                    icon: Settings,
                },
            ]
            : []),
    ]

    return (
        <nav className={cn("flex flex-col space-y-1", className)} {...props}>
            <div className="px-3 py-2">
                <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Dashboard</h2>
                <div className="space-y-1">
                    {items.map((item) => (
                        <Button
                            key={item.href}
                            variant={pathname === item.href ? "secondary" : "ghost"}
                            className={cn(
                                "w-full justify-start",
                                pathname === item.href ? "bg-muted hover:bg-muted" : "hover:bg-transparent hover:underline",
                            )}
                            asChild
                        >
                            <Link href={item.href}>
                                <item.icon className="mr-2 h-4 w-4" />
                                {item.title}
                            </Link>
                        </Button>
                    ))}
                </div>
            </div>
            <div className="px-3 py-2 mt-auto">
                <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                </Button>
            </div>
        </nav>
    )
}
