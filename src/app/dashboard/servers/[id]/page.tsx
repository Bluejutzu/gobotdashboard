import { redirect } from "next/navigation"
import { StatsCard } from "@/components/dashboard/stats-card"
import { BarChart3, MessageSquare, Users } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase/client"
import ServerPageClient from "@/components/dashboard/ServerPageClient"
import axios from 'axios'
import { getBearerToken } from "@/lib/utils"

export default async function ServerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  if (!id) {
    console.log("No id")
    return redirect("/")
  }

  const supabase = getSupabaseClient()

  const { data: server, error: serverError } = await supabase
    .from("servers")
    .select("*")
    .eq("discord_id", id)
    .single()

  if (serverError && serverError.code === "PGRST116") {
    console.log("No server found, creating new server.")

    const bearerToken = await getBearerToken((await supabase.auth.getUser()).data.user?.user_metadata.provider_id)

    const res = await axios.get("https://discord.com/api/v10/guilds/" + id + "/preview", {
      headers: {
        Authorization: `Bearer ${bearerToken}`
      }
    })

    if (res.status == 401) {
      console.log("Unauthorized")
      return <div>Unauthorized: {res.statusText}</div>
    }

    const { data, error } = await supabase.from("servers").insert([
      {
        name: res.data.name,
        discord_id: id,
        member_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])

    if (error) {
      console.log("Error creating new server:", error)
      return <div>Error creating new server.</div>
    }

    console.log("New server created:", data)

    return <div>Server created successfully.</div> 
  }

  if (serverError || !server) {
    console.log("Error fetching server:", serverError)
    return <div>Error loading server data.</div>
  }


  return (
    <div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <StatsCard title="Total Members" value={server.member_count?.toLocaleString() || "N/A"} icon={Users} />
        <StatsCard title="Commands Used" value="N/A" icon={MessageSquare} /> {/* Placeholder */}
        <StatsCard title="Bot Status" value="Online" description="Last updated 2 minutes ago" icon={BarChart3} />
      </div>

      <ServerPageClient id={id} server={server} />
    </div>
  )
}
