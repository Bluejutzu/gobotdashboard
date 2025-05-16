"use client"

import { useState } from "react"
import { AlertTriangle, Flag, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"

type FlagType = {
    id: string
    name: string
    pattern: string
    type: "keyword" | "regex"
    severity: "low" | "medium" | "high"
    enabled: boolean
}

export function CustomFlagging({  }: { serverId: string }) {    
    const [flags, setFlags] = useState<FlagType[]>([
        {
            id: "1",
            name: "Invite Links",
            pattern: "discord.gg",
            type: "keyword",
            severity: "medium",
            enabled: true,
        },
        {
            id: "2",
            name: "IP Grabbers",
            pattern: "(grabify|iplogger)",
            type: "regex",
            severity: "high",
            enabled: true,
        },
        {
            id: "3",
            name: "Suspicious URLs",
            pattern: "bit.ly|tinyurl",
            type: "keyword",
            severity: "low",
            enabled: false,
        },
    ])

    const [newFlag, setNewFlag] = useState<Omit<FlagType, "id">>({
        name: "",
        pattern: "",
        type: "keyword",
        severity: "medium",
        enabled: true,
    })

    const [dialogOpen, setDialogOpen] = useState(false)

    const addFlag = () => {
        const id = Math.random().toString(36).substring(2, 9)
        setFlags([...flags, { ...newFlag, id }])
        setNewFlag({
            name: "",
            pattern: "",
            type: "keyword",
            severity: "medium",
            enabled: true,
        })
        setDialogOpen(false)

        toast.success(`Your custom flag "${newFlag.name}" has been created.`, {
            description: `Your custom flag "${newFlag.name}" has been created.`,
        })
    }

    const toggleFlag = (id: string) => {
        setFlags(flags.map((flag) => (flag.id === id ? { ...flag, enabled: !flag.enabled } : flag)))

        const flag = flags.find((f) => f.id === id)
        if (flag) {
            toast.success(flag.enabled ? "Flag disabled" : "Flag enabled", {
                description: `Your custom flag "${flag.name}" has been ${flag.enabled ? "disabled" : "enabled"}.`,
            })
        }
    }

    const deleteFlag = (id: string) => {
        const flag = flags.find((f) => f.id === id)
        setFlags(flags.filter((flag) => flag.id !== id))

        if (flag) {
            toast.success(`Your custom flag "${flag.name}" has been deleted.`, {
                description: `Your custom flag "${flag.name}" has been deleted.`,
            })
        }
    }

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case "low":
                return "bg-yellow-600"
            case "medium":
                return "bg-orange-600"
            case "high":
                return "bg-red-600"
            default:
                return "bg-blue-600"
        }
    }

    return (
        <div className="space-y-6">
            <Alert className="bg-[#2b2d3a] border-yellow-500/50">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <AlertTitle className="text-yellow-500">Custom flagging</AlertTitle>
                <AlertDescription className="text-gray-300">
                    Create custom flags to detect specific content in your server.
                </AlertDescription>
            </Alert>

            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-white">Custom Flags</h3>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Flag
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#1a1c23] text-white border-[#3a3c47]">
                        <DialogHeader>
                            <DialogTitle>Create Custom Flag</DialogTitle>
                            <DialogDescription className="text-gray-400">
                                Create a new custom flag to detect specific content.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Flag Name</Label>
                                <Input
                                    id="name"
                                    value={newFlag.name}
                                    onChange={(e) => setNewFlag({ ...newFlag, name: e.target.value })}
                                    className="bg-[#232530] border-[#3a3c47]"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="pattern">Pattern</Label>
                                <Input
                                    id="pattern"
                                    value={newFlag.pattern}
                                    onChange={(e) => setNewFlag({ ...newFlag, pattern: e.target.value })}
                                    className="bg-[#232530] border-[#3a3c47]"
                                />
                                <p className="text-xs text-gray-500">
                                    {newFlag.type === "keyword"
                                        ? "Separate multiple keywords with | (pipe)"
                                        : "Enter a valid regular expression"}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="type">Type</Label>
                                    <Select
                                        value={newFlag.type}
                                        onValueChange={(value: "keyword" | "regex") => setNewFlag({ ...newFlag, type: value })}
                                    >
                                        <SelectTrigger className="bg-[#232530] border-[#3a3c47]">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#232530] border-[#3a3c47]">
                                            <SelectItem value="keyword">Keyword</SelectItem>
                                            <SelectItem value="regex">Regex</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="severity">Severity</Label>
                                    <Select
                                        value={newFlag.severity}
                                        onValueChange={(value: "low" | "medium" | "high") => setNewFlag({ ...newFlag, severity: value })}
                                    >
                                        <SelectTrigger className="bg-[#232530] border-[#3a3c47]">
                                            <SelectValue placeholder="Select severity" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#232530] border-[#3a3c47]">
                                            <SelectItem value="low">Low</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setDialogOpen(false)}
                                className="bg-transparent border-[#3a3c47] text-white hover:bg-[#232530]"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={addFlag}
                                disabled={!newFlag.name || !newFlag.pattern}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                Create Flag
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="space-y-3">
                {flags.length === 0 ? (
                    <div className="bg-[#232530] rounded-md p-6 text-center">
                        <Flag className="mx-auto h-8 w-8 text-gray-500 mb-2" />
                        <h3 className="text-lg font-medium text-white">No custom flags</h3>
                        <p className="text-gray-400 mt-1">Create your first custom flag to get started.</p>
                    </div>
                ) : (
                    flags.map((flag) => (
                        <Card key={flag.id} className="bg-[#232530] border-[#3a3c47]">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Switch
                                            checked={flag.enabled}
                                            onCheckedChange={() => toggleFlag(flag.id)}
                                            className="data-[state=checked]:bg-blue-600"
                                        />
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-medium text-white">{flag.name}</h4>
                                                <Badge className={`${getSeverityColor(flag.severity)} text-white`}>{flag.severity}</Badge>
                                                <Badge className="bg-[#3a3c47] text-white">{flag.type}</Badge>
                                            </div>
                                            <p className="text-sm text-gray-400 mt-1">
                                                Pattern: <code className="bg-[#1a1c23] px-1 py-0.5 rounded text-xs">{flag.pattern}</code>
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => deleteFlag(flag.id)}
                                        className="text-gray-400 hover:text-red-500 hover:bg-red-500/10"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
