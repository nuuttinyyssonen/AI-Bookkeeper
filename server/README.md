# Server - Docker test database setup

Tässä ohjeessa kuvataan, miten tämä palvelinprojekti otetaan käyttöön ja miten testit ajetaan Docker-ympäristössä.

## Ennen käyttöä / uutta konetta

1. Asenna Docker Desktop tai Docker Engine.
2. Asenna Node.js (suositus: 18+).
3. Avaa terminaali projektin `server`-kansiossa.
4. Asenna riippuvuudet:

```bash
npm install
```

## Ympäristömuuttujat

Kopioi `.env`-tiedosto tai luo oma `server/.env` ja varmista, että ainakin seuraavat arvot ovat mukana:

```env
DATABASE_URL_TEST="postgresql://prisma:prisma@localhost:5433/tests"
SUPABASE_URL="https://..."
SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."
```

Huomioi, että `DATABASE_URL_TEST` on testitietokannan osoite Docker-postgres-palvelua varten.

## Docker-testitietokannan käynnistäminen

Käynnistä ensin PostgreSQL-palvelu Docker Compose -konfiguraatiolla:

```bash
docker compose up -d db
```

Se aloittaa testitietokannan portissa `5433`.

## Testien ajaminen

Tässä projektissa on oma Docker-testiskripti, joka käynnistää tietokannan, synkronoi Prisma-skeeman ja ajaa Jest-testit.

```bash
npm run test:docker
```

Tämä ajaa seuraavat vaiheet:

1. `docker compose up -d db`
2. `node scripts/setupTestDb.js`
3. `NODE_ENV=test jest`

Jos haluat ajaa testit erikseen ilman Dockerin käynnistystä (esim. jos koneessa on jo paikallinen testi-DB), voit käyttää:

```bash
npm test
```

## Testitietokannan asettaminen erikseen

Jos haluat vain synkronoida testitietokannan skeeman:

```bash
npm run setup:testdb
```

## Yleisiä huomioita

- Testit käyttävät `NODE_ENV=test`-tilaa.
- Testien tietokanta on `postgresql://prisma:prisma@localhost:5433/tests`.
- Supabase-auth ja muut palvelut käyttävät omia ympäristömuuttujiaan, joten varmista, että ne ovat oikein myös uudella koneella.

## Kun siirryt uuteen koneeseen

1. kloonaa repositorio.
2. siirry `server`-kansioon.
3. asenna `npm install`.
4. luo `.env` samanlaiseksi kuin yllä.
5. käynnistä `docker compose up -d db`.
6. aja `npm run test:docker`.
