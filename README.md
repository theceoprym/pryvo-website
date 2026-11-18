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
- Die App ist auf Deutsch und Englisch verfügbar.

## KI-Limits

Stand 18.11.2026, abgeglichen mit dem öffentlichen App-Store-Eintrag (App-ID 6797687805): kostenlos drei Fotos pro Monat und drei Chat-Einträge pro Tag; Premium bis zu 300 Mahlzeiten pro Monat per Foto erkennen. Bei Änderungen Preisübersicht, FAQ und FAQ-JSON-LD in beiden Sprachversionen gemeinsam anpassen.

## Einheitliche Domain und HTTPS

`worker.mjs` leitet HTTP und die www-Variante mit Status 301 auf `https://pryvo.de` um. Pfad und Suchparameter bleiben erhalten. HTML-Antworten erhalten einen expliziten UTF-8-Header. Die eigentlichen Seiten werden weiterhin direkt aus dem statischen `ASSETS`-Binding ausgeliefert.

Die Domain-Zuordnung wird separat in Cloudflare verwaltet: `pryvo.de` als Custom Domain und `www.pryvo.de/*` als Worker-Route vor dem bisherigen Framer-Ziel. Keine `routes`-Liste in `wrangler.jsonc` ergänzen: Der automatische Build soll diese bestehenden Zuordnungen erhalten, statt mit seinen eingeschränkten Rechten DNS-Einträge neu einzurichten.

`.assetsignore` verhindert, dass Worker-Code und Projektkonfiguration als öffentliche Seitendateien ausgeliefert werden.
