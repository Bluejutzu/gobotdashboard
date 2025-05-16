"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Bot, Flag, Hand, MessageSquare, Shield, Zap } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { ServerLoading } from "@/components/dashboard/server-loading"
import { ServerCreator } from "@/components/dashboard/server-creator"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { CommandLog, Server as ServerType } from "@/lib/types"
import { User } from "@/lib/types"

interface ServerPageContentProps {
  id: string
  server: ServerType
  commands: CommandLog[]
}

export function ServerPageContent({ id, server }: ServerPageContentProps) {
  const [userData, setUserData] = useState<User>()
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getUser()
        if (!sessionData.user) {
          router.push("/dashboard")
          return
        }

        const { data: userData } = await supabase
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

  if (!userData || !userData?.id) {
    return <div>Loading...</div>
  }

  if (!server) {
    return (
      <ServerCreator
        discordId={id}
        userId={userData.id}
        onServerCreated={() => {
          router.refresh()
        }}
      />
    )
  }

  return (
    <div className="flex-1 animate-in fade-in-50 duration-500">
      <div className="relative">
        {/* Blue glow effect */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] -z-10 opacity-60" />

        {/* Welcome header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Welcome <span className="text-blue-400">{userData?.username || "User"}</span>,
          </h1>
          <p className="text-muted-foreground text-lg mt-2">find commonly used dashboard pages below.</p>
        </div>

        {/* Feature cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Custom messages card */}
          <Card className="bg-background/60 backdrop-blur-sm border-slate-800 hover:border-slate-700 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start mb-4">
                <div className="bg-blue-500/10 p-2 rounded-md mr-4">
                  <MessageSquare className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">Custom messages</h3>
                  <p className="text-muted-foreground text-sm">
                    Create fully customized messages called templates and pack them with your very own embeds, buttons
                    and select menus.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="bg-slate-800/50 hover:bg-slate-700/50 border-slate-700 text-blue-400 hover:text-blue-300"
                asChild
              >
                <Link href={`/dashboard/servers/${id}/messages`}>Create template</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Moderation cases card */}
          <Card className="bg-background/60 backdrop-blur-sm border-slate-800 hover:border-slate-700 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start mb-4">
                <div className="bg-blue-500/10 p-2 rounded-md mr-4">
                  <Shield className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">Moderation cases</h3>
                  <p className="text-muted-foreground text-sm">
                    View and edit all moderation cases using the dashboard.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="bg-slate-800/50 hover:bg-slate-700/50 border-slate-700 text-blue-400 hover:text-blue-300"
                asChild
              >
                <Link href={`/dashboard/servers/${id}/moderation`}>View cases</Link>
              </Button>
            </CardContent>
          </Card>

          {/* User reports card */}
          <Card className="bg-background/60 backdrop-blur-sm border-slate-800 hover:border-slate-700 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start mb-4">
                <div className="bg-blue-500/10 p-2 rounded-md mr-4">
                  <Flag className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">User reports</h3>
                  <p className="text-muted-foreground text-sm">
                    Allow users to report others and fully customize how to handle them.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="bg-slate-800/50 hover:bg-slate-700/50 border-slate-700 text-blue-400 hover:text-blue-300"
                asChild
              >
                <Link href={`/dashboard/servers/${id}/reports`}>Configure reports</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Role greetings card */}
          <Card className="bg-background/60 backdrop-blur-sm border-slate-800 hover:border-slate-700 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start mb-4">
                <div className="bg-blue-500/10 p-2 rounded-md mr-4">
                  <Hand className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">Role greetings</h3>
                  <p className="text-muted-foreground text-sm">
                    {`Welcome users to their new role by using Sapphire's role assignment messages.`}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="bg-slate-800/50 hover:bg-slate-700/50 border-slate-700 text-blue-400 hover:text-blue-300"
                asChild
              >
                <Link href={`/dashboard/servers/${id}/roles`}>Show role messages</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Prefixes card */}
          <Card className="bg-background/60 backdrop-blur-sm border-slate-800 hover:border-slate-700 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start mb-4">
                <div className="bg-blue-500/10 p-2 rounded-md mr-4">
                  <Zap className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">Prefixes</h3>
                  <p className="text-muted-foreground text-sm">{`Update how you execute Sapphire's commands.`}</p>
                </div>
              </div>
              <Button
                variant="outline"
                className="bg-slate-800/50 hover:bg-slate-700/50 border-slate-700 text-blue-400 hover:text-blue-300"
                asChild
              >
                <Link href={`/dashboard/servers/${id}/settings`}>Add prefix</Link>
              </Button>
            </CardContent>
          </Card>

          {/* AI Moderation card */}
          <Card className="bg-background/60 backdrop-blur-sm border-slate-800 hover:border-slate-700 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start mb-4">
                <div className="bg-blue-500/10 p-2 rounded-md mr-4">
                  <Bot className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">AI Moderation</h3>
                  <p className="text-muted-foreground text-sm">
                    Use artificial intelligence to assist you in moderating your server.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="bg-slate-800/50 hover:bg-slate-700/50 border-slate-700 text-blue-400 hover:text-blue-300"
                asChild
              >
                <Link href={`/dashboard/servers/${id}/ai-moderation`}>Configure AI</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
