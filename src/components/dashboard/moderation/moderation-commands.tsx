"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Command, RefreshCw, Save } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

type CommandType = {
    id: string
    name: string
    description: string
    usage: string
    example: string
    permission: "everyone" | "moderator" | "admin"
    enabled: boolean
    cooldown: number
}

export function ModerationCommands({ serverId }: { serverId: string }) {
    const [saving, setSaving] = useState(false)
    const [prefix, setPrefix] = useState("!")
    const [reloading, setReloading] = useState(false)

    // Mock data for commands
    const [commands, setCommands] = useState<CommandType[]>([
        {
            id: "1",
            name: "warn",
            description: "Warn a user for breaking server rules",
            usage: "warn <user> <reason>",
            example: "warn @User Spamming in #general",
            permission: "moderator",
            enabled: true,
            cooldown: 5,
        },
        {
            id: "2",
            name: "mute",
            description: "Temporarily mute a user",
            usage: "mute <user> <duration> <reason>",
            example: "mute @User 1h Excessive caps",
            permission: "moderator",
            enabled: true,
            cooldown: 5,
        },
        {
            id: "3",
            name: "kick",
            description: "Kick a user from the server",
            usage: "kick <user> <reason>",
            example: "kick @User Advertising",
            permission: "moderator",
            enabled: true,
            cooldown: 10,
        },
        {
            id: "4",
            name: "ban",
            description: "Ban a user from the server",
            usage: "ban <user> <reason>",
            example: "ban @User NSFW content",
            permission: "admin",
            enabled: true,
            cooldown: 15,
        },
        {
            id: "5",
            name: "purge",
            description: "Delete multiple messages at once",
            usage: "purge <amount>",
            example: "purge 10",
            permission: "moderator",
            enabled: true,
            cooldown: 10,
        },
    ])

    const toggleCommand = (id: string) => {
        setCommands(commands.map((cmd) => (cmd.id === id ? { ...cmd, enabled: !cmd.enabled } : cmd)))
    }

    const updateCommandPermission = (id: string, permission: "everyone" | "moderator" | "admin") => {
        setCommands(commands.map((cmd) => (cmd.id === id ? { ...cmd, permission } : cmd)))
    }

    const updateCommandCooldown = (id: string, cooldown: number) => {
        setCommands(commands.map((cmd) => (cmd.id === id ? { ...cmd, cooldown } : cmd)))
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const response = await fetch('/api/commands', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    commands: commands.map(cmd => ({
                        name: cmd.name,
                        description: cmd.description,
                        options: [
                            {
                                name: 'user',
                                description: 'The user to target',
                                type: 'user',
                                required: true
                            },
                            {
                                name: 'reason',
                                description: 'The reason for the action',
                                type: 'string',
                                required: true
                            }
                        ]
                    })),
                    serverId
                })
            })

            if (!response.ok) {
                throw new Error('Failed to save commands')
            }

            toast.success('Commands saved successfully')
        } catch (error) {
            console.error('Error saving commands:', error)
            toast.error('Failed to save commands')
        } finally {
            setSaving(false)
        }
    }

    const handleReload = async () => {
        setReloading(true)
        try {
            const response = await fetch('/api/commands/reload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ serverId })
            })

            if (!response.ok) {
                throw new Error('Failed to reload commands')
            }

            toast.success('Commands reloaded successfully')
        } catch (error) {
            console.error('Error reloading commands:', error)
            toast.error('Failed to reload commands')
        } finally {
            setReloading(false)
        }
    }

    const getPermissionColor = (permission: string) => {
        switch (permission) {
            case "everyone":
                return "bg-green-600"
            case "moderator":
                return "bg-blue-600"
            case "admin":
                return "bg-purple-600"
            default:
                return "bg-gray-600"
        }
    }

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    }

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
            <motion.div variants={item}>
                <Alert className="bg-[#2b2d3a] border-blue-500/50">
                    <Command className="h-4 w-4 text-blue-500" />
                    <AlertTitle className="text-blue-500">Moderation Commands</AlertTitle>
                    <AlertDescription className="text-gray-300">
                        Configure and manage moderation commands for your server.
                    </AlertDescription>
                </Alert>
            </motion.div>

            <motion.div variants={item}>
                <div className="bg-[#232530] p-4 rounded-md border border-[#3a3c47]">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                        <div className="space-y-2 flex-1">
                            <Label htmlFor="prefix" className="text-white">
                                Command Prefix
                            </Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    id="prefix"
                                    value={prefix}
                                    onChange={(e) => setPrefix(e.target.value)}
                                    className="w-20 bg-[#1a1c23] border-[#3a3c47] text-white"
                                />
                                <span className="text-gray-400">Example: {prefix}warn @User Breaking rules</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={handleReload}
                                disabled={reloading}
                            >
                                <RefreshCw className={`w-4 h-4 mr-2 ${reloading ? 'animate-spin' : ''}`} />
                                Reload Commands
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={saving}
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="space-y-3">
                <Accordion type="multiple" className="w-full">
                    {commands.map((cmd, index) => (
                        <motion.div key={cmd.id} variants={item} custom={index} transition={{ delay: 0.2 + index * 0.1 }}>
                            <AccordionItem value={cmd.id} className="border-[#3a3c47]">
                                <AccordionTrigger className="text-white hover:text-white hover:no-underline py-4 px-4 bg-[#2b2d3a] rounded-t-md">
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-blue-400">
                                            {prefix}
                                            {cmd.name}
                                        </span>
                                        <Badge className={`${getPermissionColor(cmd.permission)} text-white`}>{cmd.permission}</Badge>
                                        {!cmd.enabled && <Badge className="bg-gray-600 text-white">Disabled</Badge>}
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="bg-[#232530] p-4 rounded-b-md border-t border-[#3a3c47]">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="font-medium text-white">Enable Command</h4>
                                                <p className="text-sm text-gray-400">Toggle this command on/off</p>
                                            </div>
                                            <Switch
                                                checked={cmd.enabled}
                                                onCheckedChange={() => toggleCommand(cmd.id)}
                                                className="data-[state=checked]:bg-blue-600"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-white">Required Permission</Label>
                                                <Select
                                                    value={cmd.permission}
                                                    onValueChange={(value: "everyone" | "moderator" | "admin") =>
                                                        updateCommandPermission(cmd.id, value)
                                                    }
                                                >
                                                    <SelectTrigger className="bg-[#1a1c23] border-[#3a3c47] text-white">
                                                        <SelectValue placeholder="Select permission" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-[#1a1c23] border-[#3a3c47]">
                                                        <SelectItem value="everyone">Everyone</SelectItem>
                                                        <SelectItem value="moderator">Moderator</SelectItem>
                                                        <SelectItem value="admin">Admin</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-white">Cooldown (seconds)</Label>
                                                <Input
                                                    type="number"
                                                    value={cmd.cooldown}
                                                    onChange={(e) => updateCommandCooldown(cmd.id, Number.parseInt(e.target.value) || 0)}
                                                    min={0}
                                                    max={300}
                                                    className="bg-[#1a1c23] border-[#3a3c47] text-white"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <h4 className="font-medium text-white">Description</h4>
                                            <p className="text-gray-300">{cmd.description}</p>
                                        </div>

                                        <div className="space-y-2">
                                            <h4 className="font-medium text-white">Usage</h4>
                                            <p className="font-mono text-sm bg-[#1a1c23] p-2 rounded-md text-blue-400">
                                                {prefix}
                                                {cmd.usage}
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <h4 className="font-medium text-white">Example</h4>
                                            <p className="font-mono text-sm bg-[#1a1c23] p-2 rounded-md text-blue-400">
                                                {prefix}
                                                {cmd.example}
                                            </p>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </motion.div>
                    ))}
                </Accordion>
            </div>
        </motion.div>
    )
}
