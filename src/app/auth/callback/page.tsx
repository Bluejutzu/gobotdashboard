"use client"

import { getSupabaseClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js"
import { useEffect, useState } from "react";

export default function AuthCallback() {
  const router = useRouter()
  const supabase = getSupabaseClient()
  const [user, setUser] = useState<User>()
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      console.log(user)

      if (!session) {
        router.push("/auth/login")
        return
      }

      setUser(session.user)
    }

    checkSession()

  }, [router, supabase, user])

  return (
    <div>
      {Object.entries(user?.user_metadata || {}).map(([key, value], i) => (
        <div key={i}>{`${key}: ${value}`}</div>
      ))}
    </div>
  );
}
