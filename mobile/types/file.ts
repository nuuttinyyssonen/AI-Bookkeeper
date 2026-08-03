export type SelectedFile = {
    uri: string;
    name: string;
    type: string;
};

export type UseUploadReturn = {
    selectedExpenseFile: SelectedFile | null;
    selectedIncomeFile: SelectedFile | null;
    isUploading: boolean;
    handleCamera: (isIncome: boolean) => Promise<void>;
    handleFilePicker: (isIncome: boolean) => Promise<void>;
    handleUpload: (isIncome: boolean) => Promise<void>;
    handleGallery: (isIncome: boolean) => Promise<void>;
    handleClearFile: (isIncome: boolean) => void;
};