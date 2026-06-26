'use client';

import { useState } from "react";
import { toast } from "sonner";
import { reactivateSubscription } from "../action";

export default function ReactivateSubscription() {
    const [isConfirming, setIsConfirming] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleReactivate = async () => {
        setIsLoading(true);
        const response = await reactivateSubscription();
        setIsLoading(false);

        if (response?.error) {
            toast.error(response.error);
            return;
        }

        toast.success('Subscription reactivated successfully');
        setIsConfirming(false);
    };

    if (isConfirming) {
        return (
            <div className="rounded-lg border border-teal-200 bg-teal-50 p-3 space-y-2">
                <p className="text-xs text-teal-800">
                    Your subscription will be reactivated and you will continue to be billed at the end of the current period.
                </p>
                <div className="flex gap-2">
                    <button
                        onClick={handleReactivate}
                        disabled={isLoading}
                        className="flex-1 h-8 rounded-md bg-teal-700 text-xs font-medium text-white hover:bg-teal-800 disabled:opacity-50 transition-colors"
                    >
                        {isLoading ? 'Reactivating...' : 'Confirm reactivation'}
                    </button>
                    <button
                        onClick={() => setIsConfirming(false)}
                        disabled={isLoading}
                        className="flex-1 h-8 rounded-md border border-slate-300 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    return (
        <button
            onClick={() => setIsConfirming(true)}
            className="h-9 px-4 rounded-md border border-teal-300 bg-white text-sm font-medium text-teal-700 hover:bg-teal-50 transition-colors"
        >
            Reactivate subscription
        </button>
    );
}