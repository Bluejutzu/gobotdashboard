import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

// Create server action file
export async function createNewCommand(formData: FormData) {
  'use server'
  const serverId = formData.get('serverId') as string
  redirect(`/command-builder/${serverId}/new`)
}

export async function editCommand(formData: FormData) {
  'use server'
  const serverId = formData.get('serverId') as string
  const commandId = formData.get('commandId') as string
  redirect(`/command-builder/${serverId}/${commandId}`)
}

export default async function CommandsPage({ params }: { params: Promise<{ id: string, commandId: string }> }) {
  const { id: serverId }: { id: string, commandId: string } = await params
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
        <form action={createNewCommand}>
          <input type="hidden" name="serverId" value={serverId} />
          <Button type="submit">
            Create Command
          </Button>
        </form>
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
                  <form action={editCommand}>
                    <input type="hidden" name="serverId" value={serverId} />
                    <input type="hidden" name="commandId" value={cmd.id} />
                    <Button type="submit" size="sm" variant="outline">
                      Edit
                    </Button>
                  </form>
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