# Theatergruppe Kleinraming Website

Die offizielle Website der Theatergruppe Kleinraming. Dieses Projekt dient der Präsentation des Vereins, der Bewerbung aktueller Theaterstücke und der Pflege eines historischen Archivs vergangener Aufführungen.

## 🎭 Kernfunktionen

- **Dynamisches Ticket-System**: Unterstützung von drei verschiedenen Betriebsmodi via Headless CMS:
  - `inaktiv`: Fokus auf Rückblick des letzten Stücks.
  - `vorab_reservierung`: Vorschau-Modus für kommende Saisons.
  - `ticket_promotion`: Aktive Ticket-Reservierung mit Anbindung an externe Systeme (Ticketlotse).
- **Theater-Archiv**: Umfassende Übersicht aller bisherigen Stücke inkl. Besetzung und Bildergalerien.
- **Ensemble-Präsentation**: Vorstellung aller Mitglieder vor und hinter der Bühne.
- **Sponsoren-Management**: Professionelle Darstellung der Partner und Unterstützer.
- **Performance-Optimiert**: Statische Generierung (SSG) für blitzschnelle Ladezeiten und optimiertes Image-Handling.

## 🛠 Technologie-Stack

- **Frontend**: [Astro v6](https://astro.build/) (TypeScript)
- **Backend**: [Directus](https://directus.io/) (Headless CMS)
- **Styling**: Vanilla CSS (Modern & Responsive)
- **Testing**: Vitest (Unit) & Playwright (E2E/Performance)

## 🏗 Projektstruktur

```text
/
├── src/
│   ├── components/     # Modulare UI-Komponenten (Bento-Tiles, Card-Systeme)
│   ├── e2e/            # Playwright End-to-End Tests & Mock-API
│   ├── layouts/        # Zentrale Layout-Definitionen
│   ├── lib/            # Business-Logik, Directus-Client & Daten-Mapper
│   └── pages/          # Astro-Routen (Statisch & Dynamisch)
├── public/             # Statische Assets (Fonts, Favicons)
└── .husky/             # Git-Hooks (Linting & Type-Checks)
```

## 🧞 Befehle

| Befehl              | Aktion                                            |
| :------------------ | :------------------------------------------------ |
| `npm run dev`       | Startet den lokalen Dev-Server                    |
| `npm run build`     | Erstellt die produktive Website (SSG)             |
| `npm run lint`      | Prüft die Code-Qualität (ESLint)                  |
| `npm run check`     | Führt einen vollständigen TypeScript-Check aus    |
| `npm run test:unit` | Startet die Logik-Tests (Vitest)                  |
| `npm run test:e2e`  | Startet Browser-Tests inkl. Mock-API (Playwright) |
| `npm run format`    | Formattiert den gesamten Code (Prettier)          |

## 🛡 Qualitätssicherung

Dieses Projekt verfügt über eine integrierte QA-Pipeline:

- **Pre-commit Hooks**: Jede Änderung wird vor dem Commit automatisch auf Formattierung, Linting-Fehler und Typ-Sicherheit geprüft.
- **CI/CD**: Jedes Deployment via GitHub Actions erfordert einen erfolgreichen Durchlauf aller Unit- und E2E-Tests.
- **Mock-API**: Die E2E-Tests sind unabhängig von der CMS-Verfügbarkeit durch einen lokalen Mock-Server.

---

Entwickelt mit ❤️ für die Theatergruppe Kleinraming.
