'use client';

import { deleteReportById } from "../action";
import { toast } from "sonner";

interface Props {
    id: string,
    setDeleted: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function DeleteReport({id, setDeleted}: Props) {

    const handleDelete = () => {
        deleteReportById(id);
        toast.success("Report deleted successfully");
        setDeleted(true);
    };

    return (
        <div>
            <button onClick={handleDelete} className="flex items-center gap-1.5 rounded-md bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-200 transition-colors">
                Delete
            </button>
        </div>
    );
};