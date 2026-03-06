"use client";

import { type ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabase/client";
import { ServerLoading } from "./server-loading";

interface AuthCheckProps {
    children: ReactNode;
}

export function AuthCheck({ children }: AuthCheckProps) {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

   setIsLoading(false)

    if (isLoading) {
        return (
            <div className="py-8">
                <ServerLoading message="Verifying your session..." />
            </div>
        );
    }

    return <>{children}</>;
}
