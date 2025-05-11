"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
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
    LogOut,
    ChevronDown,
    Menu,
    AlertTriangle,
    Lock,
    Sparkles,
    BarChart3,
    Plus,
    ArrowLeft,
    User as UserIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Server as ServerType } from "@/lib/types"
import { SiteFooter } from "@/components/site-footer"
import axios from "axios"
import { getBearerToken } from "@/lib/utils"
import { User } from "@/lib/types"

// Define the Discord guild interface
interface DiscordPartialGuild {
    id: string
    name: string
    icon: string | null
    owner: boolean
    permissions: string
    features: string[]
}

// Site developer Discord IDs - these users can access "no_access" features
const SITE_DEVELOPERS = ["953708302058012702"]

interface NavItem {
    href?: string
    label: string
    icon?: React.ElementType
    type?: string
    experimental?: "no_access" | "beta" | "open_access"
}

interface ServerLayoutProps {
    children: React.ReactNode
    params: Promise<{ id: string }>
}

export default function ServerLayout({ children, params }: ServerLayoutProps) {
    const { id } = React.use(params)
    const pathname = usePathname()
    const router = useRouter()
    const [server, setServer] = useState<ServerType | null>(null)
    const [userServers, setUserServers] = useState<DiscordPartialGuild[]>([])
    const [loading, setLoading] = useState(true)
    const [serversLoading, setServersLoading] = useState(true)
    const [userData, setUserData] = useState<User>()
    const [userLoading, setUserLoading] = useState(true)
    const [showBetaAlert, setShowBetaAlert] = useState(false)
    const [currentBetaFeature, setCurrentBetaFeature] = useState<string | null>(null)
    const [serverSelectorOpen, setServerSelectorOpen] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        const fetchServer = async () => {
            try {
                const { data, error } = await supabase.from("servers").select("*").eq("discord_id", id).single<ServerType>()

                if (error) {
                    console.error("Error fetching server:", error)
                }

                if (data) {
                    setServer(data)
                }
            } catch (error) {
                console.error("Error fetching server:", error)
            } finally {
                setLoading(false)
            }
        }

        const fetchUser = async () => {
            try {
                setUserLoading(true)
                const { data: sessionData } = await supabase.auth.getSession()

                if (sessionData.session) {
                    const { data: userData, error: userError } = await supabase
                        .from("users")
                        .select("*")
                        .eq("discord_id", sessionData.session.user.user_metadata.sub)
                        .single()

                    if (userError) {
                        console.error("Error fetching user:", userError)
                    } else {
                        setUserData(userData)

                        // Fetch user's servers
                        if (typeof userData.id === "string" && typeof userData.discord_id === "string") {
                            await fetchUserServers(userData.discord_id)
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching user:", error)
            } finally {
                setUserLoading(false)
            }
        }

        const fetchUserServers = async (discordId: string) => {
            try {
                setServersLoading(true)

                // Get Discord bearer token
                const bearerToken = await getBearerToken(discordId)

                if (!bearerToken) {
                    console.error("Could not retrieve Discord token")
                    setServersLoading(false)
                    return
                }

                // Fetch guilds from Discord API
                try {
                    const response = await axios.get("https://discord.com/api/v10/users/@me/guilds", {
                        headers: {
                            Authorization: `Bearer ${bearerToken}`,
                        },
                    })

                    if (response.status === 200 && response.data) {
                        // Filter guilds where user has ADMINISTRATOR or MANAGE_GUILD permission
                        const filteredGuilds = response.data.filter((guild: DiscordPartialGuild) => {
                            const permInt = Number.parseInt(guild.permissions, 10)
                            return (permInt & 0x8) !== 0 || (permInt & 0x20) !== 0
                        })

                        // Add icon URLs
                        const guildsWithIcons = filteredGuilds.map((guild: DiscordPartialGuild) => ({
                            ...guild,
                            icon: guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : null,
                            discord_id: guild.id, // Add discord_id for compatibility with handleServerSelect
                        }))

                        setUserServers(guildsWithIcons)
                    }
                } catch (error) {
                    console.error("Error fetching Discord guilds:", error)
                }
            } catch (error) {
                console.error("Error fetching user servers:", error)
            } finally {
                setServersLoading(false)
            }
        }

        fetchServer()
        fetchUser()
    }, [id, supabase])

    // Check if current path is a beta feature and show alert
    useEffect(() => {
        const currentNavItem = navItems.find((item) => item.href === pathname)
        if (currentNavItem?.experimental === "beta") {
            setShowBetaAlert(true)
            setCurrentBetaFeature(currentNavItem.label)
        } else {
            setShowBetaAlert(false)
            setCurrentBetaFeature(null)
        }
    }, [pathname])

    const isSiteDeveloper = userData?.discord_id && SITE_DEVELOPERS.includes(userData.discord_id)

    const canAccessNavItem = (item: NavItem) => {
        if (!userData) {
            return !item.experimental || item.experimental === "open_access"
        }

        if (isSiteDeveloper) {
            return true
        }

        if (!item.experimental || item.experimental === "open_access") {
            return true
        }

        if (item.experimental === "beta") {
            return true
        }

        if (item.experimental === "no_access") {
            return isSiteDeveloper
        }

        return true
    }

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut()
            router.push("/auth/login")
        } catch (error) {
            console.error("Error signing out:", error)
        }
    }

    const handleServerSelect = (serverId: string) => {
        // Close the dropdown
        setServerSelectorOpen(false)

        // Navigate to the selected server
        if (serverId !== id) {
            router.push(`/dashboard/servers/${serverId}`)
        }
    }

    const navItems: NavItem[] = [
        { href: `/dashboard/servers/${id}`, label: "Home", icon: Home, experimental: "beta" },
        { href: `/dashboard/servers/${id}/settings`, label: "General Settings", icon: Settings, experimental: "no_access" },
        { href: `/dashboard/servers/${id}/commands`, label: "Commands", icon: MessageSquare, experimental: "no_access" },
        { href: `/dashboard/servers/${id}/messages`, label: "Messages", icon: MessageSquare, experimental: "no_access" },
        {
            href: `/dashboard/servers/${id}/branding`,
            label: "Custom Branding",
            icon: PaintBucket,
            experimental: "no_access",
        },
        {
            label: "MODULES",
            type: "header",
        },
        { href: `/dashboard/servers/${id}/moderation`, label: "Moderation", icon: Shield, experimental: "no_access" },
        {
            href: `/dashboard/servers/${id}/notifications`,
            label: "Social Notifications",
            icon: Bell,
            experimental: "no_access",
        },
        { href: `/dashboard/servers/${id}/join-roles`, label: "Join Roles", icon: UserPlus, experimental: "no_access" },
        {
            href: `/dashboard/servers/${id}/reaction-roles`,
            label: "Reaction Roles",
            icon: Smile,
            experimental: "no_access",
        },
        {
            href: `/dashboard/servers/${id}/welcome`,
            label: "Welcome Messages",
            icon: MessageSquare,
            experimental: "no_access",
        },
        { href: `/dashboard/servers/${id}/connections`, label: "Role Connections", icon: Link2, experimental: "no_access" },
        { href: `/dashboard/servers/${id}/logging`, label: "Logging", icon: FileText, experimental: "no_access" },
        {
            href: `/dashboard/servers/${id}/analytics`,
            label: "Advanced Analytics",
            icon: BarChart3,
            experimental: "no_access",
        },
        { href: `/dashboard/servers/${id}/ai-tools`, label: "AI Tools", icon: Sparkles, experimental: "no_access" },
    ]

    // Filter navItems based on access
    const accessibleNavItems = navItems.filter(canAccessNavItem)

    return (
        <div className="flex min-h-screen bg-background">
            {/* Mobile menu button */}
            <div className="fixed top-4 left-4 z-50 md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="bg-background/80 backdrop-blur-sm">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-0">
                        <div className="h-full py-4 flex flex-col">
                            {/* Server selector */}
                            <div className="px-4 mb-6">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="w-full justify-start text-left font-semibold text-lg gap-2 px-2">
                                            <div className="flex items-center gap-2 overflow-hidden">
                                                {loading ? (
                                                    <Skeleton className="h-6 w-6 rounded-full" />
                                                ) : server?.icon_url ? (
                                                    <Avatar>
                                                        <AvatarImage src={server.icon_url || "/placeholder.svg"}
                                                            alt={server.name}
                                                            className="h-6 w-6 rounded-full" />
                                                        <AvatarFallback>
                                                            {server?.name?.charAt(0) || "S"}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                ) : (
                                                    <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center">
                                                        <span className="text-xs font-bold text-white">{server?.name?.charAt(0) || "S"}</span>
                                                    </div>
                                                )}
                                                <span className="truncate">
                                                    {loading ? <Skeleton className="h-6 w-24" /> : server?.name || "Server"}
                                                </span>
                                            </div>
                                            <ChevronDown className="h-4 w-4 ml-auto" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56" align="start">
                                        <DropdownMenuLabel>Your Servers</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        {serversLoading ? (
                                            <div className="p-2">
                                                <Skeleton className="h-8 w-full mb-2" />
                                                <Skeleton className="h-8 w-full mb-2" />
                                                <Skeleton className="h-8 w-full" />
                                            </div>
                                        ) : userServers.length > 0 ? (
                                            <ScrollArea className="h-[300px]">
                                                {userServers.map((server) => (
                                                    <DropdownMenuItem
                                                        key={server.id}
                                                        className="cursor-pointer"
                                                        onClick={() => handleServerSelect(server.id)}
                                                    >
                                                        <div className="flex items-center gap-2 w-full">
                                                            {server.icon ? (
                                                                <Avatar>
                                                                    <AvatarImage src={server.icon || "/placeholder.svg"}
                                                                        alt={server.name}
                                                                        className="h-6 w-6 rounded-full" />
                                                                    <AvatarFallback>
                                                                        {server.name.charAt(0)}
                                                                    </AvatarFallback>
                                                                </Avatar>

                                                            ) : (
                                                                <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center">
                                                                    <span className="text-xs font-bold text-white">{server.name.charAt(0)}</span>
                                                                </div>
                                                            )}
                                                            <span className="truncate flex-1">{server.name}</span>
                                                            {server.id === id && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="ml-auto text-xs bg-blue-500/10 text-blue-400 border-blue-500/20"
                                                                >
                                                                    Current
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </DropdownMenuItem>
                                                ))}
                                            </ScrollArea>
                                        ) : (
                                            <div className="py-3 px-2 text-sm text-center text-muted-foreground">No servers found</div>
                                        )}
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link href="/dashboard" className="cursor-pointer">
                                                <ArrowLeft className="mr-2 h-4 w-4" />
                                                <span>Back to Dashboard</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/dashboard/guilds" className="cursor-pointer">
                                                <Plus className="mr-2 h-4 w-4" />
                                                <span>Add New Server</span>
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            {/* Navigation */}
                            <div className="flex-1 px-2 space-y-1 overflow-y-auto">
                                {accessibleNavItems.map((item, i) =>
                                    item.type === "header" ? (
                                        <div key={i} className="px-3 py-2 text-xs font-semibold text-slate-500 mt-4">
                                            {item.label}
                                        </div>
                                    ) : (
                                        <TooltipProvider key={i}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Link
                                                        href={item.href || "#"}
                                                        className={cn(
                                                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                                                            pathname === item.href
                                                                ? "bg-blue-500/10 text-blue-400"
                                                                : "text-muted-foreground hover:bg-slate-800/50 hover:text-foreground",
                                                        )}
                                                    >
                                                        {item.icon && <item.icon className="h-4 w-4" />}
                                                        <span className="flex-1">{item.label}</span>
                                                        {item.experimental === "beta" && (
                                                            <Badge
                                                                variant="outline"
                                                                className="ml-auto text-xs bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                                            >
                                                                BETA
                                                            </Badge>
                                                        )}
                                                        {item.experimental === "no_access" && (
                                                            <Badge
                                                                variant="outline"
                                                                className="ml-auto text-xs bg-purple-500/10 text-purple-400 border-purple-500/20"
                                                            >
                                                                DEV
                                                            </Badge>
                                                        )}
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent side="right">
                                                    {item.experimental === "beta" && (
                                                        <p className="flex items-center gap-1">
                                                            <AlertTriangle className="h-3 w-3 text-yellow-400" />
                                                            <span>This feature is in beta and may not work as expected</span>
                                                        </p>
                                                    )}
                                                    {item.experimental === "no_access" && (
                                                        <p className="flex items-center gap-1">
                                                            <Lock className="h-3 w-3 text-purple-400" />
                                                            <span>Developer-only feature</span>
                                                        </p>
                                                    )}
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    ),
                                )}
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Sidebar */}
            <div className="w-64 border-r border-slate-800 shrink-0 hidden md:block">
                <div className="h-full py-4 flex flex-col">
                    {/* Server selector */}
                    <div className="px-4 mb-6">
                        <DropdownMenu open={serverSelectorOpen} onOpenChange={setServerSelectorOpen}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="w-full justify-start text-left font-semibold text-lg gap-2 px-2">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        {loading ? (
                                            <Skeleton className="h-6 w-6 rounded-full" />
                                        ) : server?.icon_url ? (
                                            <Avatar>
                                                <AvatarImage src={server.icon_url || "/placeholder.svg"}
                                                    alt={server.name}
                                                    className="h-6 w-6 rounded-full" />
                                                <AvatarFallback>
                                                    {server?.name?.charAt(0) || "S"}
                                                </AvatarFallback>
                                            </Avatar>
                                        ) : (
                                            <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center">
                                                <span className="text-xs font-bold text-white">{server?.name?.charAt(0) || "S"}</span>
                                            </div>
                                        )}
                                        <span className="truncate">
                                            {loading ? <Skeleton className="h-6 w-24" /> : server?.name || "Server"}
                                        </span>
                                    </div>
                                    <ChevronDown className="h-4 w-4 ml-auto" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="start">
                                <DropdownMenuLabel>Your Servers</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {serversLoading ? (
                                    <div className="p-2">
                                        <Skeleton className="h-8 w-full mb-2" />
                                        <Skeleton className="h-8 w-full mb-2" />
                                        <Skeleton className="h-8 w-full" />
                                    </div>
                                ) : userServers.length > 0 ? (
                                    <ScrollArea className="h-[300px]">
                                        {userServers.map((server) => (
                                            <DropdownMenuItem
                                                key={server.id}
                                                className="cursor-pointer"
                                                onClick={() => handleServerSelect(server.id)}
                                            >
                                                <div className="flex items-center gap-2 w-full">
                                                    {server.icon ? (
                                                        <Avatar>
                                                            <AvatarImage src={server.icon || "/placeholder.svg"}
                                                                alt={server.name}
                                                                className="h-6 w-6 rounded-full" />
                                                            <AvatarFallback>
                                                                {server.name.charAt(0)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    ) : (
                                                        <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center">
                                                            <span className="text-xs font-bold text-white">{server.name.charAt(0)}</span>
                                                        </div>
                                                    )}
                                                    <span className="truncate flex-1">{server.name}</span>
                                                    {server.id === id && (
                                                        <Badge
                                                            variant="outline"
                                                            className="ml-auto text-xs bg-blue-500/10 text-blue-400 border-blue-500/20"
                                                        >
                                                            Current
                                                        </Badge>
                                                    )}
                                                </div>
                                            </DropdownMenuItem>
                                        ))}
                                    </ScrollArea>
                                ) : (
                                    <div className="py-3 px-2 text-sm text-center text-muted-foreground">No servers found</div>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard" className="cursor-pointer">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        <span>Back to Dashboard</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/guilds" className="cursor-pointer">
                                        <Plus className="mr-2 h-4 w-4" />
                                        <span>Add New Server</span>
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Navigation */}
                    <div className="flex-1 px-2 space-y-1 overflow-y-auto">
                        {accessibleNavItems.map((item, i) =>
                            item.type === "header" ? (
                                <div key={i} className="px-3 py-2 text-xs font-semibold text-slate-500 mt-4">
                                    {item.label}
                                </div>
                            ) : (
                                <TooltipProvider key={i}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link
                                                href={item.href || "#"}
                                                className={cn(
                                                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                                                    pathname === item.href
                                                        ? "bg-blue-500/10 text-blue-400"
                                                        : "text-muted-foreground hover:bg-slate-800/50 hover:text-foreground",
                                                )}
                                            >
                                                {item.icon && <item.icon className="h-4 w-4" />}
                                                <span className="flex-1">{item.label}</span>
                                                {item.experimental === "beta" && (
                                                    <Badge
                                                        variant="outline"
                                                        className="ml-auto text-xs bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                                    >
                                                        BETA
                                                    </Badge>
                                                )}
                                                {item.experimental === "no_access" && (
                                                    <Badge
                                                        variant="outline"
                                                        className="ml-auto text-xs bg-purple-500/10 text-purple-400 border-purple-500/20"
                                                    >
                                                        DEV
                                                    </Badge>
                                                )}
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent side="right">
                                            {item.experimental === "beta" && (
                                                <p className="flex items-center gap-1">
                                                    <AlertTriangle className="h-3 w-3 text-yellow-400" />
                                                    <span>This feature is in beta and may not work as expected</span>
                                                </p>
                                            )}
                                            {item.experimental === "no_access" && (
                                                <p className="flex items-center gap-1">
                                                    <Lock className="h-3 w-3 text-purple-400" />
                                                    <span>Developer-only feature</span>
                                                </p>
                                            )}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ),
                        )}
                    </div>
                </div>
            </div>

            {/* Main content with header */}
            <div className="flex-1 flex flex-col">
                {/* Header with account dropdown */}
                <header className="h-16 border-b border-slate-800 px-8 flex items-center justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                {userLoading ? (
                                    <Skeleton className="h-8 w-8 rounded-full" />
                                ) : (
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage
                                            src={userData?.avatar_url || "https://cdn.discordapp.com/embed/avatars/0.png"}
                                            alt={userData?.username || "User"}
                                        />
                                        <AvatarFallback className="bg-blue-500">
                                            {userData?.username?.charAt(0).toUpperCase() || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{userData?.username || "User"}</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {userData?.email || "No email available"}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/profile" className="cursor-pointer">
                                        <UserIcon className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/settings" className="cursor-pointer">
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Settings</span>
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>

                {/* Beta feature alert */}
                {showBetaAlert && (
                    <Alert className="m-4 border-yellow-500/20 bg-yellow-500/10 text-yellow-400">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            <span className="font-medium">{currentBetaFeature}</span> is currently in beta and may not work as
                            expected.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Page content */}
                <div className="flex-1 p-8 overflow-auto">{children}</div>
                <SiteFooter />
            </div>
        </div>
    )
}
