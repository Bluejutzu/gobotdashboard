import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import type { Server as ServerType, CommandLog } from "@/lib/types"
import { ServerError } from "@/components/dashboard/server-error"
import { ServerPageContent } from "@/components/dashboard/server-page-content"

export default async function ServerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id }: { id: string } = await params

  if (!id) {
    redirect("/dashboard")
  }

  const supabase = await createClient()

  // Try to fetch the server
  const { data: server, error: serverError } = await supabase
    .from("servers")
    .select("*")
    .eq("discord_id", id)
    .single<ServerType>()

  // Handle server fetch errors
  if (serverError) {
    return (
      <ServerError
        title="Database Error"
        message="We couldn't retrieve your server data from our database."
        code={serverError.code}
      />
    )
  }

  if (!server) {
    return (
      <ServerError
        title="Server Not Found"
        message="The server you're looking for doesn't exist or you don't have access to it."
      />
    )
  }

  // Get recent commands
  const { data: commands, error: commandsError } = await supabase
    .from("commands_log")
    .select("*")
    .eq("server_id", server.id)
    .order("executed_at", { ascending: false })
    .limit(5)
    .overrideTypes<CommandLog[]>()

  if (commandsError) {
    console.error("Error fetching commands:", commandsError)
  }

  return <ServerPageContent id={id} server={server} commands={commands || []} />
}
