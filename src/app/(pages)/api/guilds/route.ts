import { NextResponse } from "next/server"
import { getFormattedServerList } from "@/lib/redis-service/guild-service"

export async function POST(req: Request) {
    const { userId, superbase_user_id, forceRefresh } = await req.json()

    try {
        const servers = await getFormattedServerList(userId, superbase_user_id, forceRefresh)
        return NextResponse.json({ servers })
    } catch (e) {
        console.error(e)
        return NextResponse.json({ error: "Failed to fetch servers" }, { status: 500 })
    }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    console.log(searchParams)
    
    const userId = searchParams.get("userid")
    const superbase_user_id = searchParams.get("superbase_user_id")
    let forceRefresh: any = searchParams.get("forceRefresh") || "false"

    if (forceRefresh === "true") {
        forceRefresh = true
    } else {
        forceRefresh = false
    }

    if (!userId || !superbase_user_id) {
        return NextResponse.json({ error: "Missing userid or superbase_user_id" }, { status: 400 })
    }

    try {
        const servers = await getFormattedServerList(userId, superbase_user_id, forceRefresh)
        return NextResponse.json({ servers })
    } catch (e) {
        console.error(e)
        return NextResponse.json({ error: "Failed to fetch servers" }, { status: 500 })
    }
}
