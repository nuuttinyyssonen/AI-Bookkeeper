'use server';

import { cookies } from "next/headers";
import { type ReceiptVat } from "@/lib/receipts";

export const updateReceiptDetails = async (
    id: string,
    vendor_name: string,
    total_amount: number,
    receipt_date: string,
    vats?: Pick<ReceiptVat, 'id' | 'rate' | 'net_amount' | 'vat_amount' | 'total'>[]
): Promise<{ error?: string }> => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/receipt/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `token=${token}`
            },
            body: JSON.stringify({ vendor_name, total_amount, receipt_date, vats })
        });

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            return { error: data.message || "Failed to update receipt" };
        }

        return {};
    } catch (error) {
        return { error: "Failed to update receipt" };
    }
};

export const changeReceiptCategory = async (id: string, category: string): Promise<void> => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/receipt/category/${id}`, {
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

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/receipt/is_deductible/${id}`, {
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

export const changeReceiptDeductiblePercentage = async (id: string, deductibilityPercentage: number): Promise<void> => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/receipt/percentage/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `token=${token}`
            },
            body: JSON.stringify({ deductibilityPercentage })
        });

        if (!response.ok) {
            console.log("Error changing deductibility percentage", response.status);
        }
    } catch (error) {
        console.log(error);
    }
};