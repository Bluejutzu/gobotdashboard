import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AuthCallback() {
  const supabase = createServerClient();

  console.log(await supabase.auth.getSession())

  redirect("/dashboard");
}
