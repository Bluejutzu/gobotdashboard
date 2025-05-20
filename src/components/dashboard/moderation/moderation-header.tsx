import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

/**
 * Displays a static alert indicating that auto-moderation is active.
 *
 * Renders an informational banner with an icon, title, and description to inform users that Sapphire's auto-moderation is enabled for the server.
 */
export function ModerationHeader() {
    return (
        <Alert className="bg-[#2b2d3a] border-blue-500/50">
            <AlertCircle className="h-4 w-4 text-blue-500" />
            <AlertTitle className="text-blue-500">Auto-moderation is active</AlertTitle>
            <AlertDescription className="text-gray-300">
                Sapphire will automatically moderate your server based on these settings.
            </AlertDescription>
        </Alert>
    )
}
