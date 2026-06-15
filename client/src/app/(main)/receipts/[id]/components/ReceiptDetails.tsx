import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Receipt } from "@/lib/receipts";

interface Props {
    receipt: Receipt
};

export default function ReceiptDetails({receipt}: Props) {
    return(
        <CardHeader>
            <div>
            <CardTitle>{receipt.vendor_name}</CardTitle>
            <CardDescription>{new Date(receipt.receipt_date).toLocaleDateString("fi-FI", { day: "numeric", month: "numeric", year: "numeric" })}</CardDescription>
            </div>
            <div className="text-right">
            <div className="text-lg font-semibold">{receipt.total_amount}</div>
            </div>
        </CardHeader>
    );
};