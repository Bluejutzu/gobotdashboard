"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { User } from "@supabase/supabase-js"

export default function OnboardingPage() {
    const router = useRouter()
    const supabase = getSupabaseClient()
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState<User>()

    useEffect(() => {
        const checkSession = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession()

            if (!session) {
                router.push("/auth/login")
                return
            }

            setUser(session.user)
            setIsLoading(false)
        }

        checkSession()
    }, [router, supabase])

    const handleCreateAccount = async () => {
        if (!user) return

        setIsLoading(true)

        try {
            // Create user in our database
            const { error: userError } = await supabase.from("users").insert({
                discord_id: user.user_metadata.sub,
                username: user.user_metadata.full_name || user.user_metadata.name,
                avatar_url: user.user_metadata.avatar_url,
                email: user.email,
            })

            if (userError) throw userError

            router.push("/dashboard")
        } catch (error) {
            console.error("Error creating account:", error)
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Loading...</h2>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-muted/40">
            <Card className="max-w-md w-full">
                <CardHeader>
                    <CardTitle>Welcome to Gobot!</CardTitle>
                    <CardDescription>Complete your account setup to get started</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 mb-4">
                        {user?.user_metadata?.avatar_url && (
                            <Image
                                src={user.user_metadata.avatar_url || "/placeholder.svg"}
                                alt="Discord avatar"
                                className="w-16 h-16 rounded-full"
                            />
                        )}
                        <div>
                            <p className="font-medium">{user?.user_metadata?.full_name || user?.user_metadata?.name}</p>
                            <p className="text-sm text-muted-foreground">{user?.email}</p>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        By continuing, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleCreateAccount} disabled={isLoading} className="w-full">
                        {isLoading ? "Creating Account..." : "Complete Setup"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
