import { NextResponse } from 'next/server'
import type { BlockDataProperties, Connection } from "@/lib/types/types"
import { Node } from './[id]/route';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// Discord command name validation regex
const COMMAND_NAME_REGEX = /^[\p{Ll}\p{Lm}\p{Lo}\p{N}\p{sc=Devanagari}\p{sc=Thai}_-]+$/u;

// Validate command name according to Discord's rules
function isValidCommandName(name: string): boolean {
    return COMMAND_NAME_REGEX.test(name) &&
        name.length >= 1 &&
        name.length <= 32 &&
        !name.includes('__') &&  // No double underscores
        !/^[-_]|[-_]$/.test(name); // Can't start or end with hyphen/underscore
}

interface CommandData {
    id: string
    name: string
    description: string
    server_id: string
    blocks: BlockDataProperties[]
    connections: Connection[]
    created_at: string
    updated_at: string
}

export async function POST(request: Request) {
    try {
        const supabase = await createServerSupabaseClient()
        const { nodes, edges, serverId } = await request.json()
        console.log(nodes, edges, serverId)
        // Get the command name and description from the start node
        const startNode = nodes.find((node: Node) => node.type === 'input')
        if (!startNode) {
            return NextResponse.json(
                { error: 'Command must have a start node' },
                { status: 400 }
            )
        }

        const commandName = startNode.data.label?.toLowerCase().trim() || '';

        // Validate command name
        if (!isValidCommandName(commandName)) {
            return NextResponse.json({
                error: 'Invalid command name. Names must:\n' +
                    '- Be 1-32 characters long\n' +
                    '- Include only lowercase letters, numbers, hyphens, or underscores\n' +
                    '- Not contain double underscores\n' +
                    '- Not start or end with a hyphen or underscore'
            }, { status: 400 })
        }

        // Check if command name already exists in this server
        const { data: existingCommand } = await supabase
            .from('commands')
            .select('id')
            .eq('name', commandName)
            .eq('server_id', serverId)
            .single()

        if (existingCommand) {
            return NextResponse.json({
                error: 'A command with this name already exists in this server'
            }, { status: 409 })
        }

        // Save the command to the database
        const { data: newCommand, error: commandError } = await supabase
            .from('commands')
            .insert({
                name: commandName,
                description: startNode.data.description || '',
                nodes: nodes,
                edges: edges,
                server_id: serverId,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .select('id')
            .single()

        if (commandError) {
            console.error('Error creating command:', commandError)
            return NextResponse.json(
                { error: 'Failed to create command' },
                { status: 500 }
            )
        }

        // Notify bot to reload commands
        const { error: webhookError } = await supabase
            .from('bot_events')
            .insert({
                type: 'RELOAD_COMMANDS',
                server_id: serverId,
                created_at: new Date().toISOString()
            })

        if (webhookError) {
            console.error('Error creating bot event:', webhookError)
            // Don't fail the request, just log the error
        }

        return NextResponse.json({ success: true, id: newCommand.id })
    } catch (error) {
        console.error('Error in command creation:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const serverId = searchParams.get("server_id")

        const supabase = await createServerSupabaseClient()

        let query = supabase.from("commands").select("*")
        if (serverId) {
            query = query.eq("server_id", serverId)
        }

        const { data, error } = await query

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(data as CommandData[])
    } catch (error) {
        console.error("Error fetching commands r:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        )
    }
} 