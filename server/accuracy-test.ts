// accuracy-test.ts
// Aja: npx tsx accuracy-test.ts
// Sijoita server/-kansioon

/// <reference types="node" />

import { prisma } from './src/lib/prisma';
import * as fs from "fs";
import * as path from "path";


// ─── Toleranssit ────────────────────────────────────────────────────────────
const AMOUNT_TOLERANCE = 0.05; // €
const VAT_AMOUNT_TOLERANCE = 0.05;

// ─── Tyypit ─────────────────────────────────────────────────────────────────
interface GTVat {
  rate: number;
  net_amount: number;
  vat_amount: number;
  total: number;
}

interface GTReceipt {
  vendor_name: string;
  total_amount: number;
  receipt_date: string;
  receipt_type: string;
  is_deductible: boolean;
  vat_deductibility_percentage: string;
  receiptVats: GTVat[];
}

interface FieldResult {
  correct: number;
  total: number;
  errors: string[];
}

// ─── Apufunktiot ─────────────────────────────────────────────────────────────
function within(a: number, b: number, tol: number) {
  return Math.abs(a - b) <= tol;
}

function normalizeVendor(name: string) {
  return name.toLowerCase().trim().replace(/\s+/g, " ");
}

function isSameDate(a: Date | string, b: Date | string) {
  return new Date(a).toISOString().slice(0, 10) === new Date(b).toISOString().slice(0, 10);
}

// Matchaa ground truth -rivi DB-kuitteihin vendor+total+date avaimella
function matchReceipt(gt: GTReceipt, dbReceipts: any[]): any | null {
  return (
    dbReceipts.find(
      (db) =>
        normalizeVendor(db.vendor_name) === normalizeVendor(gt.vendor_name) &&
        within(db.total_amount, gt.total_amount, AMOUNT_TOLERANCE) &&
        isSameDate(db.receipt_date, gt.receipt_date)
    ) ?? null
  );
}

// ─── Päävertailu ─────────────────────────────────────────────────────────────
function compareReceipts(gt: GTReceipt[], db: any[]) {
  const fields: Record<string, FieldResult> = {
    vendor_name:                { correct: 0, total: 0, errors: [] },
    total_amount:               { correct: 0, total: 0, errors: [] },
    receipt_date:               { correct: 0, total: 0, errors: [] },
    receipt_type:               { correct: 0, total: 0, errors: [] },
    is_deductible:              { correct: 0, total: 0, errors: [] },
    vat_deductibility_percentage: { correct: 0, total: 0, errors: [] },
    vat_rates:                  { correct: 0, total: 0, errors: [] },
    vat_net_amounts:            { correct: 0, total: 0, errors: [] },
    vat_amounts:                { correct: 0, total: 0, errors: [] },
    vat_totals:                 { correct: 0, total: 0, errors: [] },
    vat_row_count:              { correct: 0, total: 0, errors: [] },
  };

  let matched = 0;
  let unmatched: GTReceipt[] = [];

  for (const gtRow of gt) {
    const dbRow = matchReceipt(gtRow, db);
    if (!dbRow) {
      unmatched.push(gtRow);
      continue;
    }
    matched++;

    const label = `${gtRow.vendor_name} (${gtRow.receipt_date.slice(0, 10)})`;

    // vendor_name
    fields.vendor_name.total++;
    if (normalizeVendor(dbRow.vendor_name) === normalizeVendor(gtRow.vendor_name)) {
      fields.vendor_name.correct++;
    } else {
      fields.vendor_name.errors.push(`${label}: GT="${gtRow.vendor_name}" DB="${dbRow.vendor_name}"`);
    }

    // total_amount
    fields.total_amount.total++;
    if (within(dbRow.total_amount, gtRow.total_amount, AMOUNT_TOLERANCE)) {
      fields.total_amount.correct++;
    } else {
      fields.total_amount.errors.push(`${label}: GT=${gtRow.total_amount} DB=${dbRow.total_amount}`);
    }

    // receipt_date
    fields.receipt_date.total++;
    if (isSameDate(dbRow.receipt_date, gtRow.receipt_date)) {
      fields.receipt_date.correct++;
    } else {
      fields.receipt_date.errors.push(`${label}: GT=${gtRow.receipt_date.slice(0,10)} DB=${new Date(dbRow.receipt_date).toISOString().slice(0,10)}`);
    }

    // receipt_type
    fields.receipt_type.total++;
    if (dbRow.receipt_type === gtRow.receipt_type) {
      fields.receipt_type.correct++;
    } else {
      fields.receipt_type.errors.push(`${label}: GT=${gtRow.receipt_type} DB=${dbRow.receipt_type}`);
    }

    // is_deductible
    fields.is_deductible.total++;
    if (dbRow.is_deductible === gtRow.is_deductible) {
      fields.is_deductible.correct++;
    } else {
      fields.is_deductible.errors.push(`${label}: GT=${gtRow.is_deductible} DB=${dbRow.is_deductible}`);
    }

    // vat_deductibility_percentage
    fields.vat_deductibility_percentage.total++;
    if (within(Number(dbRow.vat_deductibility_percentage), Number(gtRow.vat_deductibility_percentage), 0.01)) {
      fields.vat_deductibility_percentage.correct++;
    } else {
      fields.vat_deductibility_percentage.errors.push(`${label}: GT=${gtRow.vat_deductibility_percentage} DB=${dbRow.vat_deductibility_percentage}`);
    }

    // VAT-rivit
    const gtVats = [...(gtRow.receiptVats ?? [])].sort((a, b) => a.rate - b.rate);
    const dbVats = [...(dbRow.receiptVats ?? [])].sort((a: any, b: any) => a.rate - b.rate);

    fields.vat_row_count.total++;
    if (gtVats.length === dbVats.length) {
      fields.vat_row_count.correct++;
    } else {
      fields.vat_row_count.errors.push(`${label}: GT=${gtVats.length} rivit DB=${dbVats.length} rivit`);
    }

    const vatLen = Math.min(gtVats.length, dbVats.length);
    for (let i = 0; i < vatLen; i++) {
      const gv = gtVats[i];
      const dv = dbVats[i];
      const vatLabel = `${label} VAT[${gv.rate}%]`;

      fields.vat_rates.total++;
      if (within(Number(dv.rate), gv.rate, 0.1)) fields.vat_rates.correct++;
      else fields.vat_rates.errors.push(`${vatLabel}: GT=${gv.rate} DB=${dv.rate}`);

      fields.vat_net_amounts.total++;
      if (within(Number(dv.net_amount), gv.net_amount, VAT_AMOUNT_TOLERANCE)) fields.vat_net_amounts.correct++;
      else fields.vat_net_amounts.errors.push(`${vatLabel}: GT=${gv.net_amount} DB=${dv.net_amount}`);

      fields.vat_amounts.total++;
      if (within(Number(dv.vat_amount), gv.vat_amount, VAT_AMOUNT_TOLERANCE)) fields.vat_amounts.correct++;
      else fields.vat_amounts.errors.push(`${vatLabel}: GT=${gv.vat_amount} DB=${dv.vat_amount}`);

      fields.vat_totals.total++;
      if (within(Number(dv.total), gv.total, VAT_AMOUNT_TOLERANCE)) fields.vat_totals.correct++;
      else fields.vat_totals.errors.push(`${vatLabel}: GT=${gv.total} DB=${dv.total}`);
    }
  }

  return { fields, matched, unmatched };
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const gtPath = path.join(__dirname, "30_handwritten_receipts_test.json");
  const gt: GTReceipt[] = JSON.parse(fs.readFileSync(gtPath, "utf-8"));
  console.log(`\nGround truth: ${gt.length} kuittia`);

  // DB sisältää vain nämä 30 kuittia — hae kaikki
  const db = await prisma.receipt.findMany({
    include: { receiptVats: true },
    orderBy: { created_at: "desc" },
  });
  console.log(`DB: ${db.length} kuittia yhteensä\n`);

  const { fields, matched, unmatched } = compareReceipts(gt, db);

  // ─── Tulostus ──────────────────────────────────────────────────────────────
  console.log("═".repeat(60));
  console.log(" TARKKUUSRAPORTTI");
  console.log("═".repeat(60));
  console.log(`Matchattu:    ${matched}/${gt.length}`);
  if (unmatched.length > 0) {
    console.log(`\nEI LÖYDETTY DB:stä (${unmatched.length}):`);
    unmatched.forEach((r) =>
      console.log(`  - ${r.vendor_name} | ${r.receipt_date.slice(0, 10)} | €${r.total_amount}`)
    );
  }

  console.log("\n" + "─".repeat(60));
  console.log(" KENTTÄKOHTAINEN TARKKUUS");
  console.log("─".repeat(60));

  let totalCorrect = 0;
  let totalAll = 0;

  for (const [field, res] of Object.entries(fields)) {
    if (res.total === 0) continue;
    const pct = ((res.correct / res.total) * 100).toFixed(1);
    const bar = "█".repeat(Math.round(Number(pct) / 5)) + "░".repeat(20 - Math.round(Number(pct) / 5));
    console.log(`${field.padEnd(28)} ${bar} ${pct}% (${res.correct}/${res.total})`);
    totalCorrect += res.correct;
    totalAll += res.total;
  }

  const overallPct = ((totalCorrect / totalAll) * 100).toFixed(1);
  console.log("─".repeat(60));
  console.log(`${"KOKONAISTARKKUUS".padEnd(28)} ${"█".repeat(Math.round(Number(overallPct) / 5))}${"░".repeat(20 - Math.round(Number(overallPct) / 5))} ${overallPct}%`);

  // ─── Virheet ───────────────────────────────────────────────────────────────
  const hasErrors = Object.values(fields).some((f) => f.errors.length > 0);
  if (hasErrors) {
    console.log("\n" + "─".repeat(60));
    console.log(" VIRHEET KENTITTÄIN");
    console.log("─".repeat(60));
    for (const [field, res] of Object.entries(fields)) {
      if (res.errors.length === 0) continue;
      console.log(`\n${field} (${res.errors.length} virhettä):`);
      res.errors.slice(0, 10).forEach((e) => console.log(`  ✗ ${e}`));
      if (res.errors.length > 10) console.log(`  ... ja ${res.errors.length - 10} muuta`);
    }
  }

  console.log("\n" + "═".repeat(60));
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});