'use server';

import { cookies } from "next/headers";

export const getReceipts = async () => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        const response = await fetch("http://localhost:5001/api/receipt", {
            method: 'GET',
            headers: {
                'Cookie': `token=${token}`
            }
        });

        if(!response.ok) {
            console.log("Error in getting receipts", response.status);
            return [];
        }

        const data = await response.json();
        return Array.isArray(data) ? data : data?.receipts ?? [];
    } catch(error) {
        console.log(error);
    }
};