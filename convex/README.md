# Convex data model

Questa cartella contiene la base backend per Energy Transition News Cockpit.

## Prima configurazione

1. Installa le dipendenze: `npm install`
2. Fai login Convex: `npx convex login`
3. Collega o crea il progetto: `npx convex dev`
4. Popola le fonti iniziali dalla dashboard Convex o CLI chiamando `news:seedInitialSources`

## Fonti

- Google News RSS per discovery, sempre attribuendo la fonte originale.
- Renewables Now RSS per rinnovabili, storage e aziende.
- ENTSO-E Transparency RSS per segnalazioni operative.
- Council of the EU RSS per policy.
- Reuters e Bloomberg restano placeholder `licensed`, non attivi finche non esiste una licenza.

## Tabelle principali

- `sources`: catalogo feed/API/manual/licensed.
- `rawArticles`: articoli normalizzati e deduplicati.
- `flashNews`: news rapide con topic, score e implicazione.
- `editorialSelections`: selezioni settimanali Energy Shift curate con Codex.
- `priceSnapshots`: prezzi day-ahead per paese/ora.
- `briefs`: briefing esportabili con citazioni.
- `savedItems`: workspace personale.
