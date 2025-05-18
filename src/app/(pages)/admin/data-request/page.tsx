"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DataRequestsAdmin } from "@/components/admin/data-requests-admin"
import supabase from "@/lib/supabase/client"

export default function AdminDataRequestsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          router.push("/auth/login")
          return
        }

        const { data: adminUser, error: adminUserError } = await supabase
          .from("admin_users")
          .select("*")
          .eq("discord_id", session.user.user_metadata.sub)
          .single()
        
        if (adminUserError) {
          console.error("Error fetching admin user:", adminUserError)
          return <div>Error fetching admin user</div>
        }
        
        if (!adminUser) {
          router.push("/dashboard")
          return
        }

        setLoading(false)
      } catch (error) {
        console.error("Authentication error:", error)
        router.push("/auth/login")
      }
    }

    fetchSession()
  }, [router])

  if (loading) {
    return <div className="container py-10">Loading...</div>
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <DataRequestsAdmin />
    </div>
  )
}
