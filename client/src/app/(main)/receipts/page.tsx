import { getReceipts } from "./action";
import { ReceiptData } from "./receiptData";

export default async function ReceiptsPage() {
    const receipts = await getReceipts();
    return (
        <div className="px-6 py-8">
            <ReceiptData receiptList={receipts} />
        </div>
    );
}

