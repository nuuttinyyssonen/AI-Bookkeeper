import { supabaseAdmin } from "../lib/supabase";

// Service functions for handling file uploads, downloads, and deletions with Supabase Storage
export async function uploadFileToSupabase(fileName: string, file: Express.Multer.File) {
    const { data, error } = await supabaseAdmin.storage
        .from("Bookkeeper-FileSystem")
        .upload(fileName, file.buffer, {
            cacheControl: '3600',
            upsert: true,
            contentType: file.mimetype
    });

    if(error) {
        throw error;
    }

    if(!data) {
        throw new Error("Upload failed!");
    }

    return {
        id: data.id,
        path: data.path,
        fullPath: data.fullPath
    }
}

export async function deleteFileFromSupabase(fileName: string) {
    const { data, error } = await supabaseAdmin.storage
        .from("Bookkeeper-FileSystem")
        .remove([`${fileName}`])
    
    if(error) {
        throw error;
    }

    return data;
}

export async function downloadFileFromSupabase(filePath: string) {
    const { data, error } = await supabaseAdmin.storage
        .from("Bookkeeper-FileSystem")
        .download(filePath);

    if (error) {
        throw error;
    }

    if (!data) {
        throw new Error("Failed to download file from Supabase");
    }

    return Buffer.from(await data.arrayBuffer());
}
