"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Download, Upload, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useThemeContext } from "@/contexts/theme-context";
import { exportThemeToJson, importThemeFromJson } from "@/lib/theme-export";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DialogClose,
} from "@/components/ui/dialog";

interface ThemeImportExportProps {
	theme?: any; // Optional theme to export
	variant?: "default" | "outline" | "ghost" | "link";
	size?: "default" | "sm" | "lg" | "icon";
}

export function ThemeImportExport({
	theme,
	variant = "outline",
	size = "sm",
}: ThemeImportExportProps) {
	const { currentTheme, importTheme } = useThemeContext();
	const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const [importError, setImportError] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Handle export button click
	const handleExport = () => {
		const themeToExport = theme || currentTheme;
		exportThemeToJson(themeToExport);
		toast.success(`Theme "${themeToExport.name}" exported successfully`);
	};

	// Handle import button click
	const handleImportClick = () => {
		fileInputRef.current?.click();
	};

	// Handle file selection
	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = event.target.files?.[0];
		if (!file) return;

		try {
			setImportError(null);
			const importedTheme = await importThemeFromJson(file);
			await importTheme(importedTheme);
			setIsImportDialogOpen(false);
			event.target.value = ""; // Reset the input
		} catch (error) {
			console.error("Import error:", error);
			setImportError((error as Error).message);
		}
	};

	// Handle drag events
	const handleDragEnter = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const handleDrop = async (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);

		const file = e.dataTransfer.files?.[0];
		if (!file) return;

		try {
			setImportError(null);
			const importedTheme = await importThemeFromJson(file);
			await importTheme(importedTheme);
			setIsImportDialogOpen(false);
		} catch (error) {
			console.error("Import error:", error);
			setImportError((error as Error).message);
		}
	};

	return (
		<div className="flex items-center gap-2">
			{/* Export Button */}
			<Button
				variant={variant}
				size={size}
				onClick={handleExport}
				title="Export Theme"
			>
				<Download className="h-4 w-4 mr-2" />
				<span>Export</span>
			</Button>

			{/* Import Dialog */}
			<Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
				<DialogTrigger asChild>
					<Button variant={variant} size={size} title="Import Theme">
						<Upload className="h-4 w-4 mr-2" />
						<span>Import</span>
					</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Import Theme</DialogTitle>
						<DialogDescription>
							Upload a theme JSON file to import. You can drag and drop a file
							or click to browse.
						</DialogDescription>
					</DialogHeader>

					<div
						className={`mt-4 border-2 border-dashed rounded-lg p-8 text-center ${
							isDragging ? "border-primary bg-primary/5" : "border-white/20"
						} transition-colors duration-200`}
						onDragEnter={handleDragEnter}
						onDragLeave={handleDragLeave}
						onDragOver={handleDragOver}
						onDrop={handleDrop}
					>
						<Upload className="h-10 w-10 mx-auto mb-4 text-white/60" />
						<p className="mb-2">Drag and drop your theme file here</p>
						<p className="text-sm text-white/60 mb-4">or</p>
						<Button onClick={handleImportClick} variant="secondary">
							Browse Files
						</Button>
						<input
							type="file"
							ref={fileInputRef}
							onChange={handleFileChange}
							accept=".json"
							className="hidden"
						/>
					</div>

					{importError && (
						<div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md flex items-start gap-2 text-sm">
							<AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
							<div>
								<p className="font-medium text-red-500">Import Error</p>
								<p className="text-white/80">{importError}</p>
							</div>
						</div>
					)}

					<div className="flex justify-end gap-2 mt-4">
						<DialogClose asChild>
							<Button variant="ghost">Cancel</Button>
						</DialogClose>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
