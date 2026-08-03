export type SelectedFile = {
    uri: string;
    name: string;
    type: string;
};

export type UseUploadReturn = {
    selectedFile: SelectedFile | null;
    isUploading: boolean;
    handleCamera: () => Promise<void>;
    handleFilePicker: () => Promise<void>;
    handleUpload: (isIncome: boolean) => Promise<void>;
    handleGallery: () => Promise<void>;
    handleClearFile: () => void;
};