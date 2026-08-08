'use server';

import { cookies } from "next/headers";
import { redirect, unstable_rethrow } from "next/navigation";

export const getReports = async () => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/report`, {
            method: 'GET',
            headers: {
                'Cookie': `token=${token}`
            }
        });

        if (!response.ok) {
            return [];
        }

        const data = await response.json();
        return data.reports ?? [];
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const createReport = async (timePeriod: string) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/report`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: `token=${token}`
            },
            body: JSON.stringify({ timePeriod })
        });

        if (!response.ok) {
            if (response.status === 403 || response.status === 404) {
                redirect('/pricing?message=subscription_required');
            }
            const data = await response.json();
            return { error: data.error || data.message || "Upload failed" };
        }

        const data = await response.json();
        return { data };
    } catch (error) {
        unstable_rethrow(error);
        return { error: "Something went wrong" };
    }
};