interface ImageFormat {
  url: string;
  width: number;
  height: number;
}

export default interface Stueck {
  id: number;
  documentId: string;
  titel: string;
  slug: string;
  jahr: number;
  saison?: string;
  beschreibung?: any;
  aktiv?: boolean;
  vorschaubild?: {
    url: string;
    alternativeText?: string;
    formats?: {
      thumbnail?: ImageFormat;
      small?: ImageFormat;
      medium?: ImageFormat;
      large?: ImageFormat;
    };
  };
  galerie?: Array<{
    url: string;
    alternativeText?: string;
    formats?: {
      thumbnail?: ImageFormat;
      small?: ImageFormat;
      medium?: ImageFormat;
      large?: ImageFormat;
    };
  }>;
  spieler?: Array<{
    stuecke_id: string;
    theatermenschen_id: {
      id: string;
      name: string;
      foto?: {
        url: string;
      };
    };
    rolle_name?: string;
    rolle_beschreibung?: string;
    sort?: number;
  }>;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

