import { createDirectus, rest, readItems } from '@directus/sdk';

interface Stueck {
  id: string;
  status: string;
  titel: string;
  auffuehrung_im_jahr: number;
  synopsis: string;
  flyer?: string;
  titelfoto?: string;
  foto_gallerie?: any[];
  spieler?: any[];
}

interface Theatermensch {
  id: string;
  status: string;
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
  aktiv: boolean;
  titel: string;
  kurzbeschreibung: string;
  termine: string;
  ticketlotse_link: string;
}

interface Schema {
  stuecke: Stueck[];
  theatermenschen: Theatermensch[];
  sponsoren: Sponsor[];
  startseite: Startseite;
  ticket_promotion: TicketPromotion;
}

export const DIRECTUS_URL = 'https://cms.kopfarbeit.dev';

const client = createDirectus<Schema>(DIRECTUS_URL).with(rest());

export default client;
export { readItems, readItem };
