# Directus CMS Integration

Dieses Dokument beschreibt die Anbindung von Directus als Headless CMS für die Website der Theatergruppe Kleinraming.

## 1. Technisches Setup

Die Integration basiert auf dem offiziellen `@directus/sdk`. Der zentrale Zugriffspunkt befindet sich in:
`src/lib/directus.ts`

### Client Konfiguration

Der Client ist für den öffentlichen Zugriff konfiguriert (Public Role in Directus).

```typescript
import { createDirectus, rest } from '@directus/sdk';

const client = createDirectus<Schema>('https://cms.kopfarbeit.dev').with(
  rest(),
);
```

## 2. Datenmodell (Collections)

Folgende Collections sind in Directus definiert und werden in der App genutzt:

### `stuecke` (Theaterstücke)

Zentrales Verzeichnis aller Aufführungen.

- **id**: UUID (Primärschlüssel & Route)
- **titel**: Name des Stücks
- **auffuehrung_im_jahr**: Jahr der Premiere (dient als Sortierkriterium)
- **synopsis**: Inhaltsangabe (HTML)
- **flyer**: PDF-Datei (Relation zu `directus_files`)
- **titelfoto**: Hauptbild (Relation zu `directus_files`)
- **spieler**: M2M Beziehung zu `theatermenschen` (mit Zusatzfeldern für Rolle/Beschreibung)
- **foto_gallerie**: Bildergalerie (M2M zu `directus_files` über `stuecke_directus_files`)

### `theatermenschen` (Mitglieder)

Personenverzeichnis der Theatergruppe.

- **id**: UUID
- **name**: Vor- und Nachname
- **funktionen**: Textfeld für Rollen im Verein
- **steckbrief**: Kurze Beschreibung / Bio
- **foto**: Profilbild
- **aktiver_theatermensch**: Boolean (steuert die Anzeige auf der Mitgliederseite)
- **vorstandsmitglied**: Boolean (kennzeichnet Mitglieder für die Vorstands-Sektion)

### `sponsoren` (Sponsoren)

Verzeichnis aller Unterstützer und Partner.

- **id**: UUID
- **unternehmen**: Name des Unternehmens (Pflichtfeld)
- **link**: URL zur Webseite des Sponsors
- **bild**: Logo des Unternehmens (Relation zu `directus_files`)

### `stuecke_directus_files` (Junction-Tabelle)

Hilfstabelle für die Bildergalerie der Stücke.

- Ermöglicht manuelle Sortierung der Fotos innerhalb eines Stücks.
- Löschregel: **CASCADE** (Löschen eines Stücks entfernt auch die Galerie-Verknüpfungen).

## 3. Zugriff & Berechtigungen

Damit die Daten im Frontend erscheinen, müssen in Directus unter **Settings -> Access Control -> Public** Leserechte für folgende Collections vergeben sein:

1. `stuecke`
2. `theatermenschen`
3. `sponsoren`
4. `stuecke_theatermenschen` (für die Rollen-Verknüpfung)
5. `stuecke_directus_files` (für die Bildergalerie)
6. **Directus Files** (System-Collection für Bilder/PDFs)

## 4. Bilder & Assets

Bilder werden über den Asset-Endpunkt von Directus geladen. Zur Performance-Optimierung werden Transformationen genutzt:
`https://cms.kopfarbeit.dev/assets/<id>?width=600&height=338&fit=cover`
