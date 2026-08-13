import { getTranslations } from "next-intl/server";

export default async function Header() {
    const t = await getTranslations('uploadHeader');

    return (
        <header className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-4 sm:px-6 lg:px-8 -mx-4 -mt-6 sm:-mx-6 lg:-mx-8">
            <p className="text-sm font-medium text-teal-700 dark:text-teal-200">{t('label')}</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-normal text-slate-950 dark:text-slate-50 sm:text-3xl">
                {t('title')}
            </h1>
        </header>
    );
}