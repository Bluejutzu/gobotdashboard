import { getSupabaseClient } from "@/lib/supabase/client"

export async function POST(req: Request) {
    const supabase = getSupabaseClient()
    const body = await req.json();

    const { session, token } = body;
    console.log(token, session)

    if (!session || !session.user) {
        return Response.json({ error: "Invalid session object" }, { status: 400 });
    }

    const user = session.user;
    const email = user.email;
    const userId = user.user_metadata.provider_id;
    const fullName = user.user_metadata.full_name

    if (!token) {
        return new Response(JSON.stringify({ error: "Missing provider token" }), { status: 400 });
    }
    
    if (!userId) {
        return new Response(JSON.stringify({ error: "Missing user ID" }), { status: 400 });
    }
    
    if (!email) {
        return new Response(JSON.stringify({ error: "Missing email" }), { status: 400 });
    }

    const { data, error } = await supabase
        .from("users")
        .upsert(
            {
                username: fullName,
                discord_token: token,
                discord_id: userId,
                email,
                avatar_url: user.user_metadata.avatar_url,
            },
            {
                onConflict: "discord_id"
            }
        )

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }

    return new Response(JSON.stringify({ success: true, user: data }), { status: 200 })
}
