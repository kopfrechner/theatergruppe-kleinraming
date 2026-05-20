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
  beschreibung?: string;
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
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

