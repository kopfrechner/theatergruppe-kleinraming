# Projekt: Theatergruppe Kleinraming

## Zweck (Purpose)

Dieses Repository enthält die Website der Theatergruppe Kleinraming. Ziel ist es, aktuelle Stücke zu bewerben (inkl. Ticket-Promotion), ein Archiv vergangener Aufführungen zu pflegen und den Verein (Ensemble/Vorstand) sowie seine Sponsoren professionell zu präsentieren.

## Systemarchitektur

Das Projekt nutzt einen modernen Headless-CMS-Ansatz:

- **Frontend**: [Astro](https://astro.build/) (v6.x). Astro wurde gewählt für optimale Performance, exzellentes Image-Handling und die Flexibilität zwischen statischer Generierung (SSG) und Server-Side Rendering (SSR).
- **Backend**: [Directus](https://directus.io/) als Headless CMS (gehostet unter `cms.kopfarbeit.dev`). Es dient als Single Source of Truth für alle dynamischen Inhalte.
- **Infrastruktur**: Deployment erfolgt automatisiert über GitHub Actions (siehe `.github/workflows/deploy.yml`).

## Solution-Architektur

### Datenfluss & Integration

- **Directus SDK**: Die Kommunikation mit dem CMS erfolgt über das offizielle `@directus/sdk` in `src/lib/directus.ts`.
- **Mapping-Layer**: In `src/lib/mappers.ts` werden CMS-Daten für das Frontend transformiert (z. B. Bild-Optimierung mit Astros Image-Service, Aufbereitung von Ticket-Terminen).
- **Asset-Management**: Bilder werden über den Directus-Asset-Endpunkt geladen. Es ist **zwingend erforderlich**, dass Bilder IMMER zur Build-Zeit generiert und optimiert werden (mittels Astro-Komponenten wie `<Image />` oder dem `getImage`-Service). Laufzeit-Transformationen sollten vermieden werden.

### Frontend-Struktur

- **Mobile First & Responsivität**: Es ist eine Kernanforderung, dass die gesamte Anwendung voll mobilfähig ist. Alle Komponenten und Seiten müssen mittels Responsive Design (Media Queries, Flexbox/Grid) für verschiedene Bildschirmgrößen optimiert sein.
- **Seitenkonzept**:
  - Statische Seiten (`index.astro`, `kontakt.astro`, etc.) für allgemeine Infos.
  - Dynamische Routen (`stuecke/[slug].astro`) für das Archiv.
- **Komponenten**: Modulare Astro-Komponenten in `src/components/` (z. B. `BentoTile` für das Grid auf der Startseite, `MemberCard` für das Ensemble).
- **Styling**:
  - **Global**: Zentrales CSS in `src/styles/global.css` mit einem "warmen" Dunkelbraun/Grün/Gold-Branding.
  - **Lokal**: Scoped CSS innerhalb der Astro-Komponenten für spezifische Layout-Logik.
  - **Glassmorphism**: Häufiger Einsatz von halb-transparenten Panels (`.glass-panel`) für ein modernes Design.

### Konventionen

- **Header & Footer**: Zentral verwaltet in `src/layouts/Layout.astro`.
- **Rechtliches**: Inhalte für Impressum und Datenschutz werden komplett in Directus via Rich-Text gepflegt und in Astro mittels `set:html` und einer speziellen CSS-Klasse `.legal-content` gerendert.

## QA & Test-Strategie

Das Projekt verfolgt einen dualen Test-Ansatz, um Logik, UI und Performance abzusichern.

### 1. Unit-Tests (Vitest)
- **Fokus**: Daten-Transformationen in `src/lib/mappers.ts`.
- **Zweck**: Absicherung der Logik für die drei Ticket-Modi (`inaktiv`, `vorab_reservierung`, `ticket_promotion`) und die korrekte Sortierung von Galerien.
- **Befehl**: `npm run test:unit`

### 2. E2E & Performance (Playwright)
- **Fokus**: User-Flows, Responsivität und Layout-Stabilität.
- **Mocking**: E2E-Tests laufen gegen einen lokalen Mock-API-Server (`src/e2e/mock-api.ts`), um reproduzierbare Zustände zu garantieren.
- **Performance**: Strikte Prüfung des CLS-Scores (Cumulative Layout Shift) für alle Hauptseiten (Startseite, Stücke, Menschen, Tickets, Mitwirken, Sponsoren). Ziel: CLS < 0.1.
- **Befehl**: `npm run test:e2e`

### 3. Statische Analyse
- **Linting**: ESLint für Code-Qualität (`npm run lint`).
- **Typisierung**: Vollständiger TypeScript-Check inkl. Directus-SDK-Schema (`npm run check`).
- **Formatierung**: Prettier für konsistenten Code-Style (`npm run format`).

### Wichtige Befehle
- `npm run test:e2e` - Startet Mock-API, Dev-Server und alle Performance-Tests.
- `npx playwright test --project=desktop-chrome` - Nur Desktop-Tests.
- `npx playwright test src/e2e/tickets.test.ts` - Spezifische Tests für Ticket-Modi.

