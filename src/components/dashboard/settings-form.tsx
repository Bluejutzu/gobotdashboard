"use client";

import type React from "react";

import { useState } from "react";
import { toast } from "sonner";
import type { BotSettings } from "@/lib/types/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import supabase from "@/lib/supabase/client";

interface SettingsFormProps {
    settings: BotSettings;
}

export function SettingsForm({ settings }: SettingsFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<BotSettings>(settings);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSwitchChange = (checked: boolean) => {
        setFormData(prev => ({ ...prev, moderation_enabled: checked }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { error } = await supabase
                .from("bot_settings")
                .update({
                    prefix: formData.prefix,
                    welcome_message: formData.welcome_message,
                    auto_role: formData.auto_role,
                    moderation_enabled: formData.moderation_enabled
                })
                .eq("id", settings.id);

            if (error) throw error;

            toast("Settings updated", {
                description: "Your bot settings have been updated successfully."
            });
        } catch (error) {
            console.error("Error updating settings:", error);
            toast("Error", {
                description: "Failed to update settings. Please try again."
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="prefix">Command Prefix</Label>
                    <Input id="prefix" name="prefix" value={formData.prefix} onChange={handleChange} maxLength={5} />
                    <p className="text-sm text-muted-foreground">The character(s) that will trigger bot commands.</p>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="welcome_message">Welcome Message</Label>
                    <Textarea
                        id="welcome_message"
                        name="welcome_message"
                        value={formData.welcome_message}
                        onChange={handleChange}
                        rows={3}
                    />
                    <p className="text-sm text-muted-foreground">Message sent to new members when they join.</p>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="auto_role">Auto Role</Label>
                    <Input id="auto_role" name="auto_role" value={formData.auto_role} onChange={handleChange} />
                    <p className="text-sm text-muted-foreground">Role automatically assigned to new members.</p>
                </div>

                <div className="flex items-center gap-2">
                    <Switch
                        id="moderation_enabled"
                        checked={formData.moderation_enabled}
                        onCheckedChange={handleSwitchChange}
                    />
                    <Label htmlFor="moderation_enabled">Enable Moderation</Label>
                </div>
            </div>

            <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
            </Button>
        </form>
    );
}
