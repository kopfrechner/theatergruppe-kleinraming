import { getImage, inferRemoteSize } from 'astro:assets';
import he from 'he';
import type { Stueck, TicketPromotion } from './directus';

export async function prepareGalleryImages(
  gallerie: any[],
  directusUrl: string,
) {
  if (!gallerie || gallerie.length === 0) return [];

  // Sort by 'sort' field from the junction table
  const sortedGallerie = [...gallerie].sort((a, b) => {
    const sortA = a.sort ?? 0;
    const sortB = b.sort ?? 0;
    return sortA - sortB;
  });

  const images = await Promise.all(
    sortedGallerie.map(async (item) => {
      // Extract file ID from M2M junction or direct ID
      const fileId =
        item.directus_files_id?.id || item.directus_files_id || item.id;
      if (!fileId) return null;

      const remoteUrl = `${directusUrl}/assets/${fileId}`;

      try {
        const { width: origWidth, height: origHeight } =
          await inferRemoteSize(remoteUrl);
        const targetWidth = Math.min(origWidth, 1600);
        const aspectRatio = origWidth / origHeight;
        const targetHeight = Math.round(targetWidth / aspectRatio);

        const optimized = await getImage({
          src: remoteUrl,
          width: targetWidth,
          height: targetHeight,
          format: 'webp',
        });

        return {
          src: optimized.src,
          width: targetWidth,
          height: targetHeight,
          thumbnail: remoteUrl,
          id: fileId,
        };
      } catch (e) {
        console.error(`Fehler beim Verarbeiten von Bild ${fileId}:`, e);
        return null;
      }
    }),
  );

  return images.filter((img) => img !== null);
}

export function mapHighlightPlay(
  ticketPromo: TicketPromotion | null | undefined,
  lastPlay: Stueck | null | undefined,
  directusUrl: string,
) {
  const anzeigeModus = ticketPromo?.anzeige_modus || 'inaktiv';

  if (anzeigeModus === 'inaktiv') {
    if (!lastPlay) return null;

    const cleanSynopsis = he.decode(
      (lastPlay.synopsis || '').replace(/<[^>]*>?/gm, ''),
    );

    return {
      isHistorical: true,
      titel: lastPlay.titel,
      text:
        cleanSynopsis.length > 180
          ? cleanSynopsis.substring(0, 180).trim() + '...'
          : cleanSynopsis,
      link: `/stuecke/${lastPlay.slug || lastPlay.id}`,
      buttonText: 'Zum Stück',
      status: 'Rückblick',
      umamiEvent: 'umami--click--stuecke-archiv-bento-highlight',
      termine: [],
      image: lastPlay.titelfoto
        ? `${directusUrl}/assets/${lastPlay.titelfoto.id || lastPlay.titelfoto}`
        : null,
    };
  }

  if (!ticketPromo) return null;

  // Active Ticket Promotion (either vorab_reservierung or ticket_promotion)
  const isPreBooking = anzeigeModus === 'vorab_reservierung';
  const locale = 'de-AT';
  const dateFormat: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Vienna',
  };

  const termineArray = [
    ticketPromo.termin_1,
    ticketPromo.termin_2,
    ticketPromo.termin_3,
    ticketPromo.termin_4,
    ticketPromo.termin_5,
    ticketPromo.termin_6,
  ]
    .filter((t): t is string => !!t)
    .map((t) => new Date(t).toLocaleString(locale, dateFormat) + ' Uhr');

  const displayTitle = isPreBooking
    ? ticketPromo.vorab_titel || ticketPromo.titel
    : ticketPromo.titel;

  const displayText = isPreBooking
    ? ticketPromo.vorab_text || ticketPromo.kurzbeschreibung
    : ticketPromo.kurzbeschreibung;

  const displayImage = isPreBooking
    ? ticketPromo.vorab_bild || ticketPromo.hauptfoto
    : ticketPromo.hauptfoto;

  return {
    isHistorical: false,
    titel: displayTitle,
    text:
      (displayText || '').length > 180
        ? displayText.substring(0, 180).trim() + '...'
        : displayText,
    link: '/tickets',
    buttonText: 'Tickets reservieren',
    status: isPreBooking ? 'Saison-Vorschau' : 'Nächste Premiere',
    umamiEvent: isPreBooking
      ? 'umami--click--vorschau-bento-highlight'
      : 'umami--click--tickets-bento-highlight',
    termine: termineArray,
    image: displayImage
      ? `${directusUrl}/assets/${displayImage.id || displayImage}`
      : null,
  };
}
