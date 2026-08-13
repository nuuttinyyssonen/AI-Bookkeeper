'use client';

import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button";

interface Props {
    handleDelete: () => void;
    isEditing: boolean;
    isLoading: boolean;
    handleSave: () => void;
    handleCancel: () => void;
}

export default function Buttons({ handleDelete, isEditing, isLoading, handleSave, handleCancel }: Props) {
    const t = useTranslations('receiptButtons');

    return (
        <div className="mt-6 flex flex-wrap gap-3">
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
                        className="h-9 px-4 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-950 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 hover:dark:bg-slate-900 disabled:opacity-50 transition-colors"
                    >
                        {t('cancel')}
                    </button>
                </>
            ) : (
                <>
                    <Button className="bg-red-600 dark:bg-red-700 text-white hover:bg-red-700 hover:dark:bg-red-600" onClick={handleDelete}>{t('deleteReceipt')}</Button>
                    <Button className="bg-teal-600 text-white hover:bg-teal-700">{t('downloadPdf')}</Button>
                </>
            )}
        </div>
    );
}