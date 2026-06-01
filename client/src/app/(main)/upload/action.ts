'use server';
import { cookies } from "next/headers"

export const UploadFiles = async (formData: FormData) => {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    try {
        const response = await fetch("http://localhost:5001/api/storage", {
            method: 'POST',
            headers: {
                Cookie: `token=${token}`
            },
            body: formData
        })

        if(!response.ok) {
            const data = await response.json();
            return { error: data.error || "Upload failed" };
        }

        const data = await response.json();
        return { success: true, message: "Files uploaded successfully" };
    } catch(error) {
        console.error(error);
    }
};