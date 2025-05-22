"use client";

import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

/**
 * Displays a placeholder UI for the upcoming custom flagging feature.
 *
 * Renders an informational alert and a disabled button indicating that advanced content moderation rules will be available soon.
 */
export function CustomFlagging() {
    return (
        <div className="space-y-6">
            <Alert className="bg-[#2b2d3a] border-yellow-500/50">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <AlertDescription className="text-gray-300">
                    Custom flagging allows you to set up advanced content detection rules.
                </AlertDescription>
            </Alert>

            <div className="flex justify-center items-center p-12">
                <div className="text-center space-y-4">
                    <h3 className="text-xl font-medium">Custom Flagging</h3>
                    <p className="text-gray-400 max-w-md">
                        This feature is coming soon. Custom flagging will allow you to create advanced rules for content
                        moderation.
                    </p>
                    <Button disabled={true} className="mt-4 bg-[#2b2d3a] hover:bg-[#3a3d4a] text-gray-300">
                        Coming Soon
                    </Button>
                </div>
            </div>
        </div>
    );
}
