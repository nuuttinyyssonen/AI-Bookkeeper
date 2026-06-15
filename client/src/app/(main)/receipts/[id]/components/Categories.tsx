interface Props {
    selectedCategory: string;
    handleCategoryChange: (category: string) => void;
};

const CATEGORIES = [
  { type: "TOIMISTOKULUT",              label: "Toimistokulut" },
  { type: "MATKAKULUT",                 label: "Matkakulut" },
  { type: "EDUSTUSKULUT",               label: "Edustuskulut" },
  { type: "ATERIA",                     label: "Ateria" },
  { type: "MARKKINOINTI_JA_MAINONTA",   label: "Markkinointi ja mainonta" },
  { type: "KALUSTO_JA_LAITTEET",        label: "Kalusto ja laitteet" },
  { type: "PALKKAKULUT_JA_PALKKIOT",    label: "Palkkakulut ja palkkiot" },
  { type: "VUOKRA",                     label: "Vuokra" },
  { type: "VAKUUTUKSET",                label: "Vakuutukset" },
  { type: "PUHELIN_JA_TIETOLIIKENNE",   label: "Puhelin ja tietoliikenne" },
  { type: "OHJELMISTOT_JA_LISENSSIT",   label: "Ohjelmistot ja lisenssit" },
  { type: "KOULUTUS_JA_KURSSIT",        label: "Koulutus ja kurssit" },
  { type: "KIRJANPITO_JA_LAKIPALVELUT", label: "Kirjanpito ja lakipalvelut" },
  { type: "PANKKIKULUT",                label: "Pankkikulut" },
  { type: "AJONEUVOKULUT",              label: "Ajoneuvokulut" },
  { type: "KOTITOIMISTON_KULUT",        label: "Kotitoimiston kulut" },
  { type: "YKSITYISOTOT",               label: "Yksityisotot" },
  { type: "MUUT_KULUT",                 label: "Muut kulut" },
  { type: "MYYNTI_TUOTTEET",            label: "Myynti — tuotteet" },
  { type: "MYYNTI_PALVELUT",            label: "Myynti — palvelut" },
  { type: "MUUT_TULOT",                 label: "Muut tulot" },
];

export default function Categories({ selectedCategory, handleCategoryChange }: Props) {
    return (
        <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Kategoria</label>
            <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-950"
            >
            <option value="" disabled>Valitse kategoria</option>
            {CATEGORIES.map((c) => (
                <option key={c.type} value={c.type}>{c.label}</option>
            ))}
            </select>
        </div>
    );
}