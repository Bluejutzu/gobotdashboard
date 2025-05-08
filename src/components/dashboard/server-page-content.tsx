"use client"

import { Suspense, useEffect, useState } from "react"
import { StatsCard } from "@/components/dashboard/stats-card"
import { BarChart3, MessageSquare, Users } from "lucide-react"
import ServerPageClient from "@/components/dashboard/ServerPageClient"
import { AuthCheck } from "@/components/dashboard/auth-check"
import { ServerLoading } from "@/components/dashboard/server-loading"
import { ServerCreator } from "@/components/dashboard/server-creator"
import { getSupabaseClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { Server as ServerType, CommandLog } from "@/lib/types"

interface ServerPageContentProps {
  id: string
  server: ServerType
  commands: CommandLog[]
}

export function ServerPageContent({ id, server, commands }: ServerPageContentProps) {
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = getSupabaseClient()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getUser()
        if (!sessionData.user) {
          router.push("/dashboard")
          return
        }

        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("discord_id", sessionData.user.user_metadata.sub)
          .single()

        if (!userData) {
          router.push("/dashboard/onboarding")
          return
        }

        setUserData(userData)
        setLoading(false)
      } catch (error) {
        console.error("Auth error:", error)
        router.push("/dashboard")
      }
    }

    checkAuth()
  }, [router, supabase])

  if (loading) {
    return <ServerLoading />
  }

  // If server doesn't exist, show server creator
  if (!server) {
    return (
      <ServerCreator 
        discordId={id}
        userId={userData.id}
        onServerCreated={(newServer) => {
          // This will trigger a page refresh
          router.refresh()
        }}
      />
    )
  }

  return (
    <div className="space-y-8">
      <AuthCheck>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <StatsCard title="Total Members" value={server.member_count?.toLocaleString() || "N/A"} icon={Users} />
          <StatsCard
            title="Commands Used"
            value={commands?.length ? `${commands.length} recent` : "0"}
            icon={MessageSquare}
          />
          <StatsCard title="Bot Status" value="Online" description="Last updated 2 minutes ago" icon={BarChart3} />
        </div>

        <Suspense fallback={<ServerLoading />}>
          <ServerPageClient id={id} server={server} commands={commands} />
        </Suspense>
      </AuthCheck>
    </div>
  )
} 