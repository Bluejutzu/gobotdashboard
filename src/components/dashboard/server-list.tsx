"use client";
import { useRouter } from "next/navigation";
import { ChevronRight, Plus, Shield, ShieldAlert, ShieldCheck, Search, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import type { Server } from "@/lib/types/types";

// Permission constants
const PERMISSION_ADMIN = 0x8;
const PERMISSION_MANAGE_SERVER = 0x20;
const PERMISSION_MANAGE_CHANNELS = 0x10;
const PERMISSION_MANAGE_ROLES = 0x10000000;

// Function to get permission label based on permission integer
function getPermissionLabel(permissions: number): {
    label: string;
    color: string;
} {
    if ((permissions & PERMISSION_ADMIN) !== 0) {
        return {
            label: "Administrator",
            color: "text-red-400 bg-red-500/10 border-red-500/20"
        };
    }
    if ((permissions & PERMISSION_MANAGE_SERVER) !== 0) {
        return {
            label: "Server Manager",
            color: "text-orange-400 bg-orange-500/10 border-orange-500/20"
        };
    }
    if ((permissions & PERMISSION_MANAGE_CHANNELS) !== 0) {
        return {
            label: "Channel Manager",
            color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
        };
    }
    if ((permissions & PERMISSION_MANAGE_ROLES) !== 0) {
        return {
            label: "Role Manager",
            color: "text-green-400 bg-green-500/10 border-green-500/20"
        };
    }
    return {
        label: "Member",
        color: "text-blue-400 bg-blue-500/10 border-blue-500/20"
    };
}

// Function to get permission icon based on permission integer
function getPermissionIcon(permissions: number) {
    if ((permissions & PERMISSION_ADMIN) !== 0) {
        return ShieldAlert;
    }
    if ((permissions & PERMISSION_MANAGE_SERVER) !== 0) {
        return ShieldCheck;
    }
    return Shield;
}

interface ServerListProps {
    servers: Server[];
    loading?: boolean;
    refreshing?: boolean;
    onRefresh?: () => void;
    onServerSelect?: (serverId: string) => void;
    className?: string;
}

export function ServerList({
    servers: initialServers,
    loading = false,
    refreshing = false,
    onRefresh,
    onServerSelect,
    className
}: ServerListProps) {
    const router = useRouter();
    const isMobile = useIsMobile();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const [filteredServers, setFilteredServers] = useState<Server[]>(initialServers);

    useEffect(() => {
        let filtered = [...(initialServers || [])];

        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(server => server.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        // Apply tab filter
        if (activeTab === "with-bot") {
            filtered = filtered.filter(server => server.botPresent);
        } else if (activeTab === "without-bot") {
            filtered = filtered.filter(server => !server.botPresent);
        }

        setFilteredServers(filtered);
    }, [initialServers, searchQuery, activeTab]);

    const handleServerClick = (server: Server) => {
        if (server.botPresent) {
            if (onServerSelect) {
                onServerSelect(server.id);
            } else {
                router.push(`/dashboard/servers/${server.id}`);
            }
        } else {
            // For servers without the bot, open the invite URL
            window.open(
                `https://discord.com/api/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&permissions=8&scope=bot%20applications.commands&guild_id=${server.id}`,
                "_blank"
            );
        }
    };

    return (
        <div className={cn("w-full max-w-5xl mx-auto px-4 sm:px-6", className)}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold mb-2">Your Servers</h1>
                    <p className="text-slate-400 text-sm sm:text-base">
                        Manage your Discord servers or add Gobot to a new server
                    </p>
                </div>
                <Button onClick={onRefresh} variant="outline" className="gap-2" disabled={loading || refreshing}>
                    <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
                    {refreshing ? "Refreshing..." : "Refresh"}
                </Button>
            </div>

            <div className="mb-6 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input
                        placeholder="Search servers..."
                        className="pl-9 bg-slate-900/50 border-slate-800"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4" />
                    {isMobile ? "Add Server" : "Add to New Server"}
                </Button>
            </div>

            <Tabs defaultValue="all" className="mb-4" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 w-full bg-slate-900/50 border border-slate-800">
                    <TabsTrigger value="all" className="data-[state=active]:bg-slate-800">
                        All Servers
                    </TabsTrigger>
                    <TabsTrigger value="with-bot" className="data-[state=active]:bg-slate-800">
                        With Gobot
                    </TabsTrigger>
                    <TabsTrigger value="without-bot" className="data-[state=active]:bg-slate-800">
                        Without Gobot
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            {loading ? (
                <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-3 p-3 rounded-lg border border-slate-800 bg-slate-900/50"
                        >
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="flex-1">
                                <Skeleton className="h-5 w-32 mb-1" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                            <Skeleton className="h-8 w-24 rounded-md" />
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    <div className="space-y-3">
                        {filteredServers.map(server => {
                            const permInfo = getPermissionLabel(server.permissions);
                            const PermissionIcon = getPermissionIcon(server.permissions);

                            return (
                                <div
                                    key={`${server.id}-${server.name}`}
                                    className={cn(
                                        "flex items-center gap-3 p-3 rounded-lg border transition-all",
                                        "hover:bg-slate-800/50 cursor-pointer",
                                        server.botPresent
                                            ? "border-slate-800 bg-slate-900/50"
                                            : "border-dashed border-slate-800/50 bg-slate-900/30"
                                    )}
                                    onClick={() => handleServerClick(server)}
                                >
                                    {/* Server icon */}
                                    <div className="relative">
                                        <Avatar className="h-10 w-10">
                                            {server.icon ? (
                                                <AvatarImage
                                                    src={server.icon || "/placeholder.svg"}
                                                    alt={server.name}
                                                    className={cn("transition-all", !server.botPresent && "opacity-70")}
                                                />
                                            ) : null}
                                            <AvatarFallback
                                                className={cn(
                                                    "bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold",
                                                    !server.botPresent && "from-slate-600 to-slate-700 opacity-70"
                                                )}
                                            >
                                                {server.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>

                                        {/* Permission indicator dot */}
                                        <div className="absolute -bottom-1 -right-1 rounded-full p-1 bg-slate-900 border border-slate-800">
                                            <PermissionIcon className={cn("h-3 w-3", permInfo.color.split(" ")[0])} />
                                        </div>
                                    </div>

                                    {/* Server info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h3
                                                className={cn(
                                                    "font-medium truncate",
                                                    !server.botPresent && "text-slate-300"
                                                )}
                                            >
                                                {server.name}
                                            </h3>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2 mt-1">
                                            <Badge
                                                variant="outline"
                                                className={cn("text-xs px-1.5 py-0", permInfo.color)}
                                            >
                                                {permInfo.label}
                                            </Badge>

                                            {!server.botPresent && (
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs px-1.5 py-0 text-slate-400 bg-slate-500/10 border-slate-500/20"
                                                >
                                                    Bot not added
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action button */}
                                    {server.botPresent ? (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-full text-slate-400 hover:text-white shrink-0"
                                        >
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-xs h-8 bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20 shrink-0"
                                        >
                                            <Plus className="h-3.5 w-3.5 mr-1 sm:mr-2" />
                                            <span className="hidden sm:inline">Add to Server</span>
                                            <span className="sm:hidden">Add</span>
                                        </Button>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {!loading && filteredServers.length === 0 && (
                        <div className="text-center py-8 sm:py-12 border border-dashed border-slate-800 rounded-lg bg-slate-900/30">
                            <h3 className="text-lg font-medium mb-2">No servers found</h3>
                            <p className="text-slate-400 mb-6 px-4">
                                {searchQuery
                                    ? "Try adjusting your search query"
                                    : activeTab === "with-bot"
                                      ? "You don't have any servers with Gobot yet"
                                      : "All your servers already have Gobot installed"}
                            </p>
                            {activeTab === "with-bot" && (
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Gobot to a Server
                                </Button>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
