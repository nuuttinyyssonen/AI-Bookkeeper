'use server';
import { cookies } from "next/headers"

export type UploadState = {
    error?: string;
    success?: string;
    upload_batch_id?: string;
};

export const UploadFiles = async (
    _prevState: UploadState,
    formData: FormData,
    isIncome: boolean
): Promise<UploadState> => {
    // Get JWT token from cookie to authenticate the request
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    // Validate that at least one valid file was provided
    const files = formData.getAll("files");
    if (files.length === 0 || files.every((file) => !(file instanceof File) || file.size === 0)) {
        return { error: "No files selected" };
    }

    try {
        formData.append("receipt_type", isIncome ? "INCOME" : "EXPENSE");
        // Send files to backend storage API
        const response = await fetch("http://localhost:5001/api/storage", {
            method: 'POST',
            headers: {
                Cookie: `token=${token}`
            },
            body: formData
        });

        if (!response.ok) {
            const data = await response.json();
            return { error: data.error || data.message || "Upload failed" };
        }

        const data = await response.json();
        const upload_batch_id = data[0].upload_batch_id;

        return { success: "Files uploaded successfully", upload_batch_id: upload_batch_id };
    } catch(error) {
        console.error(error);
        return { error: "Upload failed" };
    }
};

export const getBatchStatus = async (batchId: string): Promise<{ 
    total: number; 
    completed_documents: number, 
    pending_documents: number ,
    processing_documents: number
}> => {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const response = await fetch(`http://localhost:5001/api/receipt/status/${batchId}`, {
        method: 'GET',
        headers: {
            Cookie: `token=${token}`
        }
    });

    if (!response.ok) {
        throw new Error("Failed to get batch status");
    }

    const data = await response.json();
    console.log(data)

    return data;
};