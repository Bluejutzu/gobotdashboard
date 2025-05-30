import type { CommandLog } from "@/lib/types/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface CommandHistoryProps {
    commands: CommandLog[];
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
                    {commands.map(command => (
                        <TableRow key={command.id}>
                            <TableCell className="font-mono">{command.command}</TableCell>
                            <TableCell>
                                {command.executed_at
                                    ? new Date(command.executed_at).toLocaleString()
                                    : "Date not available"}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
