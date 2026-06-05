'use server';

import { cookies } from "next/headers";
import { Receipt } from "@/lib/receipts";

export type ReceiptsResponse = {
    receipts: any[];
    is_documents_processing: boolean;
    is_documents_pending: boolean;
};

export const getReceipts = async (): Promise<ReceiptsResponse> => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        const response = await fetch("http://localhost:5001/api/receipt", {
            method: 'GET',
            headers: {
                'Cookie': `token=${token}`
            }
        });

        if (!response.ok) {
            console.log("Error in getting receipts", response.status);
            return { receipts: [], is_documents_processing: false, is_documents_pending: false };
        }

        const data = await response.json();
        return {
            receipts: Array.isArray(data) ? data : data?.receipts ?? [],
            is_documents_processing: data?.is_documents_processing ?? false,
            is_documents_pending: data?.is_documents_pending ?? false
        };
    } catch (error) {
        console.log(error);
        return { receipts: [], is_documents_processing: false, is_documents_pending: false };
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
            return;
        }

        const data = await response.json();
        console.log(data);
        // redirect("/receipts")
    } catch(error) {
        console.log(error);
    }
};

export const getReceiptFile = async (id: string | undefined): Promise<{ base64: string; contentType: string; filename: string } | undefined> => {
    if (!id) return;

    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        const response = await fetch(`http://localhost:5001/api/storage/${id}`, {
            method: 'GET',
            headers: {
                'Cookie': `token=${token}`
            }
        });

        if(!response.ok) {
            console.log("Error in getting the receipt file", response.status);
            return;
        }

        const contentType = response.headers.get("content-type") ?? "application/octet-stream";
        const contentDisposition = response.headers.get("content-disposition") ?? "";
        const fileNameMatch = contentDisposition.match(/filename="?(.*?)"?(;|$)/i);
        const filename = fileNameMatch?.[1] ?? `${id}`;

        const buffer = Buffer.from(await response.arrayBuffer());
        const base64 = buffer.toString("base64");

        return {
            base64,
            contentType,
            filename,
        };
    } catch(error) {
        console.log(error);
    }
};