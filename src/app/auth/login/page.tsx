import { DiscordAuthButton } from "@/components/auth/discord-auth-button"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function LoginPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1 flex items-center justify-center py-12">
                <div className="mx-auto max-w-md space-y-6 px-4">
                    <div className="space-y-2 text-center">
                        <h1 className="text-3xl font-bold">Login to Gobot</h1>
                        <p className="text-muted-foreground">Connect with Discord to manage your bot settings</p>
                    </div>
                    <div className="space-y-4">
                        <DiscordAuthButton />
                    </div>
                </div>
            </main>
            <SiteFooter />
        </div>
    )
}
