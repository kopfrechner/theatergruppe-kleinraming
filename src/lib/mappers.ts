import he from "he";

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
