import { getImage, inferRemoteSize } from "astro:assets";
import he from "he";

export async function prepareGalleryImages(foto_gallerie: any[], directusUrl: string) {
  if (!foto_gallerie || foto_gallerie.length === 0) return [];

  const images = await Promise.all(
    foto_gallerie.map(async (item) => {
      if (!item.directus_files_id) return null;

      const remoteUrl = `${directusUrl}/assets/${item.directus_files_id}`;

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
          format: "webp",
        });

        return {
          src: optimized.src,
          width: targetWidth,
          height: targetHeight,
          thumbnail: remoteUrl,
          id: item.directus_files_id,
        };
      } catch (e) {
        console.error(`Fehler beim Verarbeiten von Bild ${item.directus_files_id}:`, e);
        return null;
      }
    })
  );

  return images.filter((img) => img !== null);
}

export function mapHighlightPlay(ticketPromo: any, lastPlay: any, directusUrl: string) {
  const anzeigeModus = ticketPromo?.anzeige_modus || (ticketPromo?.aktiv ? 'ticket_promotion' : 'inaktiv');

  if (anzeigeModus === 'inaktiv') {
    if (!lastPlay) return null;

    const cleanSynopsis = he.decode(
      (lastPlay.synopsis || "").replace(/<[^>]*>?/gm, ""),
    );

    return {
      isHistorical: true,
      titel: lastPlay.titel,
      text:
        cleanSynopsis.length > 180
          ? cleanSynopsis.substring(0, 180).trim() + "..."
          : cleanSynopsis,
      link: `/stuecke/${lastPlay.slug || lastPlay.id}`,
      buttonText: "Zum Stück",
      status: "Rückblick",
      termine: [],
      image: lastPlay.titelfoto ? `${directusUrl}/assets/${lastPlay.titelfoto}` : null,
    };
  }

  // Active Ticket Promotion (either vorab_reservierung or ticket_promotion)
  const isPreBooking = anzeigeModus === 'vorab_reservierung';
  const locale = "de-AT";
  const dateFormat: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Vienna",
  };

  const termineArray = [
    ticketPromo.termin_1,
    ticketPromo.termin_2,
    ticketPromo.termin_3,
    ticketPromo.termin_4,
    ticketPromo.termin_5,
    ticketPromo.termin_6,
  ]
    .filter((t) => t)
    .map((t) => new Date(t).toLocaleString(locale, dateFormat) + " Uhr");

  const displayTitle = isPreBooking
    ? (ticketPromo.vorab_titel || ticketPromo.titel)
    : ticketPromo.titel;

  const displayText = isPreBooking 
    ? (ticketPromo.vorab_text || ticketPromo.kurzbeschreibung)
    : ticketPromo.kurzbeschreibung;

  const displayImage = isPreBooking
    ? (ticketPromo.vorab_bild || ticketPromo.hauptfoto)
    : ticketPromo.hauptfoto;

  return {
    isHistorical: false,
    titel: displayTitle,
    text:
      (displayText || "").length > 180
        ? displayText.substring(0, 180).trim() + "..."
        : displayText,
    link: "/tickets",
    buttonText: "Tickets reservieren",
    status: isPreBooking ? "Saison-Vorschau" : "Nächste Premiere",
    termine: termineArray,
    image: displayImage
      ? `${directusUrl}/assets/${displayImage.id || displayImage}`
      : null,
  };
}
