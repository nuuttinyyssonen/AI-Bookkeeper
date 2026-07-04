import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function Header() {
  const t = await getTranslations('receiptHeader');
  return (
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
              <h1 className="text-3xl font-semibold">{t('title')}</h1>
              <p className="mt-1 text-sm text-slate-600">{t('description')}</p>
          </div>
          <Link href="/receipts" className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-slate-50">
              {t('back')}
          </Link>
      </div>
  );
}