'use server';
import { cookies } from "next/headers"

export type UploadState = {
    error?: string;
    success?: string;
};

export const UploadFiles = async (
    _prevState: UploadState,
    formData: FormData
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

        return { success: "Files uploaded successfully" };
    } catch(error) {
        console.error(error);
        return { error: "Upload failed" };
    }
};