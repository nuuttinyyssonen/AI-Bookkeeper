'use server';

import { cookies } from "next/headers";
import { Receipt } from "@/lib/receipts";

export type ReceiptParams = {
    page?: number;
    limit?: number;
    from?: string;
    to?: string;
    search?: string;
    category?: string;
    type?: "EXPENSE" | "INCOME";
};

export type ReceiptsResponse = {
    receipts: Receipt[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    expenseTotal: number;
    incomeTotal: number;
    is_documents_processing: boolean;
    is_documents_pending: boolean;
};

const emptyResponse: ReceiptsResponse = {
    receipts: [],
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
    expenseTotal: 0,
    incomeTotal: 0,
    is_documents_processing: false,
    is_documents_pending: false,
};

export const getReceipts = async (params: ReceiptParams = {}): Promise<ReceiptsResponse> => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        const searchParams = new URLSearchParams();
        if (params.page) searchParams.set("page", String(params.page));
        if (params.limit) searchParams.set("limit", String(params.limit));
        if (params.from) searchParams.set("from", params.from);
        if (params.to) searchParams.set("to", params.to);
        if (params.search) searchParams.set("search", params.search);
        if (params.category) searchParams.set("category", params.category);
        if (params.type) searchParams.set("type", params.type);

        const response = await fetch(`http://localhost:5001/api/receipt?${searchParams.toString()}`, {
            method: 'GET',
            headers: {
                'Cookie': `token=${token}`
            }
        });

        if (!response.ok) {
            console.log("Error in getting receipts", response.status);
            return emptyResponse;
        }

        const data = await response.json();
        return {
            receipts: data?.receipts ?? [],
            total: data?.total ?? 0,
            page: data?.page ?? 1,
            limit: data?.limit ?? 20,
            totalPages: data?.totalPages ?? 0,
            expenseTotal: data?.expenseTotal ?? 0,
            incomeTotal: data?.incomeTotal ?? 0,
            is_documents_processing: data?.is_documents_processing ?? false,
            is_documents_pending: data?.is_documents_pending ?? false,
        };
    } catch (error) {
        console.log(error);
        return emptyResponse;
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