"use client";

import type React from "react";

import { useCallback, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface ToastDemoProps {
    title: string;
    description: string;
    action?: React.ReactNode;
    autoShow?: boolean;
    delay?: number;
}

export function ToastDemo({ title, description, action, autoShow = false, delay = 1000 }: ToastDemoProps) {
    const showToast = useCallback(() => {
        toast(title, {
            description,
            action
        });
    }, [action, description, title]);

    useEffect(() => {
        if (autoShow) {
            const timer = setTimeout(() => {
                showToast();
            }, delay);

            return () => clearTimeout(timer);
        }
    }, [autoShow, delay, showToast]);

    if (autoShow) return null;

    return (
        <Button variant="outline" onClick={showToast}>
            Show Toast
        </Button>
    );
}
