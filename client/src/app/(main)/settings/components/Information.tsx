'use client';

import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { User } from "@/app/types/user";

interface Props {
    user: User;
}

export default function Information({ user }: Props) {
    const t = useTranslations('information');
    const tDemo = useTranslations('demo');

    return (
        <div className="rounded-lg border border-border bg-white p-6 space-y-4">
            <h2 className="text-sm font-medium text-slate-950">{t('title')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">{t('firstName')}</p>
                    <p className="text-sm font-medium text-slate-950">{user.first_name}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">{t('lastName')}</p>
                    <p className="text-sm font-medium text-slate-950">{user.last_name}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">{t('email')}</p>
                    <p className="text-sm font-medium text-slate-950">{user.email}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">{t('phoneNumber')}</p>
                    <p className="text-sm font-medium text-slate-950">{user.phonenumber}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">{t('businessId')}</p>
                    <p className="text-sm font-medium text-slate-950">{user.business_id}</p>
                </div>
            </div>
            <div className="pt-2 flex gap-2">
                <button
                    onClick={() => toast.error(tDemo('informationBlocked'))}
                    className="h-9 px-4 rounded-md border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                    {t('editInformation')}
                </button>
            </div>
        </div>
    );
};
