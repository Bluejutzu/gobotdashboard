import { NextResponse } from "next/server"
import axios from "axios"

export async function GET() {
  try {
    const { data: botGuildsData } = await axios.get(
      `https://discord.com/api/v10/users/@me/guilds`,
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        },
      }
    )

    return NextResponse.json(botGuildsData)
  } catch (error) {
    console.error("Error fetching bot guilds:", error)
    return NextResponse.json(
      { error: "Failed to fetch bot guilds" },
      { status: 500 }
    )
  }
}
