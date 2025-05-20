"use client"

import * as React from "react"
import { useEffect, useState } from "react" // Added useCallback
import { redirect, usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import {
    AlertTriangle,
    ArrowLeft,
    BarChart3,
    Bell,
    ChevronDown,
    FileText,
    Home,
    Link2,
    Lock,
    LogOut,
    Menu,
    MessageSquare,
    PaintBucket,
    Plus,
    Settings,
    Shield,
    Smile,
    Sparkles,
    User as UserIcon,
    UserPlus
} from "lucide-react"
import axios from "axios"
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
import type { Server as ServerType, User as UserType } from "@/lib/types/types"
import { SiteFooter } from "@/components/site-footer"

import supabase from "@/lib/supabase/client"

interface DiscordPartialGuild {
    id: string;
    name: string;
    icon: string | null; // Expected to be full URL from the API
    owner: boolean;
    permissions: string; // Still present, but filtering should occur backend
    features: string[];
}

// Site developer Discord IDs - these users can access "no_access" features
const SITE_DEVELOPERS = ["953708302058012702"];

interface NavItem {
    href?: string;
    label: string;
    icon?: React.ElementType;
    type?: string;
    experimental?: "no_access" | "beta" | "open_access";
}

interface ServerLayoutProps {
    children: React.ReactNode;
    params: Promise<{ id: string }>;
}

export default function ServerLayout({ children, params }: ServerLayoutProps) {
    const { id } = React.use(params); // Current server ID from route
    const pathname = usePathname();
    const router = useRouter();
    const [server, setServer] = useState<ServerType | null>(null); // Current server details
    const [userServers, setUserServers] = useState<DiscordPartialGuild[]>([]); // User's list of manageable servers
    const [loading, setLoading] = useState(true); // For current server details
    const [serversLoading, setServersLoading] = useState(true); // For user's server list
    const [userData, setUserData] = useState<UserType | undefined>();
    const [userLoading, setUserLoading] = useState(true); // For user data
    const [showBetaAlert, setShowBetaAlert] = useState(false);
    const [currentBetaFeature, setCurrentBetaFeature] = useState<string | null>(null);
    const [serverSelectorOpen, setServerSelectorOpen] = useState(false);

    const fetchUserServers = React.useCallback(async () => {
        if (!userData) return;

        try {
            setServersLoading(true);
            console.log("fetching servers for user:", userData);

            const response = await axios.post<DiscordPartialGuild[]>(`/api/guilds?source=server-layout`,
                {
                    userId: userData.id,
                    supabase_user_id: userData.supabase_user_id
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                },
            );

            if (response.status === 200 && Array.isArray(response.data)) {
                setUserServers(response.data);
            } else {
                console.error("Invalid response for user servers:", response);
                setUserServers([]);
            }
        } catch (error) {
            console.error("Error fetching user servers:", error);
            setUserServers([]);
        } finally {
            setServersLoading(false);
        }
    }, [userData])

    useEffect(() => {

        const fetchCurrentServerDetails = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from("servers")
                    .select("*")
                    .eq("discord_id", id)
                    .single<ServerType>();

                if (error) {
                    console.error("Error fetching current server details:", error);
                }
                if (data) {
                    setServer(data);
                }
            } catch (error) {
                console.error("Error fetching current server details:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchUserAndThenTheirServers = async () => {
            try {
                setUserLoading(true);
                const { data: sessionData } = await supabase.auth.getSession();

                if (sessionData.session) {
                    const { data: userDetails, error: userError } = await supabase
                        .from("users")
                        .select("*")
                        .eq("supabase_user_id", sessionData.session.user.id)
                        .single<UserType>();

                    if (userError) {
                        console.error("Error fetching user details:", userError);
                        setUserData(undefined);
                    } else if (userDetails) {
                        setUserData(userDetails);
                        console.log("User details fetched", userDetails)
                        // User details fetched, now fetch their list of manageable servers
                        await fetchUserServers();
                    } else {
                        setUserData(undefined); // No user record found
                        console.error("No user record found")
                        redirect("/auth/login")
                    }
                } else {
                    setUserData(undefined); // No active session
                    console.error("No active session")
                    redirect("/auth/login")
                }
            } catch (error) {
                console.error("Error fetching user details and their servers:", error);
                setUserData(undefined);
            } finally {
                setUserLoading(false);
            }
        };

        fetchCurrentServerDetails();
        fetchUserAndThenTheirServers();
    });

    const isSiteDeveloper = userData?.discord_id && SITE_DEVELOPERS.includes(userData.discord_id);

    const canAccessNavItem = (item: NavItem) => {
        if (!userData) { // If user data is not yet loaded, assume restricted access for experimental features
            return !item.experimental || item.experimental === "open_access";
        }
        if (isSiteDeveloper) {
            return true;
        }
        if (!item.experimental || item.experimental === "open_access") {
            return true;
        }
        if (item.experimental === "beta") {
            return true; // Or apply specific beta access logic if needed
        }
        if (item.experimental === "no_access") {
            return isSiteDeveloper;
        }
        return true; // Default to accessible if no specific restriction matches
    };

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            router.push("/auth/login");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    const handleServerSelect = (selectedServerId: string) => {
        setServerSelectorOpen(false); // Close the dropdown
        if (selectedServerId !== id) { // Navigate if different server
            router.push(`/dashboard/servers/${selectedServerId}`);
        }
    };

    const navItems: NavItem[] = React.useMemo(() => [
        { href: `/dashboard/servers/${id}`, label: "Home", icon: Home, experimental: "beta" },
        { href: `/dashboard/servers/${id}/settings`, label: "General Settings", icon: Settings, experimental: "no_access" },
        { href: `/dashboard/servers/${id}/commands`, label: "Commands", icon: MessageSquare, experimental: "no_access" },
        { href: `/dashboard/servers/${id}/messages`, label: "Messages", icon: MessageSquare, experimental: "no_access" },
        { href: `/dashboard/servers/${id}/branding`, label: "Custom Branding", icon: PaintBucket, experimental: "no_access" },
        { label: "MODULES", type: "header" },
        { href: `/dashboard/servers/${id}/moderation`, label: "Moderation", icon: Shield, experimental: "no_access" },
        { href: `/dashboard/servers/${id}/notifications`, label: "Social Notifications", icon: Bell, experimental: "no_access" },
        { href: `/dashboard/servers/${id}/join-roles`, label: "Join Roles", icon: UserPlus, experimental: "no_access" },
        { href: `/dashboard/servers/${id}/reaction-roles`, label: "Reaction Roles", icon: Smile, experimental: "no_access" },
        { href: `/dashboard/servers/${id}/welcome`, label: "Welcome Messages", icon: MessageSquare, experimental: "no_access" },
        { href: `/dashboard/servers/${id}/connections`, label: "Role Connections", icon: Link2, experimental: "no_access" },
        { href: `/dashboard/servers/${id}/logging`, label: "Logging", icon: FileText, experimental: "no_access" },
        { href: `/dashboard/servers/${id}/analytics`, label: "Advanced Analytics", icon: BarChart3, experimental: "no_access" },
        { href: `/dashboard/servers/${id}/ai-tools`, label: "AI Tools", icon: Sparkles, experimental: "no_access" },
    ], [id]);

    useEffect(() => {
        const currentNavItem = navItems.find((item) => item.href === pathname);
        if (currentNavItem?.experimental === "beta") {
            setShowBetaAlert(true);
            setCurrentBetaFeature(currentNavItem.label);
        } else {
            setShowBetaAlert(false);
            setCurrentBetaFeature(null);
        }
    }, [pathname, navItems]);

    const accessibleNavItems = navItems.filter(canAccessNavItem);

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
                                                ) : server?.icon ? (
                                                    <Avatar>
                                                        <AvatarImage src={server.icon || "/placeholder.svg"}
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
                                                {userServers.map((s) => ( // Renamed to 's' to avoid conflict if 'server' is in wider scope
                                                    <DropdownMenuItem
                                                        key={s.id}
                                                        className="cursor-pointer"
                                                        onClick={() => handleServerSelect(s.id)}
                                                    >
                                                        <div className="flex items-center gap-2 w-full">
                                                            {s.icon ? (
                                                                <Avatar>
                                                                    <AvatarImage src={s.icon} /* Assumes full URL */
                                                                        alt={s.name}
                                                                        className="h-6 w-6 rounded-full" />
                                                                    <AvatarFallback>
                                                                        {s.name.charAt(0)}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                            ) : (
                                                                <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center">
                                                                    <span className="text-xs font-bold text-white">{s.name.charAt(0)}</span>
                                                                </div>
                                                            )}
                                                            <span className="truncate flex-1">{s.name}</span>
                                                            {s.id === id && (
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
                                            <Link href="/dashboard/guilds" className="cursor-pointer"> {/* This link might be where users add/manage servers */}
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
                                                            <Badge variant="outline" className="ml-auto text-xs bg-yellow-500/10 text-yellow-400 border-yellow-500/20">BETA</Badge>
                                                        )}
                                                        {item.experimental === "no_access" && (
                                                            <Badge variant="outline" className="ml-auto text-xs bg-purple-500/10 text-purple-400 border-purple-500/20">DEV</Badge>
                                                        )}
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent side="right">
                                                    {item.experimental === "beta" && (
                                                        <p className="flex items-center gap-1"><AlertTriangle className="h-3 w-3 text-yellow-400" /><span>This feature is in beta and may not work as expected</span></p>
                                                    )}
                                                    {item.experimental === "no_access" && (
                                                        <p className="flex items-center gap-1"><Lock className="h-3 w-3 text-purple-400" /><span>Developer-only feature</span></p>
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
                                        ) : server?.icon ? (
                                            <Avatar>
                                                <AvatarImage src={server.icon || "/placeholder.svg"}
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
                                        {userServers.map((s) => ( // Renamed to 's'
                                            <DropdownMenuItem
                                                key={s.id}
                                                className="cursor-pointer"
                                                onClick={() => handleServerSelect(s.id)}
                                            >
                                                <div className="flex items-center gap-2 w-full">
                                                    {s.icon ? (
                                                        <Avatar>
                                                            <AvatarImage src={s.icon} /* Assumes full URL */
                                                                alt={s.name}
                                                                className="h-6 w-6 rounded-full" />
                                                            <AvatarFallback>
                                                                {s.name.charAt(0)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    ) : (
                                                        <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center">
                                                            <span className="text-xs font-bold text-white">{s.name.charAt(0)}</span>
                                                        </div>
                                                    )}
                                                    <span className="truncate flex-1">{s.name}</span>
                                                    {s.id === id && (
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
                                                    <Badge variant="outline" className="ml-auto text-xs bg-yellow-500/10 text-yellow-400 border-yellow-500/20">BETA</Badge>
                                                )}
                                                {item.experimental === "no_access" && (
                                                    <Badge variant="outline" className="ml-auto text-xs bg-purple-500/10 text-purple-400 border-purple-500/20">DEV</Badge>
                                                )}
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent side="right">
                                            {item.label} {/* Simplified tooltip content, or use experimental checks as before */}
                                            {item.experimental === "beta" && (
                                                <p className="flex items-center gap-1"><AlertTriangle className="h-3 w-3 text-yellow-400" /><span>This feature is in beta.</span></p>
                                            )}
                                            {item.experimental === "no_access" && (
                                                <p className="flex items-center gap-1"><Lock className="h-3 w-3 text-purple-400" /><span>Developer-only.</span></p>
                                            )}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ),
                        )}
                    </div>

                    {/* User menu */}
                    <div className="mt-auto p-4">
                        {userLoading ? (
                            <Skeleton className="h-10 w-full" />
                        ) : userData ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="w-full justify-start text-left p-2">
                                        <div className="flex items-center gap-2 w-full">
                                            <Avatar>
                                                <AvatarImage src={userData.avatar_url || undefined} alt={userData.username || "User"} />
                                                <AvatarFallback>{(userData.username || "U").charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col overflow-hidden">
                                                <span className="font-semibold truncate">{userData.username}</span>
                                                <span className="text-xs text-muted-foreground truncate">@{userData.username}</span>
                                            </div>
                                            <ChevronDown className="h-4 w-4 ml-auto" />
                                        </div>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 mb-2" align="end" side="top">
                                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem asChild>
                                            <Link href="/dashboard/account"> {/* Example link */}
                                                <UserIcon className="mr-2 h-4 w-4" />
                                                <span>Profile</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/dashboard/account/settings"> {/* Example link */}
                                                <Settings className="mr-2 h-4 w-4" />
                                                <span>Settings</span>
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-400 hover:!text-red-400 focus:!text-red-400">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button onClick={() => router.push("/auth/login")} className="w-full">Login</Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Main content */}
            <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8"> {/* Adjusted top padding for mobile */}
                {showBetaAlert && currentBetaFeature && (
                    <Alert className="mb-4 border-yellow-500/50 text-yellow-200 bg-yellow-900/30 [&>svg]:text-yellow-400">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            The &quot;{currentBetaFeature}&quot; feature is currently in beta. Some functionalities may not work as expected.
                        </AlertDescription>
                    </Alert>
                )}
                {children}
                <SiteFooter className="pt-8" />
            </main>
        </div>
    );
}