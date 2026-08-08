'use client';

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props {
    message: string;
}

export default function DemoBlocked({ message }: Props) {
    const router = useRouter();
    const shown = useRef(false);

    useEffect(() => {
        if (shown.current) return;
        shown.current = true;
        toast.error(message);
        router.replace("/dashboard");
    }, [message, router]);

    return null;
}
