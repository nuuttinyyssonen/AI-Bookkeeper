'use server';

import { cookies } from "next/headers";
import { Receipt } from "@/lib/receipts";

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

export const getReceiptById = async (id: string): Promise<{ receipt: Receipt } | undefined> => {
    try {
        const cookiesStore = await cookies();
        const token = cookiesStore.get("token")?.value;

        const response = await fetch(`http://localhost:5001/api/receipt/${id}`, {
            method: 'GET',
            headers: {
                'Cookie': `token=${token}`
            }
        });

        if(!response.ok) {
            console.log("Error in getting receipts", response.status);
            return
        }

        const data = await response.json();
        return data;
    } catch(error) {
        console.log(error);
    }
};

export const deleteReceiptById = async (id: string | undefined) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        const response = await fetch(`http://localhost:5001/api/storage/${id}`, {
            method: 'DELETE',
            headers: {
                'Cookie': `token=${token}`
            }
        });

        if(!response.ok) {
            console.log("Error in deleting the receipt", response.status);
            return
        }

        const data = response.json();
        console.log(data);
        // redirect("/receipts")
    } catch(error) {
        console.log(error);
    }
};