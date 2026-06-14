import { describe, it, expect, vi } from 'vitest';
import { mapHighlightPlay, prepareGalleryImages } from './mappers';

// Mock astro:assets
vi.mock('astro:assets', () => ({
  getImage: vi.fn(({ src, width, height }) => Promise.resolve({ src })),
  inferRemoteSize: vi.fn(() => Promise.resolve({ width: 1600, height: 1200 })),
}));

describe('mappers', () => {
  const directusUrl = 'https://cms.test.dev';

  describe('mapHighlightPlay', () => {
    const mockLastPlay = {
      id: 'play-1',
      titel: 'Test Stück',
      slug: 'test-stueck',
      synopsis: '<p>Dies ist eine <b>Test</b> Synopsis.</p>',
      titelfoto: 'photo-1',
      auffuehrung_im_jahr: 2024,
      status: 'published',
      veroffentlicht: true,
    };

    it('should return null if everything is null', () => {
      expect(mapHighlightPlay(null, null, directusUrl)).toBeNull();
    });

    it('should map historical play if mode is inaktiv', () => {
      const ticketPromo = {
        anzeige_modus: 'inaktiv' as const,
      } as any;

      const result = mapHighlightPlay(ticketPromo, mockLastPlay, directusUrl);

      expect(result).not.toBeNull();
      expect(result?.isHistorical).toBe(true);
      expect(result?.titel).toBe('Test Stück');
      expect(result?.text).toBe('Dies ist eine Test Synopsis.');
      expect(result?.status).toBe('Rückblick');
      expect(result?.image).toBe(`${directusUrl}/assets/photo-1`);
    });

    it('should shorten synopsis if it is too long', () => {
      const longPlay = {
        ...mockLastPlay,
        synopsis: 'A'.repeat(300),
      };
      const result = mapHighlightPlay(
        { anzeige_modus: 'inaktiv' } as any,
        longPlay,
        directusUrl,
      );
      expect(result?.text.length).toBe(183); // 180 + ...
      expect(result?.text.endsWith('...')).toBe(true);
    });

    it('should map vorab_reservierung correctly', () => {
      const ticketPromo = {
        anzeige_modus: 'vorab_reservierung',
        titel: 'Original Titel',
        vorab_titel: 'Vorab Titel',
        kurzbeschreibung: 'Kurztext',
        vorab_text: 'Vorabtext',
        vorab_bild: 'vorab-bild-id',
      } as any;

      const result = mapHighlightPlay(ticketPromo, null, directusUrl);

      expect(result?.isHistorical).toBe(false);
      expect(result?.titel).toBe('Vorab Titel');
      expect(result?.text).toBe('Vorabtext');
      expect(result?.status).toBe('Saison-Vorschau');
      expect(result?.image).toBe(`${directusUrl}/assets/vorab-bild-id`);
    });

    it('should map ticket_promotion correctly with multiple dates', () => {
      const ticketPromo = {
        anzeige_modus: 'ticket_promotion',
        titel: 'Sommernachtstraum',
        kurzbeschreibung: 'Ein Klassiker.',
        hauptfoto: { id: 'main-photo' },
        termin_1: '2026-07-01T20:00:00Z',
        termin_2: '2026-07-02T20:00:00Z',
      } as any;

      const result = mapHighlightPlay(ticketPromo, null, directusUrl);

      expect(result?.status).toBe('Nächste Premiere');
      expect(result?.titel).toBe('Sommernachtstraum');
      expect(result?.termine.length).toBe(2);
      // Depending on timezone of the test runner, the string might vary, 
      // but it should contain the date part.
      expect(result?.termine[0]).toContain('01.07.2026');
    });
  });

  describe('prepareGalleryImages', () => {
    it('should sort images correctly', async () => {
      const gallerie = [
        { directus_files_id: { id: 'img-2' }, sort: 2 },
        { directus_files_id: { id: 'img-1' }, sort: 1 },
      ];

      const result = await prepareGalleryImages(gallerie, directusUrl);

      expect(result.length).toBe(2);
      expect(result[0].id).toBe('img-1');
      expect(result[1].id).toBe('img-2');
    });

    it('should handle empty gallery', async () => {
      const result = await prepareGalleryImages([], directusUrl);
      expect(result).toEqual([]);
    });

    it('should handle broken image entries gracefully', async () => {
      const gallerie = [{ directus_files_id: null, sort: 1 }];
      const result = await prepareGalleryImages(gallerie, directusUrl);
      expect(result).toEqual([]);
    });

    it('should handle errors during image optimization', async () => {
      const { inferRemoteSize } = await import('astro:assets');
      (inferRemoteSize as any).mockRejectedValueOnce(new Error('Optimization failed'));

      const gallerie = [{ id: 'broken-img', sort: 1 }];
      const result = await prepareGalleryImages(gallerie, directusUrl);

      expect(result).toEqual([]);
    });
  });
});
