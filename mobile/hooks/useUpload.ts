import api from "../services/api";
import { useState } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { SelectedFile } from "../types/file";
import { UseUploadReturn } from "../types/file";
import Toast from "react-native-toast-message";

export const useUpload = (): UseUploadReturn => {
    const [selectedIncomeFile, setSelectedIncomeFile] = useState<SelectedFile | null>(null);
    const [selectedExpenseFile, setSelectedExpenseFile] = useState<SelectedFile | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState<{ completed: number; total: number } | null>(null);

    const handleCamera = async (isIncome: boolean) => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
            return Alert.alert("Virhe", "Kameran käyttöoikeus vaaditaan");
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ["images"],
            quality: 0.8,
        });

        if (!result.canceled) {
            const file = result.assets[0];
            const selectedFile = {
                uri: file.uri,
                name: file.fileName ?? "receipt.jpg",
                type: file.mimeType ?? "image/jpeg",
            }
            isIncome ? setSelectedIncomeFile(selectedFile) : setSelectedExpenseFile(selectedFile);
        }
    };

    const handleFilePicker = async (isIncome: boolean) => {
        const result = await DocumentPicker.getDocumentAsync({
            type: ["image/*", "application/pdf"],
            copyToCacheDirectory: true,
        });

        if (!result.canceled) {
            const file = result.assets[0];
            const selectedFile = {
                uri: file.uri,
                name: file.name,
                type: file.mimeType ?? "application/octet-stream",
            };
            isIncome ? setSelectedIncomeFile(selectedFile) : setSelectedExpenseFile(selectedFile);
        }
    };

    const handleGallery = async (isIncome: boolean) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            quality: 0.8,
        });

        if (!result.canceled) {
            const file = result.assets[0];
            const selectedFile = {
                uri: file.uri,
                name: file.fileName ?? "receipt.jpg",
                type: file.mimeType ?? "image/jpeg",
            }
            isIncome ? setSelectedIncomeFile(selectedFile) : setSelectedExpenseFile(selectedFile);
        }
    };

    const pollBatchStatus = (batchId?: string) => {
        return new Promise<{ pending_documents: number; completed_documents: number; total: number; processing_documents: number; failed_documents: number }>((resolve, reject) => {
            const interval = setInterval(async () => {
                try {
                    if (!batchId) return;
                    const response = await api.get(`/api/receipt/status/${batchId}`);
                    const data = response.data
                    console.log("Poll response:", data);
                    setProgress({ completed: data.completed_documents, total: data.total });
                    if (data.pending_documents === 0 && data.processing_documents === 0) {
                        clearInterval(interval);
                        resolve(data);
                    }
                } catch (error) {
                    clearInterval(interval);
                    reject(error);
                }
            }, 3000);
        });
    };

    const handleUpload = async (isIncome: boolean) => {
        setIsUploading(true);
        try {
            const file = isIncome ? selectedIncomeFile : selectedExpenseFile;

            if (!file) {
                return Alert.alert("Virhe", "Valitse tiedosto ensin");
            }

            const formData = new FormData();
            formData.append("files", {
                uri: file.uri,
                name: file.name,
                type: file.type,
            } as any);
            

            formData.append("receipt_type", isIncome ? "INCOME" : "EXPENSE");

            const response = await api.post("/api/storage", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            try {
                const data = await pollBatchStatus(response.data[0].upload_batch_id);
                setProgress(null);
                Toast.show({
                    type: "success",
                    text1: "Onnistui",
                    text2: `${data.completed_documents}/${data.total} kuittia analysoitu`
                });
                if (data.failed_documents > 0) {
                    Toast.show({
                        type: "error",
                        text1: "Virhe",
                        text2: `${data.failed_documents} kuittia epäonnistui analysoinnissa`
                    });
                }
            } catch {
                setProgress(null);
                Toast.show({
                    type: "error",
                    text1: "Virhe",
                    text2: "Analyysi epäonnistui"
                });
            }
        } catch (error: any) {
            Alert.alert("Virhe", error.response?.data?.message || "Tiedoston lähetys epäonnistui");
        } finally {
            setIsUploading(false);
            handleClearFile(isIncome)
        }
    };

    const handleClearFile = (isIncome: boolean) => {
        isIncome ? setSelectedIncomeFile(null) : setSelectedExpenseFile(null);
    }

    return {
        selectedIncomeFile,
        selectedExpenseFile,
        isUploading,
        handleCamera,
        handleFilePicker,
        handleUpload,
        handleClearFile,
        handleGallery,
        pollBatchStatus,
        progress
    };
};