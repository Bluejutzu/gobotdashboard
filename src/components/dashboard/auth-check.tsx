"use client"

import { useEffect, useState, type ReactNode } from "react"
import { getSupabaseClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
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
                const supabase = getSupabaseClient()
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
