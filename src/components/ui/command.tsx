"use client";

import type * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { SearchIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

/**
 * Renders a styled command menu container using the `cmdk` primitive.
 *
 * Combines base styles for background, text color, layout, and rounded corners with any additional class names provided.
 */
function Command({ className, ...props }: React.ComponentProps<typeof CommandPrimitive>) {
    return (
        <CommandPrimitive
            data-slot="command"
            className={cn(
                "bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md",
                className
            )}
            {...props}
        />
    );
}

/**
 * Renders a modal dialog containing a styled command palette.
 *
 * @param title - The accessible title for the dialog. Defaults to "Command Palette".
 * @param description - The accessible description for the dialog. Defaults to "Search for a command to run...".
 * @param children - The command palette content to display within the dialog.
 *
 * @remark
 * The dialog includes a visually hidden header for accessibility, and applies custom styles to all nested command palette elements.
 */
function CommandDialog({
    title = "Command Palette",
    description = "Search for a command to run...",
    children,
    ...props
}: React.ComponentProps<typeof Dialog> & {
    title?: string;
    description?: string;
}) {
    return (
        <Dialog {...props}>
            <DialogHeader className="sr-only">
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <DialogContent className="overflow-hidden 	p-0">
                <Command className="[&_[cmdk-group-heading]]:text-muted-foreground [&_[data-slot=command-input-wrapper]]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
                    {children}
                </Command>
            </DialogContent>
        </Dialog>
    );
}

/**
 * Renders a styled search input field with a leading search icon for use within a command menu.
 *
 * @param className - Additional class names to apply to the input element.
 */
function CommandInput({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Input>) {
    return (
        <div data-slot="command-input-wrapper" className="flex h-9 items-center gap-2 border-b px-3">
            <SearchIcon className="size-4 shrink-0 opacity-50" />
            <CommandPrimitive.Input
                data-slot="command-input"
                className={cn(
                    "placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                {...props}
            />
        </div>
    );
}

/**
 * Renders a scrollable list container for command items with customizable styling.
 *
 * @param className - Additional class names to apply to the list container.
 */
function CommandList({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.List>) {
    return (
        <CommandPrimitive.List
            data-slot="command-list"
            className={cn("max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto", className)}
            {...props}
        />
    );
}

/**
 * Displays a styled message when no command items match the current search input.
 */
function CommandEmpty({ ...props }: React.ComponentProps<typeof CommandPrimitive.Empty>) {
    return <CommandPrimitive.Empty data-slot="command-empty" className="py-6 text-center text-sm" {...props} />;
}

/**
 * Groups related command items together with a styled heading.
 *
 * Applies consistent padding and muted heading styles to visually separate command groups within a command menu.
 */
function CommandGroup({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Group>) {
    return (
        <CommandPrimitive.Group
            data-slot="command-group"
            className={cn(
                "text-foreground [&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium",
                className
            )}
            {...props}
        />
    );
}

/**
 * Renders a horizontal separator line within a command menu for visual grouping.
 *
 * @param className - Additional class names to customize the separator's appearance.
 */
function CommandSeparator({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Separator>) {
    return (
        <CommandPrimitive.Separator
            data-slot="command-separator"
            className={cn("bg-border -mx-1 h-px", className)}
            {...props}
        />
    );
}

/**
 * Renders a selectable command item with custom styles for selected and disabled states.
 *
 * Accepts all props supported by the underlying command item primitive, along with additional class names for styling.
 */
function CommandItem({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Item>) {
    return (
        <CommandPrimitive.Item
            data-slot="command-item"
            className={cn(
                "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                className
            )}
            {...props}
        />
    );
}

/**
 * Displays a keyboard shortcut hint aligned to the right within a command item.
 *
 * @remarks
 * Intended for use inside command palette items to indicate available keyboard shortcuts.
 */
function CommandShortcut({ className, ...props }: React.ComponentProps<"span">) {
    return (
        <span
            data-slot="command-shortcut"
            className={cn("text-muted-foreground ml-auto text-xs tracking-widest", className)}
            {...props}
        />
    );
}

export {
    Command,
    CommandDialog,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandShortcut,
    CommandSeparator
};
