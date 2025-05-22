"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
    BarChart,
    Bot,
    ChevronDown,
    Cog,
    FileText,
    Home,
    MessageSquare,
    Plus,
    Server,
    Settings,
    Shield,
    Users,
    Zap,
    Webhook,
    Sparkles,
    Layers
} from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { Badge } from "@/components/ui/badge";
import type { Server as ServerType } from "@/lib/types/types";

interface DashboardNavProps {
    serverId: string;
    serverName: string;
    serverIcon?: string;
    guilds: ServerType[];
}

export function DashboardNav({ serverId, serverName, serverIcon, guilds }: DashboardNavProps) {
    const pathname = usePathname();
    const [serversOpen, setServersOpen] = useState(false);

    const isActive = (path: string) => {
        return pathname === path;
    };

    const isActiveSection = (section: string) => {
        return pathname?.includes(section) && !isActive(`/dashboard/servers/${serverId}`);
    };

    // Animation variants
    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <ScrollArea className="py-6 pr-6">
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <div className="mb-2 flex items-center gap-2">
                        <div className="relative h-8 w-8 overflow-hidden rounded-full">
                            {serverIcon ? (
                                <Image
                                    src={serverIcon || "/placeholder.svg"}
                                    alt={serverName}
                                    width={32}
                                    height={32}
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
                                    {serverName.charAt(0)}
                                </div>
                            )}
                            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
                        </div>
                        <div className="space-y-1">
                            <h2 className="line-clamp-1 text-sm font-semibold">{serverName}</h2>
                            <p className="line-clamp-1 text-xs text-muted-foreground">Server Dashboard</p>
                        </div>
                    </div>

                    <div className="mt-3 space-y-1">
                        <Button
                            variant={isActive(`/dashboard/servers/${serverId}`) ? "secondary" : "ghost"}
                            className="w-full justify-start"
                            size="sm"
                            asChild
                        >
                            <Link href={`/dashboard/servers/${serverId}`}>
                                <Home className="mr-2 h-4 w-4" />
                                Overview
                            </Link>
                        </Button>
                    </div>
                </div>

                <Separator className="mx-3" />

                <div className="px-3 py-2">
                    <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground">Server Management</h3>
                    <div className="space-y-1">
                        <Button
                            variant={
                                isActiveSection(`/dashboard/servers/${serverId}/moderation`) ? "secondary" : "ghost"
                            }
                            className="w-full justify-start"
                            size="sm"
                            asChild
                        >
                            <Link href={`/dashboard/servers/${serverId}/moderation`}>
                                <Shield className="mr-2 h-4 w-4" />
                                Moderation
                            </Link>
                        </Button>

                        <Button
                            variant={isActiveSection(`/dashboard/servers/${serverId}/commands`) ? "secondary" : "ghost"}
                            className="w-full justify-start"
                            size="sm"
                            asChild
                        >
                            <Link href={`/dashboard/servers/${serverId}/commands`}>
                                <Bot className="mr-2 h-4 w-4" />
                                Commands
                            </Link>
                        </Button>

                        <Button
                            variant={isActiveSection(`/dashboard/servers/${serverId}/roles`) ? "secondary" : "ghost"}
                            className="w-full justify-start"
                            size="sm"
                            asChild
                        >
                            <Link href={`/dashboard/servers/${serverId}/roles`}>
                                <Users className="mr-2 h-4 w-4" />
                                Roles
                                <Badge variant="outline" className="ml-auto text-xs">
                                    New
                                </Badge>
                            </Link>
                        </Button>

                        <Button
                            variant={
                                isActiveSection(`/dashboard/servers/${serverId}/analytics`) ? "secondary" : "ghost"
                            }
                            className="w-full justify-start"
                            size="sm"
                            asChild
                        >
                            <Link href={`/dashboard/servers/${serverId}/analytics`}>
                                <BarChart className="mr-2 h-4 w-4" />
                                Analytics
                            </Link>
                        </Button>

                        <Button
                            variant={isActiveSection(`/dashboard/servers/${serverId}/logs`) ? "secondary" : "ghost"}
                            className="w-full justify-start"
                            size="sm"
                            asChild
                        >
                            <Link href={`/dashboard/servers/${serverId}/logs`}>
                                <FileText className="mr-2 h-4 w-4" />
                                Logs
                            </Link>
                        </Button>

                        <Button
                            variant={isActiveSection(`/dashboard/servers/${serverId}/webhooks`) ? "secondary" : "ghost"}
                            className="w-full justify-start"
                            size="sm"
                            asChild
                        >
                            <Link href={`/dashboard/servers/${serverId}/webhooks`}>
                                <Webhook className="mr-2 h-4 w-4" />
                                Webhooks
                            </Link>
                        </Button>

                        <Button
                            variant={isActiveSection(`/dashboard/servers/${serverId}/settings`) ? "secondary" : "ghost"}
                            className="w-full justify-start"
                            size="sm"
                            asChild
                        >
                            <Link href={`/dashboard/servers/${serverId}/settings`}>
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </Link>
                        </Button>
                    </div>
                </div>

                <Separator className="mx-3" />

                <div className="px-3 py-2">
                    <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground">Features</h3>
                    <div className="space-y-1">
                        <Button
                            variant={isActiveSection(`/dashboard/servers/${serverId}/auto-mod`) ? "secondary" : "ghost"}
                            className="w-full justify-start"
                            size="sm"
                            asChild
                        >
                            <Link href={`/dashboard/servers/${serverId}/auto-mod`}>
                                <Zap className="mr-2 h-4 w-4" />
                                Auto Moderation
                            </Link>
                        </Button>

                        <Button
                            variant={
                                isActiveSection(`/dashboard/servers/${serverId}/custom-commands`)
                                    ? "secondary"
                                    : "ghost"
                            }
                            className="w-full justify-start"
                            size="sm"
                            asChild
                        >
                            <Link href={`/dashboard/servers/${serverId}/custom-commands`}>
                                <Cog className="mr-2 h-4 w-4" />
                                Custom Commands
                            </Link>
                        </Button>

                        <Button
                            variant={isActiveSection(`/dashboard/servers/${serverId}/welcome`) ? "secondary" : "ghost"}
                            className="w-full justify-start"
                            size="sm"
                            asChild
                        >
                            <Link href={`/dashboard/servers/${serverId}/welcome`}>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Welcome Messages
                            </Link>
                        </Button>

                        <Button
                            variant={isActiveSection(`/dashboard/servers/${serverId}/leveling`) ? "secondary" : "ghost"}
                            className="w-full justify-start"
                            size="sm"
                            asChild
                        >
                            <Link href={`/dashboard/servers/${serverId}/leveling`}>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Leveling System
                            </Link>
                        </Button>

                        <Button
                            variant={
                                isActiveSection(`/dashboard/servers/${serverId}/reaction-roles`) ? "secondary" : "ghost"
                            }
                            className="w-full justify-start"
                            size="sm"
                            asChild
                        >
                            <Link href={`/dashboard/servers/${serverId}/reaction-roles`}>
                                <Layers className="mr-2 h-4 w-4" />
                                Reaction Roles
                            </Link>
                        </Button>
                    </div>
                </div>

                <Separator className="mx-3" />

                <div className="px-3 py-2">
                    <div className="space-y-1">
                        <Button
                            variant="ghost"
                            className="w-full justify-start"
                            size="sm"
                            onClick={() => setServersOpen(!serversOpen)}
                        >
                            <Server className="mr-2 h-4 w-4" />
                            My Servers
                            <ChevronDown
                                className={cn("ml-auto h-4 w-4 transition-transform", serversOpen && "rotate-180")}
                            />
                        </Button>

                        {serversOpen && (
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    visible: { opacity: 1 },
                                    hidden: { opacity: 0 }
                                }}
                                className="mt-2 space-y-1 pl-6"
                            >
                                {guilds.length > 0 ? (
                                    guilds.map((guild, index) => (
                                        <motion.div
                                            key={guild.id}
                                            variants={itemVariants}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <Button
                                                variant={guild.id === serverId ? "secondary" : "ghost"}
                                                className="w-full justify-start"
                                                size="sm"
                                                asChild
                                            >
                                                <Link href={`/dashboard/servers/${guild.id}`}>
                                                    <div className="mr-2 h-4 w-4 relative">
                                                        {guild.icon ? (
                                                            <Image
                                                                src={guild.icon || "/placeholder.svg"}
                                                                alt={guild.name}
                                                                width={16}
                                                                height={16}
                                                                className="rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/10 text-[10px] text-primary">
                                                                {guild.name.charAt(0)}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className="truncate">{guild.name}</span>
                                                </Link>
                                            </Button>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="py-2 px-3 text-sm text-muted-foreground">No servers found</div>
                                )}

                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="mt-2 w-full justify-start"
                                                size="sm"
                                                asChild
                                            >
                                                <Link href="/dashboard/add-server">
                                                    <Plus className="mr-2 h-4 w-4" />
                                                    Add Server
                                                </Link>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="right">
                                            <p>Add Sapphire to a new server</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </ScrollArea>
    );
}
