import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function GuildList() {
    const supabase = createServerClient();
    const {
        data: { session },
    } = await supabase.auth.getSession();

    console.log(session)
    if (!session) {
        redirect("/auth/login");
    }

    return (
        <div>
            {[...(session.user.user_metadata.guilds || [])].map((v, i) => (
                <div key={i}>{v}</div>
            ))}
            something
        </div>
    );
}
