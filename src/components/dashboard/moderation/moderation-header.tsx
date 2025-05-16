"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { AlertTriangle, Info, Shield } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface ModerationHeaderProps {
    serverId: string
}

export function ModerationHeader({ serverId }: ModerationHeaderProps) {
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        totalCases: 0,
        activeBans: 0,
        activeMutes: 0,
        lastDay: 0,
    })

    useEffect(() => {
        // Simulate fetching server moderation stats
        const fetchStats = async () => {
            await new Promise((resolve) => setTimeout(resolve, 1200))
            setStats({
                totalCases: 124,
                activeBans: 8,
                activeMutes: 3,
                lastDay: 12,
            })
            setLoading(false)
        }

        fetchStats()
    }, [serverId])

    return (
        <div className="space-y-4">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-white">
                        <Shield className="h-6 w-6 text-blue-500" />
                        Server Moderation
                    </h1>
                    <p className="text-muted-foreground mt-1 text-gray-400">
                        Configure moderation settings and manage cases for your server
                    </p>
                </div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-3 py-1.5">
                        <Info className="mr-1 h-3.5 w-3.5" />
                        Moderation v0.1 (UI/UX is subject to change)
                    </Badge>
                </motion.div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {loading ? (
                    <>
                        <Skeleton className="h-24 rounded-lg bg-[#232530]" />
                        <Skeleton className="h-24 rounded-lg bg-[#232530]" />
                        <Skeleton className="h-24 rounded-lg bg-[#232530]" />
                        <Skeleton className="h-24 rounded-lg bg-[#232530]" />
                    </>
                ) : (
                    <>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Card className="bg-gradient-to-br from-[#2a2c37] to-[#1a1c23] border-[#3a3c47]">
                                <CardContent className="p-6">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-400">Total Cases</span>
                                        <span className="text-2xl font-bold text-white mt-1">{stats.totalCases}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card className="bg-gradient-to-br from-[#2a2c37] to-[#1a1c23] border-[#3a3c47]">
                                <CardContent className="p-6">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-400">Active Bans</span>
                                        <span className="text-2xl font-bold text-white mt-1">{stats.activeBans}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Card className="bg-gradient-to-br from-[#2a2c37] to-[#1a1c23] border-[#3a3c47]">
                                <CardContent className="p-6">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-400">Active Mutes</span>
                                        <span className="text-2xl font-bold text-white mt-1">{stats.activeMutes}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Card className="bg-gradient-to-br from-[#2a2c37] to-[#1a1c23] border-[#3a3c47]">
                                <CardContent className="p-6">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-400">Last 24 Hours</span>
                                        <span className="text-2xl font-bold text-white mt-1">{stats.lastDay}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </>
                )}
            </div>

            {!loading && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                    <Card className="bg-[#232530] border-yellow-500/20">
                        <CardContent className="p-4 flex items-center gap-3">
                            <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                            <p className="text-sm text-gray-300">
                                Changes to moderation settings may take up to 5 minutes to fully propagate across all channels.
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </div>
    )
}
