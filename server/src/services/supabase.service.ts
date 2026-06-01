import { supabase } from "../lib/supabase";

export async function uploadFileToSupabase(fileName: string, file: Express.Multer.File) {
    const { data, error } = await supabase.storage
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
    const { data, error } = await supabase.storage
        .from("Bookkeeper-FileSystem")
        .remove([`${fileName}`])
    
    if(error) {
        throw error;
    }

    return data;
}