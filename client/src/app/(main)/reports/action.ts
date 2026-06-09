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