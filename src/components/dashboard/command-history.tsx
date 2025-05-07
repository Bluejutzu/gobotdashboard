import type { CommandLog } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface CommandHistoryProps {
    commands: CommandLog[]
}

export function CommandHistory({ commands }: CommandHistoryProps) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Command</TableHead>
                        <TableHead>Executed At</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {commands.map((command) => (
                        <TableRow key={command.id}>
                            <TableCell className="font-mono">{command.command}</TableCell>
                            <TableCell>{new Date(command.executed_at!).toLocaleString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
