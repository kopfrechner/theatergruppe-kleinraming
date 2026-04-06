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
  };
  galerie?: Array<{
    url: string;
    alternativeText?: string;
  }>;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}
