# Energy Shift Map Simulator

Webapp statica che mostra, su una mappa reale OpenStreetMap, come si riorganizzano
i flussi energetici, logistici e minerari quando uno dei nodi critici entra in crisi.

## Nodi simulati

- Hormuz
- Suez / Bab el-Mandeb
- Malacca
- Mar Cinese Meridionale / Taiwan
- Hub cinese di raffinazione e batterie
- Indonesia
- Repubblica Democratica del Congo

## Esperienza

- una sola vista full-screen centrata sulla mappa
- layer geografico reale con Leaflet + OpenStreetMap
- scenari attivabili con pulsanti
- overlay con scenario attivo, stato del sistema e conteggio delle rotte deviate
- diagnostica visibile se il layer mappa non si inizializza correttamente

## File principali

- `index.html`: struttura della pagina e inclusione del layer mappa
- `styles.css`: layout, overlay, stile della mappa e responsive behavior
- `app.js`: dataset dei nodi, scenari di crisi e rendering dei flussi
