"use client";

import { useActionState, useEffect, useRef } from "react";
import { UploadFiles, type UploadState } from "./action";
import { toast } from "sonner";

const initialState: UploadState = {};

export default function UploadButton() {
    const formRef = useRef<HTMLFormElement>(null);
    const [state, formAction, isPending] = useActionState(UploadFiles, initialState);

    useEffect(() => {
        if (state.success) {
            formRef.current?.reset();
            toast.success("File uploaded successfully")
        }
        if (state.error) {
            toast.error(state.error);
        }
    }, [state]);

    return (
        <form ref={formRef} action={formAction} className="grid gap-3">
            <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-2 rounded-md bg-teal-600 p-4 text-sm font-semibold text-white">
                    <span>Select documents</span>
                    <input
                        type="file"
                        name="files"
                        multiple
                        accept="image/jpeg,image/png,image/webp,application/pdf"
                        className="w-full text-sm text-white file:mr-3 file:rounded-md file:border-0 file:bg-white file:px-3 file:py-2 file:text-sm file:font-semibold file:text-teal-700"
                    />
                </label>
            </div>

            <div className="rounded-md border border-slate-200 bg-white p-4">
                <p className="text-sm text-slate-500">
                    Selected files are shown in the file fields above.
                </p>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="h-14 w-full rounded-md bg-teal-600 px-6 text-base font-semibold text-white hover:bg-teal-700 disabled:opacity-60 sm:h-12 sm:w-auto sm:text-sm"
                    >
                        {isPending ? "Uploading..." : "Upload files"}
                    </button>

                    <button
                        type="reset"
                        disabled={isPending}
                        className="h-14 w-full rounded-md bg-slate-950 px-6 text-base font-semibold text-white hover:bg-slate-800 disabled:opacity-60 sm:h-12 sm:w-auto sm:text-sm"
                    >
                        Remove
                    </button>
                </div>
            </div>
        </form>
    );
}
