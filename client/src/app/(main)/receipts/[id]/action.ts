'use server';

import { cookies } from "next/headers";

export const changeReceiptCategory = async (id: string, category: string): Promise<void> => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        const response = await fetch(`http://localhost:5001/api/receipt/category/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `token=${token}`
            },
            body: JSON.stringify({ category })
        });

        if (!response.ok) {
            console.log("Error changing category", response.status);
        }
    } catch (error) {
        console.log(error);
    }
};

export const changeReceiptDeductible = async (id: string, isDeductible: boolean): Promise<void> => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        const response = await fetch(`http://localhost:5001/api/receipt/is_deductible/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `token=${token}`
            },
            body: JSON.stringify({ isDeductible })
        });

        if (!response.ok) {
            console.log("Error changing deductible", response.status);
        }
    } catch (error) {
        console.log(error);
    }
};