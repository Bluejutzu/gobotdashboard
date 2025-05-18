import { NextResponse } from "next/server"
import { getFormattedServerList } from "@/lib/redis-service/guild-service"

export async function POST(req: Request) {
    const { userId, superbase_user_id, forceRefresh } = await req.json()

    try {
        const servers = await getFormattedServerList(userId, superbase_user_id, forceRefresh)
        return NextResponse.json({ servers })
    } catch (e) {
        console.error(e)
        return NextResponse.json({ error: "Failed to fetch servers" + e }, { status: 500 })
    }
}

