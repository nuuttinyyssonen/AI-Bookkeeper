import api from "../services/api";
import { useState } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { SelectedFile } from "../types/file";
import { UseUploadReturn } from "../types/file";

export const useUpload = (): UseUploadReturn => {
    const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleCamera = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
            return Alert.alert("Virhe", "Kameran käyttöoikeus vaaditaan");
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ["images"],
            quality: 0.8,
        });

        if (!result.canceled) {
            const asset = result.assets[0];
            setSelectedFile({
                uri: asset.uri,
                name: asset.fileName ?? "receipt.jpg",
                type: asset.mimeType ?? "image/jpeg",
            });
        }
    };

    const handleFilePicker = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            type: ["image/*", "application/pdf"],
            copyToCacheDirectory: true,
        });

        if (!result.canceled) {
            const file = result.assets[0];
            setSelectedFile({
                uri: file.uri,
                name: file.name,
                type: file.mimeType ?? "application/octet-stream",
            });
        }
    };

    const handleGallery = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            quality: 0.8,
        });

        if (!result.canceled) {
            const asset = result.assets[0];
            setSelectedFile({
                uri: asset.uri,
                name: asset.fileName ?? "receipt.jpg",
                type: asset.mimeType ?? "image/jpeg",
            });
        }
    };

    const handleUpload = async (isIncome: boolean) => {
        if (!selectedFile) {
            return Alert.alert("Virhe", "Valitse tiedosto ensin");
        }

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("files", {
                uri: selectedFile.uri,
                name: selectedFile.name,
                type: selectedFile.type,
            } as any);

            formData.append("receipt_type", isIncome ? "INCOME" : "EXPENSE");

            const response = await api.post("/api/storage", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            console.log(response.data);

            // navigation.navigate("ReceiptView", { id: response.data.receipt.id });
        } catch (error: any) {
            Alert.alert("Virhe", error.response?.data?.message || "Tiedoston lähetys epäonnistui");
        } finally {
            setIsUploading(false);
        }
    };

    const handleClearFile = () => setSelectedFile(null);

    return {
        selectedFile,
        isUploading,
        handleCamera,
        handleFilePicker,
        handleUpload,
        handleClearFile,
        handleGallery
    };
};