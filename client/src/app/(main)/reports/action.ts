'use server';

import { cookies } from "next/headers";

export const getReports = async () => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        const response = await fetch("http://localhost:5001/api/report", {
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

        const response = await fetch("http://localhost:5001/api/report", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: `token=${token}`
            },
            body: JSON.stringify({ timePeriod })
        });

        if (!response.ok) {
            const data = await response.json();
            return { error: data.message || "Failed to generate report" };
        }

        const data = await response.json();
        return { data };
    } catch (error) {
        return { error: "Something went wrong" };
    }
};