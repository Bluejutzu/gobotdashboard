"use client"

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

/**
 * Displays a searchable list of moderation commands for server moderators.
 *
 * Renders a UI component that lists available moderation commands, including their descriptions, usage, and examples. Provides a search input to filter commands and displays a message if no commands match the search.
 */
export function ModerationCommands() {
  const commands = [
    {
      name: "/warn",
      description: "Warn a user for breaking rules",
      usage: "/warn @user [reason]",
      example: "/warn @username Spamming in general chat",
    },
    {
      name: "/mute",
      description: "Temporarily mute a user",
      usage: "/mute @user [duration] [reason]",
      example: "/mute @username 1h Inappropriate language",
    },
    {
      name: "/kick",
      description: "Remove a user from the server",
      usage: "/kick @user [reason]",
      example: "/kick @username Repeated rule violations",
    },
    {
      name: "/ban",
      description: "Ban a user from the server",
      usage: "/ban @user [reason]",
      example: "/ban @username Harassment",
    },
    {
      name: "/history",
      description: "View moderation history for a user",
      usage: "/history @user",
      example: "/history @username",
    },
  ]

  return (
    <div className="space-y-6">
      <p className="text-gray-400">
        These commands are available to server moderators. Use them to manage your community.
      </p>

      <Command className="border-[#3a3d4a] bg-[#232530]">
        <CommandInput placeholder="Search commands..." className="border-[#3a3d4a]" />
        <CommandList>
          <CommandEmpty>No commands found.</CommandEmpty>
          <CommandGroup>
            {commands.map((command) => (
              <CommandItem key={command.name} className="hover:bg-[#2b2d3a] aria-selected:bg-[#2b2d3a]">
                <div className="flex flex-col space-y-1">
                  <div className="font-medium">{command.name}</div>
                  <div className="text-sm text-gray-400">{command.description}</div>
                  <div className="text-xs text-gray-500 font-mono mt-1">Usage: {command.usage}</div>
                  <div className="text-xs text-gray-500 font-mono">Example: {command.example}</div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  )
}
