import http from 'http';
import url from 'url';

const PORT = 3333;
let currentMode = 'inaktiv';

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url || '', true);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Helper to change mode via API (from Playwright tests)
  if (parsedUrl.pathname === '/__set_mode') {
    currentMode = (parsedUrl.query.mode as string) || 'inaktiv';
    res.end(JSON.stringify({ success: true, mode: currentMode }));
    return;
  }

  if (parsedUrl.pathname?.includes('/items/ticket_promotion')) {
    if (currentMode === 'vorab_reservierung') {
      res.end(
        JSON.stringify({
          data: {
            anzeige_modus: 'vorab_reservierung',
            titel: 'Sommernachtstraum',
            vorab_titel: 'VORSCHAU: Sommernachtstraum',
            kurzbeschreibung: 'Bald im Kino!',
            vorab_text: 'Tickets bald verfügbar.',
            vorab_bild: null,
            ticketlotse_link: 'https://ticketlotse.test',
            ticketlotse_link_aktiv: false,
          },
        }),
      );
    } else if (currentMode === 'ticket_promotion') {
      res.end(
        JSON.stringify({
          data: {
            anzeige_modus: 'ticket_promotion',
            titel: 'Hamlet',
            kurzbeschreibung: 'Sein oder nicht sein.',
            ticketlotse_link: 'https://ticketlotse.test',
            ticketlotse_link_aktiv: true,
            termin_1: '2026-11-01T20:00:00Z',
            teaser_fotos: [],
          },
        }),
      );
    } else if (currentMode === 'ticket_promotion_inactive_link') {
      res.end(
        JSON.stringify({
          data: {
            anzeige_modus: 'ticket_promotion',
            titel: 'Hamlet (Reservierung inaktiv)',
            kurzbeschreibung: 'Sein oder nicht sein.',
            ticketlotse_link: 'https://ticketlotse.test',
            ticketlotse_link_aktiv: false,
            termin_1: '2026-11-01T20:00:00Z',
            teaser_fotos: [],
          },
        }),
      );
    } else if (currentMode === 'ticket_promotion_missing_link') {
      res.end(
        JSON.stringify({
          data: {
            anzeige_modus: 'ticket_promotion',
            titel: 'Hamlet (Kein Link)',
            kurzbeschreibung: 'Sein oder nicht sein.',
            ticketlotse_link: null,
            ticketlotse_link_aktiv: true,
            termin_1: '2026-11-01T20:00:00Z',
            teaser_fotos: [],
          },
        }),
      );
    } else {
      res.end(
        JSON.stringify({
          data: {
            anzeige_modus: 'inaktiv',
            titel: 'Saison 2026',
          },
        }),
      );
    }
    return;
  }

  if (parsedUrl.pathname?.includes('/items/stuecke')) {
    res.end(
      JSON.stringify({
        data: [
          {
            id: 'old-play',
            titel: 'Ein tolles altes Stück',
            synopsis: 'Dies war ein sehr erfolgreiches Stück.',
            auffuehrung_im_jahr: 2024,
            slug: 'altes-stueck',
            veroffentlicht: true,
          },
        ],
      }),
    );
    return;
  }

  if (parsedUrl.pathname?.includes('/items/startseite')) {
    res.end(
      JSON.stringify({
        data: {
          emotionen_titel: 'Willkommen',
          emotionen_bild: null,
          impressionen_gallerie: [],
        },
      }),
    );
    return;
  }

  if (parsedUrl.pathname?.includes('/items/theatermenschen')) {
    res.end(
      JSON.stringify({
        data: [
          {
            id: '1',
            name: 'Max Mustermann',
            funktionen: 'Schauspieler',
            aktiver_theatermensch: true,
            vorstandsmitglied: false,
          },
        ],
      }),
    );
    return;
  }

  if (parsedUrl.pathname?.includes('/items/sponsoren')) {
    res.end(
      JSON.stringify({
        data: [
          {
            id: '1',
            unternehmen: 'Test Sponsor',
            link: 'https://test.com',
          },
        ],
      }),
    );
    return;
  }

  if (parsedUrl.pathname?.includes('/items/kontakt_seite')) {
    res.end(
      JSON.stringify({
        data: {
          email: 'test@test.com',
          telefon: '123',
          faq: [],
          location_name: 'Test Ort',
          map_embed: '',
        },
      }),
    );
    return;
  }

  if (
    parsedUrl.pathname?.includes('/items/impressum') ||
    parsedUrl.pathname?.includes('/items/datenschutz')
  ) {
    res.end(
      JSON.stringify({
        data: {
          content: 'Legal content',
        },
      }),
    );
    return;
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`Mock Directus API running at http://localhost:${PORT}`);
});
