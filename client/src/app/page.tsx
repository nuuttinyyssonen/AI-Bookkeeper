import {
  ScanLine,
  Calculator,
  FileBarChart,
  MessagesSquare,
  Receipt,
  Wallet,
  AlertTriangle,
  Check,
  ArrowRight,
  Sparkles,
} from "lucide-react";

function Nav() {
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
          <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
          <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
          <a href="#problem" className="hover:text-slate-900 transition-colors">Why us</a>
        </nav>
        <div className="flex items-center gap-3">
          <a href="/login" className="hidden text-sm font-medium text-slate-600 hover:text-slate-900 sm:inline">Sign in</a>
          <a href="/signup" className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700">
            Try for free
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-gradient-to-b from-teal-50 to-white">
      <div className="mx-auto max-w-6xl px-6 pt-20 pb-24 text-center md:pt-28 md:pb-32">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-600" />
          Built for Finnish small businesses
        </div>
        <h1 className="mx-auto max-w-3xl text-balance text-4xl font-semibold tracking-tight text-slate-900 md:text-6xl">
          Automate your bookkeeping with AI
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-slate-500 md:text-xl">
          Save hours every week and hundreds of euros every month. Snap a photo of a receipt — AI handles the rest, including Finnish VAT.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href="/signup" className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-teal-700 sm:w-auto">
            Try for free <ArrowRight className="h-4 w-4" />
          </a>
          <a href="#features" className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-3 text-base font-medium text-slate-900 transition-colors hover:bg-slate-50 sm:w-auto">
            See features
          </a>
        </div>
        <p className="mt-5 text-sm text-slate-400">No credit card required · 14-day free trial</p>
      </div>
    </section>
  );
}

function Problem() {
  const items = [
    { icon: Receipt, title: "Drowning in receipts", text: "Manually entering every receipt, invoice and bank line eats hours every week." },
    { icon: Wallet, title: "Accountants are expensive", text: "Traditional bookkeepers charge 200–600€ per month — a lot for a small business." },
    { icon: AlertTriangle, title: "Mistakes cost real money", text: "A wrong VAT rate or missed deduction can mean fines or thousands lost each year." },
  ];
  return (
    <section id="problem" className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-teal-600">The problem</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">Bookkeeping shouldn't be this painful</h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {items.map((it) => (
            <div key={it.title} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-slate-100 text-slate-600">
                <it.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-900">{it.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{it.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    { icon: ScanLine, title: "OCR receipt scanning", text: "Snap a photo or upload a PDF — AI extracts vendor, date, amount, VAT and category in seconds." },
    { icon: Calculator, title: "Automatic VAT calculation", text: "Finnish VAT rates (0%, 10%, 14%, 24%) applied correctly on every transaction, every time." },
    { icon: FileBarChart, title: "Instant income statements", text: "Monthly and yearly reports generated automatically. Export to PDF or share with your accountant." },
    { icon: MessagesSquare, title: "AI accounting assistant", text: "Ask anything in plain Finnish or English: 'How much did I spend on travel last quarter?'" },
  ];
  return (
    <section id="features" className="border-t border-slate-200">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-teal-600">Features</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">Everything you need to run the books</h2>
          <p className="mt-4 text-slate-500">Replace spreadsheets, receipt boxes and back-and-forth emails with one calm dashboard.</p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-teal-50 text-teal-600">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-2 leading-relaxed text-slate-500">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const tiers = [
    {
      name: "Free trial", price: "0€", period: "for 14 days", desc: "Test every feature, no card needed.",
      features: ["Up to 25 receipts", "VAT calculation", "Monthly report", "Email support"],
      cta: "Start free", href: "/signup", highlight: false,
    },
    {
      name: "Basic", price: "19€", period: "/ month", desc: "For freelancers and toiminimi.",
      features: ["Unlimited receipt scanning", "Automatic Finnish VAT", "Monthly & yearly reports", "AI assistant (100 queries / mo)", "Email support"],
      cta: "Choose Basic", href: "/signup", highlight: true,
    },
    {
      name: "Premium", price: "39€", period: "/ month", desc: "For growing small businesses.",
      features: ["Everything in Basic", "Unlimited AI assistant", "Bank integration", "Multi-user access", "Priority support"],
      cta: "Choose Premium", href: "/signup", highlight: false,
    },
  ];
  return (
    <section id="pricing" className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-teal-600">Pricing</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">Simple pricing. Big savings.</h2>
          <p className="mt-4 text-slate-500">10× cheaper than a traditional accountant. Cancel anytime.</p>
        </div>
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {tiers.map((t) => (
            <div key={t.name} className={t.highlight ? "relative rounded-2xl border-2 border-teal-600 bg-white p-8 shadow-md lg:-mt-4" : "relative rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"}>
              {t.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-teal-600 px-3 py-1 text-xs font-medium text-white">Most popular</div>
              )}
              <h3 className="text-lg font-semibold text-slate-900">{t.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{t.desc}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-semibold tracking-tight text-slate-900">{t.price}</span>
                <span className="text-sm text-slate-500">{t.period}</span>
              </div>
              <ul className="mt-6 space-y-3">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <Check className="mt-0.5 h-4 w-4 flex-none text-teal-600" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a href={t.href} className={t.highlight ? "mt-8 inline-flex w-full items-center justify-center rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-700" : "mt-8 inline-flex w-full items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-50"}>
                {t.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section id="cta" className="border-t border-slate-200">
      <div className="mx-auto max-w-4xl px-6 py-24 text-center md:py-32">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">Start your free trial today</h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-slate-500">Join hundreds of Finnish entrepreneurs who never want to open a receipt folder again.</p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href="/signup" className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-teal-700">
            Get started free <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        <p className="mt-4 text-xs text-slate-400">14 days free · No credit card · Cancel anytime</p>
      </div>
    </section>
  );
}

function Footer() {
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
          <a href="#" className="hover:text-slate-900">Privacy</a>
          <a href="#" className="hover:text-slate-900">Terms</a>
          <a href="#" className="hover:text-slate-900">Contact</a>
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