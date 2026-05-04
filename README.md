# Energy Shift | Energy Transition News Cockpit

Webapp editoriale e analitica per monitorare la transizione energetica europea.

## Cosa include

- briefing giornaliero in italiano
- prezzi elettricita day-ahead per principali mercati europei
- notizie flash da feed RSS/API gratuiti
- selezione settimanale della redazione Energy Shift
- fonti e citazioni
- azioni di export/condivisione
- modello dati Convex per fonti, articoli, briefing, prezzi e workspace

## Frontend statico

Il mockup e servibile direttamente come sito statico GitHub Pages:

- `index.html`
- `styles.css`
- `app.js`

## Backend Convex

La cartella `convex/` contiene schema, query, mutation, ingestione RSS e cron orario.

Per collegarlo al tuo account Convex:

```bash
npm install
npx convex login
npx convex dev
```

Poi esegui la mutation `news:seedInitialSources` per inserire le fonti iniziali.

Reuters e altre fonti premium sono modellate come `licensed` e disattivate finche non c'e una licenza valida.
