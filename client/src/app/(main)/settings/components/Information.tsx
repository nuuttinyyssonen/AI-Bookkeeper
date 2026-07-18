'use client';

import { useState } from "react";
import { useTranslations } from "next-intl";
import { updateUserData } from "../action";
import { toast } from "sonner";
import { User } from "@/app/types/user";

interface Props {
    user: User;
}

export default function Information({ user }: Props) {
    const t = useTranslations('information');
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phonenumber: user.phonenumber,
        businessId: user.business_id
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setIsLoading(true);
        const response = await updateUserData(form.first_name, form.last_name, form.email, form.phonenumber, form.businessId);
        setIsLoading(false);

        if (response?.error) {
            toast.error(response.error);
            return;
        }

        toast.success(t('updateSuccess'));
        setIsEditing(false);
    };

    const handleCancel = () => {
        setForm({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phonenumber: user.phonenumber,
            businessId: user.business_id
        });
        setIsEditing(false);
    };

    return (
        <div className="rounded-lg border border-border bg-white p-6 space-y-4">
            <h2 className="text-sm font-medium text-slate-950">{t('title')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">{t('firstName')}</p>
                    {isEditing ? (
                        <input
                            name="first_name"
                            value={form.first_name}
                            onChange={handleChange}
                            className="w-full h-9 px-3 rounded-md border border-slate-300 text-sm text-slate-950 focus:outline-none focus:ring-1 focus:ring-teal-700"
                        />
                    ) : (
                        <p className="text-sm font-medium text-slate-950">{user.first_name}</p>
                    )}
                </div>
                <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">{t('lastName')}</p>
                    {isEditing ? (
                        <input
                            name="last_name"
                            value={form.last_name}
                            onChange={handleChange}
                            className="w-full h-9 px-3 rounded-md border border-slate-300 text-sm text-slate-950 focus:outline-none focus:ring-1 focus:ring-teal-700"
                        />
                    ) : (
                        <p className="text-sm font-medium text-slate-950">{user.last_name}</p>
                    )}
                </div>
                <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">{t('email')}</p>
                    {isEditing ? (
                        <input
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full h-9 px-3 rounded-md border border-slate-300 text-sm text-slate-950 focus:outline-none focus:ring-1 focus:ring-teal-700"
                        />
                    ) : (
                        <p className="text-sm font-medium text-slate-950">{user.email}</p>
                    )}
                </div>
                <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">{t('phoneNumber')}</p>
                    {isEditing ? (
                        <input
                            name="phonenumber"
                            value={form.phonenumber}
                            onChange={handleChange}
                            className="w-full h-9 px-3 rounded-md border border-slate-300 text-sm text-slate-950 focus:outline-none focus:ring-1 focus:ring-teal-700"
                        />
                    ) : (
                        <p className="text-sm font-medium text-slate-950">{user.phonenumber}</p>
                    )}
                </div>
                <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">{t('businessId')}</p>
                    {isEditing ? (
                        <input
                            name="businessId"
                            value={form.businessId}
                            onChange={handleChange}
                            className="w-full h-9 px-3 rounded-md border border-slate-300 text-sm text-slate-950 focus:outline-none focus:ring-1 focus:ring-teal-700"
                        />
                    ) : (
                        <p className="text-sm font-medium text-slate-950">{user.business_id}</p>
                    )}
                </div>
            </div>
            <div className="pt-2 flex gap-2">
                {isEditing ? (
                    <>
                        <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="h-9 px-4 rounded-md bg-teal-700 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-50 transition-colors"
                        >
                            {isLoading ? t('saving') : t('saveChanges')}
                        </button>
                        <button
                            onClick={handleCancel}
                            disabled={isLoading}
                            className="h-9 px-4 rounded-md border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                        >
                            {t('cancel')}
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="h-9 px-4 rounded-md border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        {t('editInformation')}
                    </button>
                )}
            </div>
        </div>
    );
};