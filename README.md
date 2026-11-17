# pryvo.de — Website

Statische Website für [pryvo.de](https://pryvo.de), deployed als Cloudflare Worker (`muddy-bird-e29f`) über Workers Builds Git-Integration.

## Struktur

- `index.html` — Startseite
- `impressum.html`, `datenschutz.html` — Rechtliches
- `assets/img`, `assets/video`, `assets/fonts` — Bilder, Videos, selbst gehostete Fonts
- `wrangler.jsonc` — Cloudflare-Konfiguration (statische Seiten mit Weiterleitungs-Middleware, kein Build-Schritt nötig)

## Deploy

Jeder Push auf `main` wird automatisch von Cloudflare gebaut und live auf pryvo.de deployed. Kein manueller Upload mehr nötig.

Änderungen lokal machen → committen → pushen. Fertig.

## Sprachversionen und SEO

- `/index.html` ist die deutsche Startseite, `/en/index.html` die vollständige englische Version. Beide enthalten die Texte bereits im HTML, auch ohne JavaScript.
- Sprachwechsel erfolgen über normale Links. Bei inhaltlichen Änderungen beide HTML-Dateien sowie die jeweiligen Metadaten und strukturierten Daten aktualisieren.
- Gemeinsame Bilder, Schriftarten und Skripte werden über absolute `/assets/`-Pfade eingebunden.
- Rechtliche Seiten werden von Cloudflare unter URLs ohne `.html` ausgeliefert. Canonical-Tags und `sitemap.xml` verwenden diese Zieladressen.
- Die App selbst ist aktuell deutschsprachig; die englische Website weist darauf hin.

## Einheitliche Domain und HTTPS

`worker.mjs` leitet HTTP und die www-Variante mit Status 301 auf `https://pryvo.de` um. Pfad und Suchparameter bleiben erhalten. Die Domain-Zuordnung steht in `wrangler.jsonc`; www ersetzt den alten Framer-Verweis. HTML-Antworten erhalten einen expliziten UTF-8-Header. Die eigentlichen Seiten werden weiterhin direkt aus dem statischen `ASSETS`-Binding ausgeliefert.

`.assetsignore` verhindert, dass Worker-Code und Projektkonfiguration als öffentliche Seitendateien ausgeliefert werden.
