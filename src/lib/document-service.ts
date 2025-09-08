import { AvailableDocument, LegislationDocument } from '@/types/legislation';
import { regulationHierarchicalStructure } from '@/data/regulation-content';

export class DocumentService {
  static getAvailableDocuments(): AvailableDocument[] {
    return [
      {
        id: 'csa-regulation-2022',
        title: 'Regulation on preventing and combating child sexual abuse',
        url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:52022PC0209',
        reference: 'COM(2022) 209',
        type: 'EU Regulation Proposal',
        description: 'Proposal for a regulation laying down rules to prevent and combat child sexual abuse online. This document has been fully parsed and analyzed with AI-generated summaries for easy navigation.'
      }
    ];
  }

  static async fetchDocument(document: AvailableDocument): Promise<LegislationDocument> {
    // Return real parsed content for CSA regulation
    return {
      id: document.id,
      title: document.title,
      url: document.url,
      reference: document.reference,
      type: document.type,
      content: {
        title: document.title,
        chapters: regulationHierarchicalStructure.map(chapter => ({
          id: chapter.id,
          title: chapter.title,
          number: chapter.id.split('-')[1],
          articles: chapter.children?.map(child => ({
            id: child.id,
            title: child.title,
            number: child.id.split('-')[1],
            paragraphs: [{
              id: `${child.id}-p1`,
              content: child.title
            }]
          })) || []
        }))
      }
    };
  }
}

export default DocumentService;