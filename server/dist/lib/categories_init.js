"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("./prisma");
// This script initializes the categories in the database. It uses Prisma's upsert method to ensure that each category is created if it doesn't exist, 
// or left unchanged if it already exists. This allows us to safely run this script multiple times without creating duplicate entries or modifying existing ones.
const categories = [
    { type: "TOIMISTOKULUT", label: "Toimistokulut" },
    { type: "MATKAKULUT", label: "Matkakulut" },
    { type: "EDUSTUSKULUT", label: "Edustuskulut" },
    { type: "ATERIA", label: "Ateria" },
    { type: "MARKKINOINTI_JA_MAINONTA", label: "Markkinointi ja mainonta" },
    { type: "KALUSTO_JA_LAITTEET", label: "Kalusto ja laitteet" },
    { type: "PALKKAKULUT_JA_PALKKIOT", label: "Palkkakulut ja palkkiot" },
    { type: "VUOKRA", label: "Vuokra" },
    { type: "VAKUUTUKSET", label: "Vakuutukset" },
    { type: "PUHELIN_JA_TIETOLIIKENNE", label: "Puhelin ja tietoliikenne" },
    { type: "OHJELMISTOT_JA_LISENSSIT", label: "Ohjelmistot ja lisenssit" },
    { type: "KOULUTUS_JA_KURSSIT", label: "Koulutus ja kurssit" },
    { type: "KIRJANPITO_JA_LAKIPALVELUT", label: "Kirjanpito ja lakipalvelut" },
    { type: "PANKKIKULUT", label: "Pankkikulut" },
    { type: "AJONEUVOKULUT", label: "Ajoneuvokulut" },
    { type: "KOTITOIMISTON_KULUT", label: "Kotitoimiston kulut" },
    { type: "YKSITYISOTOT", label: "Yksityisotot" },
    { type: "MUUT_KULUT", label: "Muut kulut" },
    { type: "MYYNTI_TUOTTEET", label: "Myynti — tuotteet" },
    { type: "MYYNTI_PALVELUT", label: "Myynti — palvelut" },
    { type: "MUUT_TULOT", label: "Muut tulot" },
];
const main = async () => {
    for (const category of categories) {
        await prisma_1.prisma.category.upsert({
            where: { type: category.type },
            update: {},
            create: category,
        });
    }
};
main();
