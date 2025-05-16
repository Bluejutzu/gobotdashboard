"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { SettingsForm } from "@/components/dashboard/settings-form"
import { RoleAccessControl } from "@/components/dashboard/role-access-control"
import { createClient } from "@/lib/supabase/client"
import { ServerLoading } from "@/components/dashboard/server-loading"
import type { BotSettings, Server, User, UserServer } from "@/lib/types"

interface SettingsPageContentProps {
  id: string
  server: Server
  botSettings: BotSettings
}

export function SettingsPageContent({ id, server, botSettings }: SettingsPageContentProps) {
  const [, setUserData] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getUser()
        if (!sessionData.user) {
          router.push("/auth/login")
          return
        }

        const { data: userData} = await supabase
          .from("users")
          .select("*")
          .eq("discord_id", sessionData.user.user_metadata.sub)
          .single<User>()

        if (!userData) {
          router.push("/dashboard")
          return
        }

        const { data: userServer } = await supabase
          .from("user_servers")
          .select("*")
          .eq("user_id", userData.id)
          .eq("server_id", server.id)
          .single<UserServer>()

        // Check if user is admin
        if (!userServer || !userServer.is_admin) {
          router.push(`/dashboard/servers/${id}`)
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
  }, [router, supabase, server.id, id])

  if (loading) {
    return <ServerLoading />
  }

  return (
    <>
      <div className="hidden md:flex w-64 flex-col border-r bg-muted/40">
        <DashboardSidebar serverId={id} />
      </div>
      <div className="flex-1">
        <div className="h-full px-4 py-6 lg:px-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Bot Settings</h2>
            <p className="text-muted-foreground">Configure Sapphire for {server.name}</p>
          </div>

          <div className="mt-8 grid gap-8">
            <div className="max-w-2xl">
              <SettingsForm settings={botSettings} />
            </div>

            <div className="max-w-2xl">
              <RoleAccessControl serverId={id} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 