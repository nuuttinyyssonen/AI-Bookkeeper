export const downloadReceiptsExcel = async (params: {
    type?: "EXPENSE" | "INCOME";
    from?: string;
    to?: string;
    search?: string;
}) => {
    const searchParams = new URLSearchParams();
    if (params.type) searchParams.set("type", params.type);
    if (params.from) searchParams.set("from", params.from);
    if (params.to) searchParams.set("to", params.to);
    if (params.search) searchParams.set("search", params.search);

    const response = await fetch(`http://localhost:5001/api/receipt/create/excel?${searchParams.toString()}`, {
        method: 'GET',
        credentials: 'include',
    });

    if (!response.ok) return;

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipts-${params.type?.toLowerCase() ?? 'all'}-${Date.now()}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
};