"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModerationRuleCard } from "./moderation-rule-card"
import { getAutoModerationSettings, updateAutoModerationSettings } from "@/lib/redis-service/moderation-service"
import type { AutoModerationRule } from "@/lib/types/types"

// Extended type to include our custom properties
interface ExtendedAutoModerationRule extends AutoModerationRule {
    customSettings?: {
        linkFilter?: boolean
        allowedDomains?: string[]
        blockAllLinks?: boolean
        spamSettings?: {
            enabled: boolean
            threshold: number
        }
    }
}

export function AutoModeration({ serverId }: { serverId: string }) {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [settings, setSettings] = useState<ExtendedAutoModerationRule | null>(null)
    const [hasChanges, setHasChanges] = useState(false)

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                setLoading(true)
                const data = await getAutoModerationSettings(serverId)

                // If no settings exist, create default settings
                if (!data) {
                    setSettings(createDefaultSettings(serverId))
                } else {
                    setSettings(data as ExtendedAutoModerationRule)
                }
            } catch (err) {
                console.error("Failed to load settings:", err)
                toast.error("Failed to load settings", {
                    description: "Using default moderation configuration.",
                })
                setSettings(createDefaultSettings(serverId))
            } finally {
                setLoading(false)
            }
        }

        fetchSettings()
    }, [serverId])

    // Create a function to update settings and track changes
    const updateSettings = (updatedSettings: ExtendedAutoModerationRule) => {
        setSettings(updatedSettings)
        setHasChanges(true)
    }

    const handleSave = async () => {
        if (!settings) return

        try {
            setSaving(true)
            await updateAutoModerationSettings(serverId, settings)
            toast.success("Settings saved", {
                description: "Auto-moderation settings updated successfully.",
            })
            setHasChanges(false)
        } catch (err) {
            console.error("Save failed:", err)
            toast.error("Save failed", {
                description: "Try again in a few seconds.",
            })
        } finally {
            setSaving(false)
        }
    }

    if (loading || !settings) {
        // We don't need to render a loading state here since the parent component
        // is using Suspense with ModerationTabSkeleton as the fallback
        return null
    }

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <ModerationRuleCard
                    title="Profanity Filter"
                    description="Automatically detect and remove messages containing profanity"
                    icon="filter"
                    enabled={settings.trigger_metadata?.keyword_filter?.length ? true : false}
                    onToggle={(enabled) =>
                        updateSettings({
                            ...settings,
                            trigger_metadata: {
                                ...settings.trigger_metadata,
                                keyword_filter: enabled ? ["fuck", "shit", "asshole"] : [],
                            },
                        })
                    }
                    settings={settings}
                    updateSettings={updateSettings}
                    type="profanity"
                />

                <ModerationRuleCard
                    title="Spam Protection"
                    description="Prevent message spam and repetitive content"
                    icon="shield"
                    enabled={settings.customSettings?.spamSettings?.enabled || false}
                    onToggle={(enabled) =>
                        updateSettings({
                            ...settings,
                            customSettings: {
-                               ...settings.customSettings,
+                               ...(settings.customSettings ?? {}),
                                spamSettings: {
                                    enabled,
                                    threshold: settings.customSettings?.spamSettings?.threshold || 5,
                                },
                            },
                    }
                    settings={settings}
                    updateSettings={updateSettings}
                    type="spam"
                />

                <ModerationRuleCard
                    title="Link Filter"
                    description="Control which links can be shared in your server"
                    icon="link"
                    enabled={settings.customSettings?.linkFilter || false}
                    onToggle={(enabled) =>
                        updateSettings({
                            ...settings,
                            customSettings: {
                                ...settings.customSettings,
                                linkFilter: enabled,
                            },
                        })
                    }
                    settings={settings}
                    updateSettings={updateSettings}
                    type="link"
                />
            </div>

            <div className="flex justify-end">
                <Button
                    onClick={handleSave}
                    disabled={saving || !hasChanges}
                    className="transition-all bg-blue-600 hover:bg-blue-700"
                >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </div>
    )
}

// Helper function to create default settings
function createDefaultSettings(serverId: string): ExtendedAutoModerationRule {
    return {
        id: "new",
        guild_id: serverId,
        name: "Auto Moderation",
        creator_id: "",
        event_type: 1,
        trigger_type: 1,
        trigger_metadata: {
            keyword_filter: [],
        },
        actions: [{ type: 2 }], // Delete message by default
        enabled: true,
        exempt_roles: [],
        exempt_channels: [],
        customSettings: {
            linkFilter: false,
            allowedDomains: [],
            blockAllLinks: false,
            spamSettings: {
                enabled: false,
                threshold: 5,
            },
        },
    }
}
