"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { AlertCircle, Save, ShieldCheck, RefreshCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    getAutoModerationSettings,
    updateAutoModerationSettings,
    type AutoModerationSettings,
} from "@/lib/api/moderation"
import { toast } from "sonner"

export function AutoModeration({ serverId }: { serverId: string }) {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [settings, setSettings] = useState<AutoModerationSettings>({
        profanityFilter: true,
        profanityLevel: 2,
        profanityAction: "delete",
        spamProtection: true,
        spamThreshold: 5,
        spamAction: "mute",
        linkFilter: false,
        linkAction: "delete",
        mentionProtection: true,
        mentionAction: "warn",
        capsFilter: false,
        capsAction: "warn",
    })

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                setLoading(true)
                const data = await getAutoModerationSettings(serverId)
                setSettings(data)
            } catch (error) {
                console.error("Error fetching auto-moderation settings:", error)
                toast.error("Error", {
                    description: "Failed to load auto-moderation settings. Using defaults.",
                })
            } finally {
                setLoading(false)
            }
        }

        fetchSettings()
    }, [serverId])

    const saveSettings = async () => {
        try {
            setSaving(true)
            await updateAutoModerationSettings(serverId, settings)
            
            toast.success("Settings saved", {
                description: "Your auto-moderation settings have been updated.",
            })
        } catch (error) {
            console.error("Error saving auto-moderation settings:", error)
            toast.error("Error", {
                description: "Failed to save settings. Please try again.",
            })
        } finally {
            setSaving(false)
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

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <Skeleton className="h-20 w-full bg-[#232530]" />
                <Skeleton className="h-40 w-full bg-[#232530]" />
                <Skeleton className="h-40 w-full bg-[#232530]" />
                <div className="flex justify-end">
                    <Skeleton className="h-10 w-32 bg-[#232530]" />
                </div>
            </div>
        )
    }

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
            <motion.div variants={item}>
                <Alert className="bg-[#2b2d3a] border-blue-500/50">
                    <AlertCircle className="h-4 w-4 text-blue-500" />
                    <AlertTitle className="text-blue-500">Auto-moderation is active</AlertTitle>
                    <AlertDescription className="text-gray-300">
                        Sapphire will automatically moderate your server based on these settings.
                    </AlertDescription>
                </Alert>
            </motion.div>

            <Accordion type="multiple" defaultValue={["profanity", "spam"]} className="w-full">
                <motion.div variants={item}>
                    <AccordionItem value="profanity" className="border-[#3a3c47]">
                        <AccordionTrigger className="text-white hover:text-white hover:no-underline py-4 px-4 bg-[#2b2d3a] rounded-t-md">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-blue-500" />
                                <span>Profanity Filter</span>
                                {settings.profanityFilter && <Badge className="ml-2 bg-green-600 text-white">Enabled</Badge>}
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="bg-[#232530] p-4 rounded-b-md border-t border-[#3a3c47]">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium text-white">Enable Profanity Filter</h4>
                                        <p className="text-sm text-gray-400">Automatically filter profane language</p>
                                    </div>
                                    <Switch
                                        checked={settings.profanityFilter}
                                        onCheckedChange={(checked) => setSettings({ ...settings, profanityFilter: checked })}
                                        className="data-[state=checked]:bg-blue-600"
                                    />
                                </div>

                                {settings.profanityFilter && (
                                    <>
                                        <div className="space-y-2">
                                            <h4 className="font-medium text-white">Filter Strictness</h4>
                                            <div className="flex items-center gap-4">
                                                <span className="text-sm text-gray-400">Low</span>
                                                <Slider
                                                    value={[settings.profanityLevel]}
                                                    min={1}
                                                    max={3}
                                                    step={1}
                                                    onValueChange={(value) => setSettings({ ...settings, profanityLevel: value[0] })}
                                                    className="flex-1"
                                                />
                                                <span className="text-sm text-gray-400">High</span>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                Current level:{" "}
                                                {settings.profanityLevel === 1 ? "Low" : settings.profanityLevel === 2 ? "Medium" : "High"}
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <h4 className="font-medium text-white">Action on Detection</h4>
                                            <Select
                                                value={settings.profanityAction}
                                                onValueChange={(value) => setSettings({ ...settings, profanityAction: value })}
                                            >
                                                <SelectTrigger className="bg-[#232530] border-[#3a3c47] text-white">
                                                    <SelectValue placeholder="Select action" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-[#232530] border-[#3a3c47]">
                                                    <SelectItem value="warn">Warn User</SelectItem>
                                                    <SelectItem value="delete">Delete Message</SelectItem>
                                                    <SelectItem value="mute">Mute User (5 minutes)</SelectItem>
                                                    <SelectItem value="kick">Kick User</SelectItem>
                                                    <SelectItem value="ban">Ban User</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </>
                                )}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </motion.div>

                <motion.div variants={item}>
                    <AccordionItem value="spam" className="border-[#3a3c47] mt-2">
                        <AccordionTrigger className="text-white hover:text-white hover:no-underline py-4 px-4 bg-[#2b2d3a] rounded-t-md">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-blue-500" />
                                <span>Spam Protection</span>
                                {settings.spamProtection && <Badge className="ml-2 bg-green-600 text-white">Enabled</Badge>}
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="bg-[#232530] p-4 rounded-b-md border-t border-[#3a3c47]">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium text-white">Enable Spam Protection</h4>
                                        <p className="text-sm text-gray-400">Prevent message spam in your server</p>
                                    </div>
                                    <Switch
                                        checked={settings.spamProtection}
                                        onCheckedChange={(checked) => setSettings({ ...settings, spamProtection: checked })}
                                        className="data-[state=checked]:bg-blue-600"
                                    />
                                </div>

                                {settings.spamProtection && (
                                    <>
                                        <div className="space-y-2">
                                            <h4 className="font-medium text-white">Message Threshold</h4>
                                            <div className="flex items-center gap-4">
                                                <span className="text-sm text-gray-400">3</span>
                                                <Slider
                                                    value={[settings.spamThreshold]}
                                                    min={3}
                                                    max={10}
                                                    step={1}
                                                    onValueChange={(value) => setSettings({ ...settings, spamThreshold: value[0] })}
                                                    className="flex-1"
                                                />
                                                <span className="text-sm text-gray-400">10</span>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                Trigger after {settings.spamThreshold} messages in 5 seconds
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <h4 className="font-medium text-white">Action on Detection</h4>
                                            <Select
                                                value={settings.spamAction}
                                                onValueChange={(value) => setSettings({ ...settings, spamAction: value })}
                                            >
                                                <SelectTrigger className="bg-[#232530] border-[#3a3c47] text-white">
                                                    <SelectValue placeholder="Select action" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-[#232530] border-[#3a3c47]">
                                                    <SelectItem value="warn">Warn User</SelectItem>
                                                    <SelectItem value="delete">Delete Messages</SelectItem>
                                                    <SelectItem value="mute">Mute User (10 minutes)</SelectItem>
                                                    <SelectItem value="kick">Kick User</SelectItem>
                                                    <SelectItem value="ban">Ban User</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </>
                                )}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </motion.div>

                <motion.div variants={item}>
                    <AccordionItem value="links" className="border-[#3a3c47] mt-2">
                        <AccordionTrigger className="text-white hover:text-white hover:no-underline py-4 px-4 bg-[#2b2d3a] rounded-t-md">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-blue-500" />
                                <span>Link Filter</span>
                                {settings.linkFilter && <Badge className="ml-2 bg-green-600 text-white">Enabled</Badge>}
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="bg-[#232530] p-4 rounded-b-md border-t border-[#3a3c47]">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium text-white">Enable Link Filter</h4>
                                        <p className="text-sm text-gray-400">Filter links posted in your server</p>
                                    </div>
                                    <Switch
                                        checked={settings.linkFilter}
                                        onCheckedChange={(checked) => setSettings({ ...settings, linkFilter: checked })}
                                        className="data-[state=checked]:bg-blue-600"
                                    />
                                </div>

                                {settings.linkFilter && (
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-white">Action on Detection</h4>
                                        <Select
                                            value={settings.linkAction}
                                            onValueChange={(value) => setSettings({ ...settings, linkAction: value })}
                                        >
                                            <SelectTrigger className="bg-[#232530] border-[#3a3c47] text-white">
                                                <SelectValue placeholder="Select action" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#232530] border-[#3a3c47]">
                                                <SelectItem value="warn">Warn User</SelectItem>
                                                <SelectItem value="delete">Delete Message</SelectItem>
                                                <SelectItem value="mute">Mute User (5 minutes)</SelectItem>
                                                <SelectItem value="kick">Kick User</SelectItem>
                                                <SelectItem value="ban">Ban User</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </motion.div>

                <motion.div variants={item}>
                    <AccordionItem value="mentions" className="border-[#3a3c47] mt-2">
                        <AccordionTrigger className="text-white hover:text-white hover:no-underline py-4 px-4 bg-[#2b2d3a] rounded-t-md">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-blue-500" />
                                <span>Mention Protection</span>
                                {settings.mentionProtection && <Badge className="ml-2 bg-green-600 text-white">Enabled</Badge>}
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="bg-[#232530] p-4 rounded-b-md border-t border-[#3a3c47]">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium text-white">Enable Mention Protection</h4>
                                        <p className="text-sm text-gray-400">Prevent mention spam in your server</p>
                                    </div>
                                    <Switch
                                        checked={settings.mentionProtection}
                                        onCheckedChange={(checked) => setSettings({ ...settings, mentionProtection: checked })}
                                        className="data-[state=checked]:bg-blue-600"
                                    />
                                </div>

                                {settings.mentionProtection && (
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-white">Action on Detection</h4>
                                        <Select
                                            value={settings.mentionAction}
                                            onValueChange={(value) => setSettings({ ...settings, mentionAction: value })}
                                        >
                                            <SelectTrigger className="bg-[#232530] border-[#3a3c47] text-white">
                                                <SelectValue placeholder="Select action" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#232530] border-[#3a3c47]">
                                                <SelectItem value="warn">Warn User</SelectItem>
                                                <SelectItem value="delete">Delete Message</SelectItem>
                                                <SelectItem value="mute">Mute User (5 minutes)</SelectItem>
                                                <SelectItem value="kick">Kick User</SelectItem>
                                                <SelectItem value="ban">Ban User</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </motion.div>

                <motion.div variants={item}>
                    <AccordionItem value="caps" className="border-[#3a3c47] mt-2">
                        <AccordionTrigger className="text-white hover:text-white hover:no-underline py-4 px-4 bg-[#2b2d3a] rounded-t-md">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-blue-500" />
                                <span>Excessive Caps Filter</span>
                                {settings.capsFilter && <Badge className="ml-2 bg-green-600 text-white">Enabled</Badge>}
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="bg-[#232530] p-4 rounded-b-md border-t border-[#3a3c47]">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium text-white">Enable Caps Filter</h4>
                                        <p className="text-sm text-gray-400">Filter messages with excessive capital letters</p>
                                    </div>
                                    <Switch
                                        checked={settings.capsFilter}
                                        onCheckedChange={(checked) => setSettings({ ...settings, capsFilter: checked })}
                                        className="data-[state=checked]:bg-blue-600"
                                    />
                                </div>

                                {settings.capsFilter && (
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-white">Action on Detection</h4>
                                        <Select
                                            value={settings.capsAction}
                                            onValueChange={(value) => setSettings({ ...settings, capsAction: value })}
                                        >
                                            <SelectTrigger className="bg-[#232530] border-[#3a3c47] text-white">
                                                <SelectValue placeholder="Select action" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#232530] border-[#3a3c47]">
                                                <SelectItem value="warn">Warn User</SelectItem>
                                                <SelectItem value="delete">Delete Message</SelectItem>
                                                <SelectItem value="mute">Mute User (5 minutes)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </motion.div>
            </Accordion>

            <motion.div variants={item} className="flex justify-end">
                <Button onClick={saveSettings} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">
                    {saving ? (
                        <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Settings
                        </>
                    )}
                </Button>
            </motion.div>
        </motion.div>
    )
}

function Skeleton({ className }: { className: string }) {
    return <div className={`animate-pulse ${className}`} />
}
