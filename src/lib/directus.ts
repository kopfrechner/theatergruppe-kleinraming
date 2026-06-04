import { createDirectus, rest, readItems, readItem } from '@directus/sdk';

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

interface HomepageConfig {
  id: string;
  emotionen_bild: string | any;
  impressionen_galerie: any[];
}

interface AktuellesStueck {
  id: string;
  aktiv: boolean;
  titel: string;
  kurzbeschreibung: string;
  termine: string[];
  ticketlotse_link: string;
  verknuepftes_stueck?: string | any;
}

interface Schema {
  stuecke: Stueck[];
  theatermenschen: Theatermensch[];
  sponsoren: Sponsor[];
  homepage_config: HomepageConfig;
  aktuelles_stueck: AktuellesStueck;
}

const client = createDirectus<Schema>('https://cms.kopfarbeit.dev').with(rest());

export default client;
export { readItems, readItem };
