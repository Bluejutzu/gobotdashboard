"use client"

import { type ReactNode, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { ServerLoading } from "./server-loading"

interface AuthCheckProps {
    children: ReactNode
}

export function AuthCheck({ children }: AuthCheckProps) {
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const checkSession = async () => {
            try {
                setIsLoading(true)
                const supabase = createClient()
                const { data, error } = await supabase.auth.getSession()

                if (error || !data.session) {
                    console.error("Auth check failed:", error)
                    router.push("/auth/login")
                    return
                }

                // Session is valid, continue
                setIsLoading(false)
            } catch (error) {
                console.error("Error checking session:", error)
                router.push("/auth/login")
            }
        }

        checkSession()
    }, [router])

    if (isLoading) {
        return (
            <div className="py-8">
                <ServerLoading message="Verifying your session..." />
            </div>
        )
    }

    return <>{children}</>
}
