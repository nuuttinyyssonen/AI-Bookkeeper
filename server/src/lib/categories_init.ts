import { CategoryType } from "@prisma/client";
import { prisma } from "./prisma";

const categories = [
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
]

const main = async() =>{
    for (const category of categories) {
    await prisma.category.upsert({
        where: { type: category.type as CategoryType },
        update: {},
        create: category as any,
    })
    }
}

main();