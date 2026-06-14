import { createDirectus, rest, readItems, readItem, readSingleton } from '@directus/sdk';

interface Stueck {
  id: string;
  titel: string;
  auffuehrung_im_jahr: number;
  synopsis: string;
  flyer?: string;
  titelfoto?: string;
  gallerie?: any[];
  spieler?: any[];
}

interface Theatermensch {
  id: string;
  name: string;
  funktionen: string;
  steckbrief: string;
  foto?: string;
  foto_funny?: string;
  aktiver_theatermensch: boolean;
  vorstandsmitglied: boolean;
}

interface Sponsor {
  id: string;
  unternehmen: string;
  link?: string;
  bild?: string;
}

interface Startseite {
  id: string;
  emotionen_titel: string;
  emotionen_bild: string | any;
  impressionen_gallerie: any[];
}

interface TicketPromotion {
  id: string;
  anzeige_modus: 'inaktiv' | 'vorab_reservierung' | 'ticket_promotion';
  titel: string;
  vorab_titel?: string;
  kurzbeschreibung: string;
  vorab_text?: string;
  vorab_bild?: any;
  ticketlotse_link: string;
  spielort?: string;
  telefon_reservierung?: string;
  termin_1?: string;
  termin_2?: string;
  termin_3?: string;
  termin_4?: string;
  termin_5?: string;
  termin_6?: string;
  autor?: string;
  genre?: string;
  preis_erwachsene?: string;
  preis_jugendliche?: string;
  map_embed?: string;
  crew?: any[];
  hauptfoto?: any;
  foto_szene_1?: any;
  foto_szene_2?: any;
  foto_szene_3?: any;
  foto_szene_4?: any;
}

interface FAQItem {
  frage: string;
  antwort: string;
}

interface KontaktSeite {
  id: string;
  email: string;
  telefon: string;
  faq: FAQItem[];
  location_name: string;
  map_embed: string;
}

interface Impressum {
  id: string;
  content: string;
}

interface Datenschutz {
  id: string;
  content: string;
}

interface Schema {
  stuecke: Stueck[];
  theatermenschen: Theatermensch[];
  sponsoren: Sponsor[];
  startseite: Startseite;
  ticket_promotion: TicketPromotion;
  kontakt_seite: KontaktSeite;
  impressum: Impressum;
  datenschutz: Datenschutz;
}

export const DIRECTUS_URL = 'https://cms.kopfarbeit.dev';

const client = createDirectus<Schema>(DIRECTUS_URL).with(rest());

export default client;
export { readItems, readItem, readSingleton };
