'use server';

import { cookies } from "next/headers";

export const getReportById = async (id: string) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        const response = await fetch(`http://localhost:5001/api/report/${id}`, {
            headers: { 'Cookie': `token=${token}` }
        });

        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        return null;
    }
};

export const deleteReportById = async (id: string) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        const response = await fetch(`http://localhost:5001/api/report/${id}`, {
            method: 'DELETE',
            headers: { 'Cookie': `token=${token}` }
        });

        if (!response.ok) return null;
        return { success: "Report deleted successfully" };
    } catch(error) {
        return null;
    }
};