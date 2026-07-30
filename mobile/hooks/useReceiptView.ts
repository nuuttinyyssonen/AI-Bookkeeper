import { useState, useEffect } from "react";
import { VatForm } from "../types/receipt";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";
import api from "../services/api";

export function useReceiptView(id: string, navigation: any) {
    const [receipt, setReceipt] = useState<any>();
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [isDeductible, setIsDeductible] = useState<boolean>(true);
    const [deductiblePercentage, setDeductiblePercentage] = useState<number>(100);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [editForm, setEditForm] = useState({ vendor_name: "", total_amount: "", receipt_date: "" });
    const [editVats, setEditVats] = useState<VatForm[]>([]);

    // Entering edit mode, seeding form fields from current receipt
    const handleEdit = () => {
        setEditForm({
            vendor_name: receipt.vendor_name,
            total_amount: String(receipt.total_amount),
            receipt_date: new Date(receipt.receipt_date).toISOString().slice(0, 10),
        });
        setEditVats(
            receipt.receiptVats.map((vat: any) => ({
                id: vat.id,
                rate: String(vat.rate),
                net_amount: String(vat.net_amount),
                vat_amount: String(vat.vat_amount),
                total: String(vat.total),
            }))
        );
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const handleVatFieldChange = (vatId: string, field: keyof Omit<VatForm, "id">, value: string) => {
        setEditVats((prev) => prev.map((vat) => (vat.id === vatId ? { ...vat, [field]: value } : vat)));
    };

    // Request to save edited receipt fields
    const handleSaveEdit = async () => {
        setIsSaving(true);
        const updatedVats = editVats.map((vat) => ({
            id: vat.id,
            rate: parseFloat(vat.rate),
            net_amount: parseFloat(vat.net_amount),
            vat_amount: parseFloat(vat.vat_amount),
            total: parseFloat(vat.total),
        }));
        try {
            await api.put(`/api/receipt/${id}`, {
                vendor_name: editForm.vendor_name,
                total_amount: parseFloat(editForm.total_amount),
                receipt_date: editForm.receipt_date,
                vats: updatedVats,
            });

            setReceipt((prev: any) => ({
                ...prev,
                vendor_name: editForm.vendor_name,
                total_amount: parseFloat(editForm.total_amount),
                receipt_date: editForm.receipt_date,
                receiptVats: prev.receiptVats.map((vat: any) => updatedVats.find((v) => v.id === vat.id) ?? vat),
            }));
            Toast.show({
                type: "success",
                text1: "Onnistui",
                text2: "Kuitin tiedot päivitetty"
            });
            setIsEditing(false);
        } catch (error: any) {
            Alert.alert(error.response?.data?.message || "Virhe, Kuitin päivittäminen epäonnistui");
        } finally {
            setIsSaving(false);
        }
    };

    // Request to change category on receipt
    const handleCategoryChange = async (category: string) => {
        const previousCategory = selectedCategory;
        setSelectedCategory(category);
        try {
            await api.put(`/api/receipt/category/${id}`, { category });
        } catch (error: any) {
            setSelectedCategory(previousCategory);
            Alert.alert(error.response?.data?.message || "Virhe, kategorian päivittäminen epäonnistui");
        }
    };

    // Request to toggle deductible status on receipt
    const handleDeductibleToggle = async () => {
        const previousValue = isDeductible;
        const newValue = !isDeductible;
        setIsDeductible(newValue);
        try {
            await api.put(`/api/receipt/is_deductible/${id}`, { isDeductible: newValue });
        } catch (error: any) {
            setIsDeductible(previousValue);
            Alert.alert(error.response?.data?.message || "Virhe, vähennyskelpoisuuden päivittäminen epäonnistui");
        }
    };

    // Request to change deductible percentage on receipt
    const handleDeductiblePercentageChange = async (value: number) => {
        const previousValue = deductiblePercentage;
        setDeductiblePercentage(value);
        try {
            await api.put(`/api/receipt/percentage/${id}`, { deductibilityPercentage: value });
        } catch (error: any) {
            setDeductiblePercentage(previousValue);
            Alert.alert(error.response?.data?.message || "Virhe, prosenttiosuuden päivittäminen epäonnistui");
        }
    };

    // Downloading file for image preview
    const handleDownload = async (receipt_id: string) => {
        const response = await api.get(`/api/storage/fileUrl/${receipt_id}`);
        setFileUrl(response.data.url);
    };

    // Request to delete receipt by ID
    const handleDeleteReceipt = async () => {
        Alert.alert(
            "Poista kuitti",
            "Haluatko varmasti poistaa kuitin?",
            [
                { text: "Peruuta", style: "cancel" },
                {
                    text: "Poista",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const response = await api.delete(`/api/storage/${id}`);
                            Toast.show({
                                type: "success",
                                text1: "Onnistui",
                                text2: response.data.message
                            });
                            navigation.goBack();
                        } catch(error: any) {
                            Alert.alert(error.response?.data?.message || "Virhe, Kuitin poistaminen epäonnistui");
                        }
                    }
                }
            ]
        );
    };

    // Fetching all data of receipt
    useEffect(() => {
        const fetchReceiptById = async() => {
            try {
                const response = await api.get(`/api/receipt/${id}`);
                setReceipt(response.data.receipt);
                setSelectedCategory(response.data.receipt.category?.type ?? "");
                setIsDeductible(response.data.receipt.is_deductible ?? true);
                setDeductiblePercentage(response.data.receipt.vat_deductibility_percentage ?? 100);
                await handleDownload(id);
            } catch(error: any) {
                return Alert.alert(error.response.data?.message || "Virhe, Kuitin hakeminen epäonnistui");
            }
        };
        fetchReceiptById();
    }, []);

    return {
        receipt, fileUrl, selectedCategory, isDeductible,
        deductiblePercentage, isEditing, isSaving,
        editForm, setEditForm, editVats,
        handleEdit, handleCancelEdit, handleSaveEdit,
        handleVatFieldChange, handleCategoryChange,
        handleDeductibleToggle, handleDeductiblePercentageChange,
        handleDeleteReceipt,
    };
};