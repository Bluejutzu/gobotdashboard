"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { AlertCircle, Clock, Eye, Filter, RefreshCw, Search, Trash2, User } from "lucide-react"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { deleteModerationCase, getModerationCases } from "@/lib/redis-service/moderation-service"
import type { ModerationCase } from "@/lib/types/types"

interface ModerationCasesProps {
    serverId: string
}

export function ModerationCases({ serverId }: ModerationCasesProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [actionFilter, setActionFilter] = useState("all")
    const [showFilters, setShowFilters] = useState(false)
    const [cases, setCases] = useState<ModerationCase[]>([])
    const [refreshing, setRefreshing] = useState(false)

    const fetchCases = useCallback(async () => {
        try {
            setLoading(true)
            const data = await getModerationCases(serverId)
            setCases(data)
        } catch (error) {
            console.error("Error fetching moderation cases:", error)
            toast.error("Error", {
                description: "Failed to load moderation cases. Please try again.",
            })
        } finally {
            setLoading(false)
        }
    }, [serverId])

    useEffect(() => {
        fetchCases()
    }, [serverId, fetchCases])


    const handleDeleteCase = async (caseId: string) => {
        try {
            await deleteModerationCase(caseId)
            setCases(cases.filter((c) => c.id !== caseId))

            toast.success("Case deleted", {
                description: `Case #${caseId} has been deleted.`,
            })
        } catch (error) {
            console.error("Error deleting case:", error)
            toast.error("Error", {
                description: "Failed to delete case. Please try again.",
            })
        }
    }

    const viewCase = (caseId: string) => {
        router.push(`/dashboard/servers/${serverId}/moderation/cases/${caseId}`)
    }

    const refreshCases = async () => {
        try {
            setRefreshing(true)
            await fetchCases()
            toast.success("Cases refreshed", {
                description: "The moderation cases list has been updated.",
            })
        } catch (error) {
            console.error("Error refreshing cases:", error)
            toast.error("Error", {
                description: "Failed to refresh cases. Please try again.",
            })
        } finally {
            setRefreshing(false)
        }
    }

    const getActionColor = (action: string) => {
        switch (action) {
            case "warn":
                return "bg-yellow-600"
            case "mute":
                return "bg-orange-600"
            case "kick":
                return "bg-red-600"
            case "ban":
                return "bg-purple-600"
            case "unban":
                return "bg-green-600"
            default:
                return "bg-blue-600"
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active":
                return "bg-green-600"
            case "resolved":
                return "bg-blue-600"
            case "appealed":
                return "bg-yellow-600"
            case "expired":
                return "bg-gray-600"
            default:
                return "bg-gray-600"
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString() + " " + date.toLocaleTimeString()
    }

    const filteredCases = cases.filter((c) => {
        const matchesSearch =
            c.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.reason?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "all" || c.status === statusFilter
        const matchesAction = actionFilter === "all" || c.action === actionFilter

        return matchesSearch && matchesStatus && matchesAction
    })

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Search by username or reason..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 bg-[#232530] border-[#3a3c47] text-white"
                    />
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setShowFilters(!showFilters)}
                        className={`bg-[#232530] border-[#3a3c47] text-white hover:bg-[#2a2c37] ${showFilters ? "border-blue-500" : ""}`}
                    >
                        <Filter className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={refreshCases}
                        disabled={loading || refreshing}
                        className="bg-[#232530] border-[#3a3c47] text-white hover:bg-[#2a2c37]"
                    >
                        <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                    </Button>
                </div>
            </div>

            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col sm:flex-row gap-4 overflow-hidden"
                    >
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-[180px] bg-[#232530] border-[#3a3c47] text-white">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#232530] border-[#3a3c47]">
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                                <SelectItem value="appealed">Appealed</SelectItem>
                                <SelectItem value="expired">Expired</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={actionFilter} onValueChange={setActionFilter}>
                            <SelectTrigger className="w-full sm:w-[180px] bg-[#232530] border-[#3a3c47] text-white">
                                <SelectValue placeholder="Filter by action" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#232530] border-[#3a3c47]">
                                <SelectItem value="all">All Actions</SelectItem>
                                <SelectItem value="warn">Warn</SelectItem>
                                <SelectItem value="mute">Mute</SelectItem>
                                <SelectItem value="kick">Kick</SelectItem>
                                <SelectItem value="ban">Ban</SelectItem>
                                <SelectItem value="unban">Unban</SelectItem>
                            </SelectContent>
                        </Select>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-3">
                {loading ? (
                    <>
                        <CaseSkeleton />
                        <CaseSkeleton />
                        <CaseSkeleton />
                    </>
                ) : filteredCases.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#232530] rounded-md p-6 text-center"
                    >
                        <AlertCircle className="mx-auto h-8 w-8 text-gray-500 mb-2" />
                        <h3 className="text-lg font-medium text-white">No cases found</h3>
                        <p className="text-gray-400 mt-1">
                            {searchTerm || statusFilter !== "all" || actionFilter !== "all"
                                ? "Try adjusting your filters"
                                : "No moderation cases have been created yet"}
                        </p>
                    </motion.div>
                ) : (
                    <AnimatePresence>
                        {filteredCases.map((c, index) => (
                            <motion.div
                                key={c.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card className="bg-[#232530] border-[#3a3c47] overflow-hidden hover:bg-[#2a2c37] transition-colors">
                                    <CardContent className="p-0">
                                        <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10 border border-[#3a3c47]">
                                                    <AvatarImage src={c.avatar || `/placeholder.svg?height=40&width=40`} />
                                                    <AvatarFallback className="bg-[#3a3c47] text-white">
                                                        {c.username?.substring(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h4 className="font-medium text-white">{c.username || "Unknown"}</h4>
                                                        <Badge className={`${getActionColor(c.action || "warn")} text-white`}>{c.action || "warn"}</Badge>
                                                        <Badge className={`${getStatusColor(c.status || "active")} text-white`}>{c.status || "active"}</Badge>
                                                        {c.duration && (
                                                            <Badge variant="outline" className="bg-[#1a1c23] text-gray-300 border-[#3a3c47]">
                                                                {c.duration}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-400 mt-1 line-clamp-1">{c.reason}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 ml-auto">
                                                <div className="text-right text-sm text-gray-400 mr-2 hidden md:block">
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        <span>{formatDate(c.timestamp)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 mt-1">
                                                        <User className="h-3 w-3" />
                                                        <span>By {c.moderator_name}</span>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => viewCase(c.id)}
                                                    className="text-gray-400 hover:text-blue-500 hover:bg-blue-500/10"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDeleteCase(c.id)}
                                                    className="text-gray-400 hover:text-red-500 hover:bg-red-500/10"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    )
}

function CaseSkeleton() {
    return (
        <Card className="bg-[#232530] border-[#3a3c47]">
            <CardContent className="p-4">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full bg-[#2a2c37]" />
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-5 w-32 bg-[#2a2c37]" />
                            <Skeleton className="h-5 w-16 rounded-full bg-[#2a2c37]" />
                        </div>
                        <Skeleton className="h-4 w-full max-w-md bg-[#2a2c37]" />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-8 w-8 rounded-md bg-[#2a2c37]" />
                        <Skeleton className="h-8 w-8 rounded-md bg-[#2a2c37]" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
