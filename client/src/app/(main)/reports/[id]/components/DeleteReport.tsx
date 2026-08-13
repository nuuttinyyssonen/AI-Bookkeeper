'use client';

import { useTranslations } from "next-intl";
import { deleteReportById } from "../action";
import { toast } from "sonner";

interface Props {
    id: string,
    setDeleted: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function DeleteReport({id, setDeleted}: Props) {
    const t = useTranslations('deleteReport');

    const handleDelete = () => {
        deleteReportById(id);
        toast.success(t('deleteSuccess'));
        setDeleted(true);
    };

    return (
        <div>
            <button onClick={handleDelete} className="flex items-center gap-1.5 rounded-md bg-red-100 dark:bg-red-800 px-4 py-2 text-sm font-semibold text-red-700 dark:text-red-200 hover:bg-red-200 hover:dark:bg-red-700 transition-colors">
                {t('delete')}
            </button>
        </div>
    );
};