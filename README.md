# pryvo.de — Website
hallo
Statische Website für [pryvo.de](https://pryvo.de), deployed als Cloudflare Worker (`muddy-bird-e29f`) über Workers Builds Git-Integration.

## Struktur

- `index.html` — Startseite
- `impressum.html`, `datenschutz.html` — Rechtliches
- `assets/img`, `assets/video`, `assets/fonts` — Bilder, Videos, selbst gehostete Fonts
- `wrangler.jsonc` — Cloudflare-Konfiguration (reine Static-Assets, kein Build-Schritt nötig)

## Deploy

Jeder Push auf `main` wird automatisch von Cloudflare gebaut und live auf pryvo.de deployed. Kein manueller Upload mehr nötig.

Änderungen lokal machen → committen → pushen. Fertig.
