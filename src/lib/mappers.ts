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
  if (!ticketPromo?.aktiv) {
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

  // Active Ticket Promotion
  const locale = "de-AT";
  const dateFormat: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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

  return {
    isHistorical: false,
    titel: ticketPromo.titel,
    text:
      ticketPromo.kurzbeschreibung.length > 180
        ? ticketPromo.kurzbeschreibung.substring(0, 180).trim() + "..."
        : ticketPromo.kurzbeschreibung,
    link: "/tickets",
    buttonText: "Tickets reservieren",
    status: "Nächste Premiere",
    termine: termineArray,
    image: ticketPromo.hauptfoto
      ? `${directusUrl}/assets/${ticketPromo.hauptfoto}`
      : null,
  };
}
