"use client"

import { createClient } from "@/lib/supabase/client"
import type { DiscordPartialGuild } from "@/lib/types"
import type { User } from "@supabase/supabase-js"
import axios from "axios"
import { redirect, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Users, Crown, Search, Bot, ServerCrash, UserIcon, Hash } from 'lucide-react'
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { Separator } from "@/components/ui/separator"

export default function GuildList() {
    const router = useRouter()
    const supabase = createClient()
    const [user, setUser] = useState<User>()
    const [guilds, setGuilds] = useState<DiscordPartialGuild[]>()
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        const checkSession = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession()

            if (!session) {
                router.push("/auth/login")
                return
            }

            setUser(session.user)
        }

        const getGuilds = async () => {
            setIsLoading(true)
            try {
                const {
                    data: { session },
                } = await supabase.auth.getSession()

                if (!session?.user || !session) {
                    return redirect("/auth/login")
                }

                const { data, error } = await supabase
                    .from("users")
                    .select("id, email, discord_token")
                    .eq("discord_id", session?.user?.user_metadata?.provider_id)
                    .single()

                if (error) {
                    console.log(error)
                    return redirect("/")
                }

                const { data: guildsData } = await axios.get("https://discord.com/api/v10/users/@me/guilds", {
                    headers: {
                        Authorization: `Bearer ${data?.discord_token}`,
                    },
                })

                const filteredGuilds = guildsData.filter((guild: DiscordPartialGuild) => {
                    const permInt = Number.parseInt(guild.permissions || "0")
                    return permInt & 0x8 || permInt & 0x20
                })

                setGuilds(filteredGuilds)
            } catch (error) {
                console.error("Error fetching guilds:", error)
            } finally {
                setIsLoading(false)
            }
        }

        checkSession()
        getGuilds()
    }, [router, supabase])

    const getServerIcon = (guild: DiscordPartialGuild) => {
        if (!guild.icon) return null
        return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
    }

    const hasAdminPermissions = (permissions: string | undefined) => {
        if (!permissions) return false
        const permInt = Number.parseInt(permissions)
        return !!(permInt & 0x8) 
    }

    const canManageServer = (permissions: string | undefined) => {
        if (!permissions) return false
        const permInt = Number.parseInt(permissions)
        return !!(permInt & 0x20) 
    }

    const formatPermissions = (permissions: string | undefined) => {
        if (!permissions) return "Member"
        const permInt = Number.parseInt(permissions)
        if (permInt & 0x8) return "Administrator" 
        if (permInt & 0x20) return "Manage Server" 
        return "Member"
    }

    const filteredGuilds = guilds?.filter((guild) => guild.name.toLowerCase().includes(searchQuery.toLowerCase()))

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
            },
        },
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <ServerCrash className="h-16 w-16 text-primary animate-pulse" />
                <h3 className="text-xl font-semibold">Loading your servers...</h3>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <motion.div
            className="space-y-8 max-w-6xl mx-auto px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* User Profile Section */}
            <motion.div
                className="flex flex-col items-center text-center pt-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <Avatar className="h-24 w-24 border-4 border-primary mb-4">
                    <AvatarImage src={user?.user_metadata?.avatar_url || ""} alt={user?.user_metadata?.full_name || "User"} />
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                        {user?.user_metadata?.full_name?.charAt(0) || "U"}
                    </AvatarFallback>
                </Avatar>

                <h1 className="text-2xl font-bold mb-1">{user?.user_metadata?.full_name || "Discord User"}</h1>

                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <UserIcon className="h-4 w-4" />
                    <span>{user?.user_metadata?.name || user?.email || "Unknown User"}</span>
                </div>

                <div className="flex items-center gap-3 mb-4">
                    <Badge variant="outline" className="flex items-center gap-1">
                        <Hash className="h-3 w-3" />
                        {user?.user_metadata?.provider_id || "Unknown ID"}
                    </Badge>
                    <Badge variant="secondary">Discord User</Badge>
                    {user?.app_metadata?.provider === "discord" && (
                        <Badge className="bg-[#5865F2] hover:bg-[#4752C4]">{user.user_metadata.provider_id == "953708302058012702" ? "Developer/Admin" : "User"}</Badge>
                    )}
                </div>
            </motion.div>

            {/* Title Section */}
            <motion.div
                className="flex flex-col items-center text-center mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <div className="flex items-center gap-3 mb-2">
                    <Bot className="h-8 w-8 text-primary" />
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-500 text-transparent bg-clip-text">
                        Command Your Discord Universe
                    </h2>
                </div>
                <p className="text-muted-foreground max-w-md">
                    {user?.user_metadata?.full_name || "You"} {" "}
                    has  management access to {guilds?.length || 0} {guilds?.length === 1 ? "server" : "servers"}
                </p>
            </motion.div>

            <Separator className="my-8" />

            {/* Search Section */}
            <motion.div
                className="flex justify-center mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search servers..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </motion.div>

            {/* Server Grid */}
            {filteredGuilds && filteredGuilds.length > 0 ? (
                <motion.div
                    className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {filteredGuilds.map((guild) => {
                        const isAdmin = hasAdminPermissions(guild.permissions)
                        const canManage = canManageServer(guild.permissions)

                        return (
                            <motion.div
                                key={guild.id}
                                variants={itemVariants}
                                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                                className={isAdmin ? "relative" : ""}
                            >
                                {isAdmin && (
                                    <div className="absolute -top-2 -right-2 z-10">
                                        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                                            Admin
                                        </Badge>
                                    </div>
                                )}
                                <Card
                                    className={`overflow-hidden transition-all duration-300 ${isAdmin
                                            ? "border-amber-500/50 shadow-lg shadow-amber-500/10"
                                            : canManage
                                                ? "border-blue-500/30 hover:border-blue-500/50"
                                                : "hover:shadow-md"
                                        }`}
                                >
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center gap-3">
                                            <Avatar className={`h-12 w-12 border-2 ${isAdmin ? "border-amber-500" : "border-border"}`}>
                                                {getServerIcon(guild) ? (
                                                    <AvatarImage src={getServerIcon(guild) || ""} alt={guild.name} />
                                                ) : (
                                                    <AvatarFallback
                                                        className={`${isAdmin ? "bg-amber-500/10 text-amber-500" : "bg-primary/10 text-primary"}`}
                                                    >
                                                        {guild.name.charAt(0)}
                                                    </AvatarFallback>
                                                )}
                                            </Avatar>
                                            <div>
                                                <CardTitle className="text-lg flex items-center gap-2">
                                                    {guild.name}
                                                    {guild.owner && <Crown className="h-4 w-4 text-amber-500"/>}
                                                </CardTitle>
                                                <CardDescription className="flex items-center gap-1">
                                                    <Users className="h-3 w-3" />
                                                    {guild.approximate_member_count ? guild.approximate_member_count.toLocaleString() : "Unknown"}{" "}
                                                    members
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pb-2">
                                        <div className="flex flex-wrap gap-2">
                                            <Badge variant={isAdmin ? "default" : "outline"} className="flex items-center gap-1">
                                                <Shield className="h-3 w-3" />
                                                {formatPermissions(guild.permissions)}
                                            </Badge>
                                            {guild.approximate_presence_count && (
                                                <Badge variant="secondary" className="flex items-center gap-1">
                                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                                    {guild.approximate_presence_count.toLocaleString()} online
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="mt-2 text-xs text-muted-foreground truncate">ID: {guild.id}</div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button
                                            asChild
                                            className={`w-full ${isAdmin
                                                    ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                                                    : ""
                                                }`}
                                        >
                                            <Link href={`/dashboard/servers/${guild.id}`}>Manage Server</Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        )
                    })}
                </motion.div>
            ) : (
                <motion.div
                    className="text-center py-12 border rounded-lg"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="mx-auto h-12 w-12 text-muted-foreground mb-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium mb-2">No servers found</h3>
                    <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                        {searchQuery
                            ? `No servers match "${searchQuery}". Try a different search term.`
                            : `You don't have permission to manage any Discord servers, or you haven't granted the necessary permissions.`}
                    </p>
                    <Button onClick={() => router.push("/")}>Return to Home</Button>
                </motion.div>
            )}
        </motion.div>
    )
}
