import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'

export default async function CommandsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: serverId }: { id: string } = await params
  const supabase = await createClient()
  
  // Fetch commands for this server
  const { data: commands, error } = await supabase
    .from('commands')
    .select('*')
    .eq('server_id', serverId)
    .order('name', { ascending: true })

  return (
    <div className="max-w-3xl mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Commands</h1>
        <Link href={`/dashboard/servers/${serverId}/commands/new`}>
          <Button>Create New Command</Button>
        </Link>
      </div>
      {error && <div className="text-red-500">Failed to load commands.</div>}
      <div className="bg-[#232530] rounded-md p-4 border border-[#3a3c47]">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Description</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {commands?.map((cmd: any) => (
              <tr key={cmd.id} className="border-t border-[#3a3c47]">
                <td className="py-2 px-4 font-mono text-blue-400">/{cmd.name}</td>
                <td className="py-2 px-4">{cmd.description}</td>
                <td className="py-2 px-4 flex gap-2">
                  <Link href={`/dashboard/servers/${serverId}/commands/${cmd.id}`}>
                    <Button size="sm" variant="outline">Edit</Button>
                  </Link>
                  {/* TODO: Add delete functionality */}
                </td>
              </tr>
            ))}
            {(!commands || commands.length === 0) && (
              <tr>
                <td colSpan={3} className="py-4 text-center text-gray-400">No commands found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
} 