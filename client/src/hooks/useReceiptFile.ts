import { useState, useEffect } from "react";
import { getReceiptFile } from "@/app/(main)/receipts/action";

export function useReceiptFile(receiptId: string | undefined) {
  const [fileState, setFileState] = useState({
    url: null as string | null,
    type: null as string | null,
    name: null as string | null,
    loading: true,
    error: null as string | null,
  });

  useEffect(() => {
    if (!receiptId) { setFileState(prev => ({ ...prev, loading: false })); return; }
    let objectUrl: string | null = null;
    const fetch = async () => {
      setFileState(prev => ({ ...prev, loading: true, error: null }));
      const fileData = await getReceiptFile(receiptId);
      if (!fileData) {
        setFileState(prev => ({ ...prev, loading: false, error: "Unable to load receipt preview." }));
        return;
      }
      const binary = Uint8Array.from(atob(fileData.base64), (char) => char.charCodeAt(0));
      const blob = new Blob([binary], { type: fileData.contentType });
      objectUrl = URL.createObjectURL(blob);
      setFileState({ url: objectUrl, type: fileData.contentType, name: fileData.filename, loading: false, error: null });
    };
    fetch();
    return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [receiptId]);

  return {
    fileUrl: fileState.url,
    fileType: fileState.type,
    fileName: fileState.name,
    loadingFile: fileState.loading,
    fileError: fileState.error,
  };
}