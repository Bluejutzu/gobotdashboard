"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    ChevronDown,
    ChevronRight,
    Home,
    Settings,
    Shield,
    Users,
    BarChart,
    MessageSquare,
    Bell,
    HelpCircle,
    Zap,
    Server
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ServerItem {
    id: string;
    name: string;
    icon?: string;
}

export function MobileNav() {
    const pathname = usePathname();
    const [servers, setServers] = useState<ServerItem[]>([]);
    const [serversOpen, setServersOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServers = async () => {
            try {
                // In a real app, you would fetch servers from your API
                // This is just mock data for demonstration
                setServers([
                    {
                        id: "1",
                        name: "Gaming Community",
                        icon: "/placeholder.svg?height=32&width=32"
                    },
                    {
                        id: "2",
                        name: "Developer Hub",
                        icon: "/placeholder.svg?height=32&width=32"
                    },
                    {
                        id: "3",
                        name: "Study Group",
                        icon: "/placeholder.svg?height=32&width=32"
                    }
                ]);
            } catch (error) {
                console.error("Error fetching servers:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchServers();
    }, []);

    const isActive = (path: string) => {
        if (path === "/dashboard" && pathname === "/dashboard") {
            return true;
        }
        if (path !== "/dashboard" && pathname?.startsWith(path)) {
            return true;
        }
        return false;
    };

    return (
        <ScrollArea className="h-[calc(100vh-8rem)] pb-10">
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center gap-2">
                    <Shield className="h-6 w-6 text-primary" />
                    <span className="font-bold">Sapphire Dashboard</span>
                </div>

                <div className="mt-2 space-y-1">
                    <Button
                        variant={isActive("/dashboard") ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        size="sm"
                        asChild
                    >
                        <Link href="/dashboard">
                            <Home className="mr-2 h-4 w-4" />
                            Dashboard
                        </Link>
                    </Button>

                    <div className="pt-2">
                        <Button
                            variant="ghost"
                            className="w-full justify-start"
                            size="sm"
                            onClick={() => setServersOpen(!serversOpen)}
                        >
                            <Server className="mr-2 h-4 w-4" />
                            Servers
                            <ChevronDown
                                className={cn("ml-auto h-4 w-4 transition-transform", serversOpen && "rotate-180")}
                            />
                        </Button>

                        <AnimatePresence>
                            {serversOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                >
                                    <div className="mt-2 space-y-1 pl-6">
                                        {loading ? (
                                            <div className="py-2 px-3 text-sm text-muted-foreground">
                                                Loading servers...
                                            </div>
                                        ) : servers.length > 0 ? (
                                            servers.map(server => (
                                                <Button
                                                    key={server.id}
                                                    variant={
                                                        pathname?.includes(`/servers/${server.id}`)
                                                            ? "secondary"
                                                            : "ghost"
                                                    }
                                                    className="w-full justify-start"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <Link href={`/dashboard/servers/${server.id}`}>
                                                        <ChevronRight className="mr-2 h-4 w-4" />
                                                        <span className="truncate">{server.name}</span>
                                                    </Link>
                                                </Button>
                                            ))
                                        ) : (
                                            <div className="py-2 px-3 text-sm text-muted-foreground">
                                                No servers found
                                            </div>
                                        )}

                                        <Button
                                            variant="outline"
                                            className="mt-2 w-full justify-start"
                                            size="sm"
                                            asChild
                                        >
                                            <Link href="/dashboard/add-server">
                                                <Zap className="mr-2 h-4 w-4" />
                                                Add Server
                                            </Link>
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <Button
                        variant={isActive("/dashboard/settings") ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        size="sm"
                        asChild
                    >
                        <Link href="/dashboard/settings">
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                        </Link>
                    </Button>

                    <Button
                        variant={isActive("/dashboard/profile") ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        size="sm"
                        asChild
                    >
                        <Link href="/dashboard/profile">
                            <Users className="mr-2 h-4 w-4" />
                            Profile
                        </Link>
                    </Button>
                </div>

                <div className="mt-4">
                    <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground">Resources</h3>
                    <div className="space-y-1">
                        <Button variant="ghost" className="w-full justify-start" size="sm" asChild>
                            <Link href="/docs">
                                <HelpCircle className="mr-2 h-4 w-4" />
                                Documentation
                            </Link>
                        </Button>

                        <Button variant="ghost" className="w-full justify-start" size="sm" asChild>
                            <a href="https://discord.gg/sapphire" target="_blank" rel="noopener noreferrer">
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Support Server
                            </a>
                        </Button>

                        <Button variant="ghost" className="w-full justify-start" size="sm" asChild>
                            <Link href="/status">
                                <BarChart className="mr-2 h-4 w-4" />
                                Status
                            </Link>
                        </Button>

                        <Button variant="ghost" className="w-full justify-start" size="sm" asChild>
                            <Link href="/changelog">
                                <Bell className="mr-2 h-4 w-4" />
                                Changelog
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </ScrollArea>
    );
}
