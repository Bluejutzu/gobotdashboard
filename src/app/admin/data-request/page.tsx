import { redirect } from "next/navigation"
import { DataRequestsAdmin } from "@/components/admin/data-requests-admin"
import { getSupabaseClient } from "@/lib/supabase/client"

export default async function AdminDataRequestsPage() {
  const supabase = getSupabaseClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/login")
  }

  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("*")
    .eq("discord_id", session.user.user_metadata.sub)
    .single()

  if (!adminUser) {
    redirect("/dashboard")
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <DataRequestsAdmin />
    </div>
  )
}
