import { NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase/client'

export async function POST(request: Request) {
    try {
        const { serverId } = await request.json()

        // Create a bot event to trigger command reload
        const { error: webhookError } = await getSupabaseClient()
            .from('bot_events')
            .insert({
                type: 'RELOAD_COMMANDS',
                server_id: serverId,
                created_at: new Date().toISOString()
            })

        if (webhookError) {
            console.error('Error creating bot event r:', webhookError)
            return NextResponse.json({ error: 'Failed to notify bot' }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error in command reload:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
} 