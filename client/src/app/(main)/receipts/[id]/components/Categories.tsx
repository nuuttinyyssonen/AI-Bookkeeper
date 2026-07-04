'use client';

import { useTranslations } from 'next-intl';

interface Props {
    selectedCategory: string;
    handleCategoryChange: (category: string) => void;
}

const CATEGORY_TYPES = [
    "TOIMISTOKULUT",
    "MATKAKULUT",
    "EDUSTUSKULUT",
    "ATERIA",
    "MARKKINOINTI_JA_MAINONTA",
    "KALUSTO_JA_LAITTEET",
    "PALKKAKULUT_JA_PALKKIOT",
    "VUOKRA",
    "VAKUUTUKSET",
    "PUHELIN_JA_TIETOLIIKENNE",
    "OHJELMISTOT_JA_LISENSSIT",
    "KOULUTUS_JA_KURSSIT",
    "KIRJANPITO_JA_LAKIPALVELUT",
    "PANKKIKULUT",
    "AJONEUVOKULUT",
    "KOTITOIMISTON_KULUT",
    "YKSITYISOTOT",
    "MUUT_KULUT",
    "MYYNTI_TUOTTEET",
    "MYYNTI_PALVELUT",
    "MUUT_TULOT",
] as const;

export default function Categories({ selectedCategory, handleCategoryChange }: Props) {
    const t = useTranslations('categories');

    return (
        <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">{t('label')}</label>
            <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-950"
            >
                <option value="" disabled>{t('placeholder')}</option>
                {CATEGORY_TYPES.map((type) => (
                    <option key={type} value={type}>{t(type)}</option>
                ))}
            </select>
        </div>
    );
}