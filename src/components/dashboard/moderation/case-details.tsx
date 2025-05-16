"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { AlertTriangle, Ban, CheckCircle, Clock, MessageSquare, RefreshCw, Save, Shield, Timer, Trash2, User } from 'lucide-react'
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    ModerationCase,
    ModerationStatus,
    deleteModerationCase,
    getModerationCase,
    updateModerationCase
} from "@/lib/api/moderation"

interface CaseDetailProps {
    serverId: string
    caseId: string
}

export function CaseDetail({ serverId, caseId }: CaseDetailProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [caseData, setCaseData] = useState<ModerationCase | null>(null)
    const [editMode, setEditMode] = useState(false)

    // Edit form state
    const [editReason, setEditReason] = useState("")
    const [editStatus, setEditStatus] = useState<ModerationStatus>("active")
    const [editDuration, setEditDuration] = useState("")

    useEffect(() => {
        const fetchCase = async () => {
            try {
                setLoading(true)
                const data = await getModerationCase(caseId)
                setCaseData(data)
                setEditReason(data.reason)
                setEditStatus(data.status)
                setEditDuration(data.duration || "")
            } catch (error) {
                console.error("Error fetching case:", error)
                toast.error("Error", {
                    description: "Failed to load case details. Please try again.",
                })
            } finally {
                setLoading(false)
            }
        }

        fetchCase()
    }, [caseId])

    const handleSave = async () => {
        if (!caseData) return

        try {
            setSaving(true)

            await updateModerationCase(caseId, {
                reason: editReason,
                status: editStatus,
                duration: editDuration || undefined,
            })

            // Update local state
            setCaseData({
                ...caseData,
                reason: editReason,
                status: editStatus,
                duration: editDuration || undefined,
            })

            setEditMode(false)

            toast.success("Case updated", {
                description: `Case #${caseId} has been updated successfully.`,
            })
        } catch (error) {
            console.error("Error updating case:", error)
            toast.error("Error", {
                description: "Failed to update case. Please try again.",
            })
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        try {
            await deleteModerationCase(caseId)

            toast.success("Case deleted", {
                description: `Case #${caseId} has been permanently deleted.`,
            })

            // Navigate back to moderation page
            router.push(`/dashboard/servers/${serverId}/moderation`)
        } catch (error) {
            console.error("Error deleting case:", error)
            toast.error("Error", {
                description: "Failed to delete case. Please try again.",
            })
        }
    }

    const handleUnban = async () => {
        if (!caseData) return

        try {
            setSaving(true)

            await updateModerationCase(caseId, {
                status: "resolved",
            })

            // Update local state
            setCaseData({
                ...caseData,
                status: "resolved",
            })
            setEditStatus("resolved")

            toast.success("User unbanned", {
                description: `${caseData.username} has been unbanned from the server.`,
            })
        } catch (error) {
            console.error("Error unbanning user:", error)
            toast.error("Error", {
                description: "Failed to unban user. Please try again.",
            })
        } finally {
            setSaving(false)
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

    const getActionIcon = (action: string) => {
        switch (action) {
            case "warn":
                return <AlertTriangle className="h-5 w-5 text-yellow-500" />
            case "mute":
                return <MessageSquare className="h-5 w-5 text-orange-500" />
            case "kick":
                return <Ban className="h-5 w-5 text-red-500" />
            case "ban":
                return <Ban className="h-5 w-5 text-purple-500" />
            case "unban":
                return <CheckCircle className="h-5 w-5 text-green-500" />
            default:
                return <Shield className="h-5 w-5 text-blue-500" />
        }
    }

    if (loading || !caseData) {
        return null // Skeleton is shown via Suspense
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center gap-4"
                >
                    <Avatar className="h-12 w-12 border border-[#3a3c47]">
                        <AvatarImage src={caseData.avatar || `/placeholder.svg?height=48&width=48`} />
                        <AvatarFallback className="bg-[#3a3c47] text-white">
                            {caseData.username.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="text-xl font-bold text-white">{caseData.username}</h2>
                        <p className="text-sm text-gray-400">User ID: {caseData.userId}</p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap gap-2"
                >
                    <Badge className={`${getActionColor(caseData.action)} text-white px-3 py-1.5`}>
                        {getActionIcon(caseData.action)}
                        <span className="ml-1">{caseData.action}</span>
                    </Badge>

                    <Badge className={`${getStatusColor(caseData.status)} text-white px-3 py-1.5`}>
                        {caseData.status}
                    </Badge>

                    {caseData.duration && (
                        <Badge variant="outline" className="bg-[#232530] text-gray-300 border-[#3a3c47] px-3 py-1.5">
                            <Timer className="h-3.5 w-3.5 mr-1" />
                            {caseData.duration}
                        </Badge>
                    )}
                </motion.div>
            </div>

            <Separator className="bg-[#3a3c47]" />

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
            >
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-white">Case Details</h3>
                    {!editMode && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditMode(true)}
                            className="bg-[#232530] border-[#3a3c47] text-white hover:bg-[#2a2c37]"
                        >
                            Edit Details
                        </Button>
                    )}
                </div>

                {editMode ? (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Reason</label>
                            <Textarea
                                value={editReason}
                                onChange={(e) => setEditReason(e.target.value)}
                                className="bg-[#232530] border-[#3a3c47] text-white min-h-[100px]"
                                placeholder="Enter reason for moderation action"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Status</label>
                                <Select
                                    value={editStatus}
                                    onValueChange={(value: ModerationStatus) => setEditStatus(value)}
                                >
                                    <SelectTrigger className="bg-[#232530] border-[#3a3c47] text-white">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#232530] border-[#3a3c47]">
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="resolved">Resolved</SelectItem>
                                        <SelectItem value="appealed">Appealed</SelectItem>
                                        <SelectItem value="expired">Expired</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {(caseData.action === "ban" || caseData.action === "mute") && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Duration</label>
                                    <Input
                                        value={editDuration}
                                        onChange={(e) => setEditDuration(e.target.value)}
                                        className="bg-[#232530] border-[#3a3c47] text-white"
                                        placeholder="e.g. 7 days, Permanent"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setEditMode(false)}
                                className="bg-transparent border-[#3a3c47] text-white hover:bg-[#232530]"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={saving}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                {saving ? (
                                    <>
                                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-[#232530] p-4 rounded-md border border-[#3a3c47]"
                    >
                        <p className="text-gray-300 whitespace-pre-line">{caseData.reason}</p>
                    </motion.div>
                )}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
                <div className="bg-[#232530] p-4 rounded-md border border-[#3a3c47]">
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Moderator</h4>
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-white">{caseData.moderatorName}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">ID: {caseData.moderatorId}</p>
                </div>

                <div className="bg-[#232530] p-4 rounded-md border border-[#3a3c47]">
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Timestamp</h4>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-white">{formatDate(caseData.timestamp)}</span>
                    </div>
                    {caseData.expiresAt && (
                        <div className="flex items-center gap-2 mt-2">
                            <Timer className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-300">Expires: {formatDate(caseData.expiresAt)}</span>
                        </div>
                    )}
                </div>
            </motion.div>

            <Separator className="bg-[#3a3c47]" />

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex justify-between"
            >
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="outline"
                            className="bg-transparent border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-400"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Case
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-[#1a1c23] border-[#3a3c47]">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-white">Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-400">
                                This action cannot be undone. This will permanently delete the moderation case
                                from the server records.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="bg-transparent border-[#3a3c47] text-white hover:bg-[#232530]">
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDelete}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {caseData.action === "ban" && caseData.status === "active" && (
                    <Button
                        onClick={handleUnban}
                        disabled={saving}
                        className="bg-green-600 hover:bg-green-700 text-white"
                    >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Unban User
                    </Button>
                )}
            </motion.div>
        </motion.div>
    )
}
