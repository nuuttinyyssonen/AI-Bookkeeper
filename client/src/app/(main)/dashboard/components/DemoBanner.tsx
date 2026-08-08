import { getTranslations } from "next-intl/server";

export default async function DemoBanner() {
    const t = await getTranslations('demoBanner');
    const available = t.raw('available') as string[];
    const blocked = t.raw('blocked') as string[];

    return (
        <div className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-4">
            <div className="flex items-start gap-2">
                <span className="mt-0.5 inline-flex flex-none items-center rounded-full bg-teal-600 px-2 py-0.5 text-xs font-semibold text-white">
                    {t('badge')}
                </span>
                <div>
                    <p className="text-sm font-medium text-teal-900">{t('title')}</p>
                    <p className="mt-0.5 text-sm text-teal-800">{t('description')}</p>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">{t('availableTitle')}</p>
                    <ul className="mt-2 space-y-1.5">
                        {available.map((item) => (
                            <li key={item} className="flex items-start gap-2 text-sm text-teal-900">
                                <svg className="mt-0.5 h-3.5 w-3.5 flex-none text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{t('blockedTitle')}</p>
                    <ul className="mt-2 space-y-1.5">
                        {blocked.map((item) => (
                            <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                                <svg className="mt-0.5 h-3.5 w-3.5 flex-none text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
