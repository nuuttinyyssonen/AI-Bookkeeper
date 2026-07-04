import { getTranslations } from "next-intl/server";
import {
  ScanLine, Calculator, FileBarChart, MessagesSquare,
  Receipt, Wallet, AlertTriangle, Check, ArrowRight, Sparkles,
} from "lucide-react";

import LanguageSwitcher from "@/components/LanguageSwitcher";

async function Nav() {
  const t = await getTranslations('home.nav');
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#top" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-teal-600 text-white">
            <Sparkles className="h-4 w-4" />
          </span>
          <span>AI Bookkeeper</span>
        </a>
        <nav className="hidden items-center gap-8 text-sm text-slate-500 md:flex">
          <a href="#features" className="hover:text-slate-900 transition-colors">{t('features')}</a>
          <a href="#pricing" className="hover:text-slate-900 transition-colors">{t('pricing')}</a>
          <a href="#problem" className="hover:text-slate-900 transition-colors">{t('whyUs')}</a>
          <LanguageSwitcher />
        </nav>
        <div className="flex items-center gap-3">
          <a href="/login" className="hidden text-sm font-medium text-slate-600 hover:text-slate-900 sm:inline">{t('signIn')}</a>
          <a href="/signup" className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700">
            {t('tryFree')}
          </a>
        </div>
      </div>
    </header>
  );
}

async function Hero() {
  const t = await getTranslations('home.hero');
  return (
    <section id="top" className="relative overflow-hidden bg-gradient-to-b from-teal-50 to-white">
      <div className="mx-auto max-w-6xl px-6 pt-20 pb-24 text-center md:pt-28 md:pb-32">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-600" />
          {t('badge')}
        </div>
        <h1 className="mx-auto max-w-3xl text-balance text-4xl font-semibold tracking-tight text-slate-900 md:text-6xl">
          {t('title')}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-slate-500 md:text-xl">
          {t('description')}
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href="/signup" className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-teal-700 sm:w-auto">
            {t('tryFree')} <ArrowRight className="h-4 w-4" />
          </a>
          <a href="#features" className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-3 text-base font-medium text-slate-900 transition-colors hover:bg-slate-50 sm:w-auto">
            {t('seeFeatures')}
          </a>
        </div>
        <p className="mt-5 text-sm text-slate-400">{t('footnote')}</p>
      </div>
    </section>
  );
}

async function Problem() {
  const t = await getTranslations('home.problem');
  const items = t.raw('items') as Array<{ title: string; text: string }>;
  const icons = [Receipt, Wallet, AlertTriangle];

  return (
    <section id="problem" className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-teal-600">{t('label')}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">{t('title')}</h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {items.map((item, i) => {
            const Icon = icons[i];
            return (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-slate-100 text-slate-600">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{item.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

async function Features() {
  const t = await getTranslations('home.features');
  const items = t.raw('items') as Array<{ title: string; text: string }>;
  const icons = [ScanLine, Calculator, FileBarChart, MessagesSquare];

  return (
    <section id="features" className="border-t border-slate-200">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-teal-600">{t('label')}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">{t('title')}</h2>
          <p className="mt-4 text-slate-500">{t('description')}</p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {items.map((item, i) => {
            const Icon = icons[i];
            return (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-teal-50 text-teal-600">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 leading-relaxed text-slate-500">{item.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

async function Pricing() {
  const t = await getTranslations('home.pricing');
  const tierData = t.raw('tiers') as Array<{ name: string; price: string; period: string; desc: string; features: string[]; cta: string }>;
  const tierMeta = [
    { highlight: false, href: "/signup" },
    { highlight: true, href: "/signup" },
    { highlight: false, href: "/signup" },
  ];
  const tiers = tierData.map((tier, i) => ({ ...tier, ...tierMeta[i] }));

  return (
    <section id="pricing" className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-teal-600">{t('label')}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">{t('title')}</h2>
          <p className="mt-4 text-slate-500">{t('description')}</p>
        </div>
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div key={tier.name} className={tier.highlight ? "relative rounded-2xl border-2 border-teal-600 bg-white p-8 shadow-md lg:-mt-4" : "relative rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"}>
              {tier.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-teal-600 px-3 py-1 text-xs font-medium text-white">{t('mostPopular')}</div>
              )}
              <h3 className="text-lg font-semibold text-slate-900">{tier.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{tier.desc}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-semibold tracking-tight text-slate-900">{tier.price}</span>
                <span className="text-sm text-slate-500">{tier.period}</span>
              </div>
              <ul className="mt-6 space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <Check className="mt-0.5 h-4 w-4 flex-none text-teal-600" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a href={tier.href} className={tier.highlight ? "mt-8 inline-flex w-full items-center justify-center rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-700" : "mt-8 inline-flex w-full items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-50"}>
                {tier.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

async function CTA() {
  const t = await getTranslations('home.cta');
  return (
    <section id="cta" className="border-t border-slate-200">
      <div className="mx-auto max-w-4xl px-6 py-24 text-center md:py-32">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">{t('title')}</h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-slate-500">{t('description')}</p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href="/signup" className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-teal-700">
            {t('button')} <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        <p className="mt-4 text-xs text-slate-400">{t('footnote')}</p>
      </div>
    </section>
  );
}

async function Footer() {
  const t = await getTranslations('home.footer');
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-slate-500 sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded-md bg-teal-600 text-white">
            <Sparkles className="h-3 w-3" />
          </span>
          <span>© {new Date().getFullYear()} AI Bookkeeper</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-slate-900">{t('privacy')}</a>
          <a href="#" className="hover:text-slate-900">{t('terms')}</a>
          <a href="#" className="hover:text-slate-900">{t('contact')}</a>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <main>
        <Hero />
        <Problem />
        <Features />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}