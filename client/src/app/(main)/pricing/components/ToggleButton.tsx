'use client';

import { useTranslations } from 'next-intl';

interface Props {
    isYearly: boolean;
    setIsYearly: (value: boolean) => void;
}

export default function ToggleButton({ isYearly, setIsYearly }: Props) {
    const t = useTranslations('toggleButton');

    return (
        <div className="flex flex-col items-center gap-2">
            {isYearly && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                    {t('save')}
                </span>
            )}
            <div className="flex items-center gap-3">
                <span className={`text-sm ${!isYearly ? 'text-slate-950 font-medium' : 'text-muted-foreground'}`}>
                    {t('monthly')}
                </span>
                <button
                    onClick={() => setIsYearly(!isYearly)}
                    className={`relative inline-flex w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none ${isYearly ? 'bg-teal-700' : 'bg-slate-200'}`}
                >
                    <span className={`inline-block w-3.5 h-3.5 mt-[3px] rounded-full bg-white transition-transform duration-200 ${isYearly ? 'translate-x-[22px]' : 'translate-x-[3px]'}`} />
                </button>
                <span className={`text-sm ${isYearly ? 'text-slate-950 font-medium' : 'text-muted-foreground'}`}>
                    {t('yearly')}
                </span>
            </div>
        </div>
    );
}