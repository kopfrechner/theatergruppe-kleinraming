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

interface Schema {
  stuecke: Stueck[];
  theatermenschen: Theatermensch[];
  sponsoren: Sponsor[];
}

const client = createDirectus<Schema>('https://cms.kopfarbeit.dev').with(rest());

export default client;
export { readItems, readItem };
