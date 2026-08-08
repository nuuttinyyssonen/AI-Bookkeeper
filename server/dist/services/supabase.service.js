"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFileToSupabase = uploadFileToSupabase;
exports.deleteFileFromSupabase = deleteFileFromSupabase;
exports.downloadFileFromSupabase = downloadFileFromSupabase;
const supabase_1 = require("../lib/supabase");
// Service functions for handling file uploads, downloads, and deletions with Supabase Storage
async function uploadFileToSupabase(fileName, file) {
    const { data, error } = await supabase_1.supabaseAdmin.storage
        .from("Bookkeeper-FileSystem")
        .upload(fileName, file.buffer, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.mimetype
    });
    if (error) {
        throw error;
    }
    if (!data) {
        throw new Error("Upload failed!");
    }
    return {
        id: data.id,
        path: data.path,
        fullPath: data.fullPath
    };
}
async function deleteFileFromSupabase(fileName) {
    const { data, error } = await supabase_1.supabaseAdmin.storage
        .from("Bookkeeper-FileSystem")
        .remove([`${fileName}`]);
    if (error) {
        throw error;
    }
    return data;
}
async function downloadFileFromSupabase(filePath) {
    const { data, error } = await supabase_1.supabaseAdmin.storage
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
