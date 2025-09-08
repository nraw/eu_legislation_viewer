import { AvailableDocument, LegislationDocument } from '@/types/legislation';
import { csaRegulationContent } from '@/data/csa-regulation-data-full';

export class DocumentService {
  static getAvailableDocuments(): AvailableDocument[] {
    return [
      {
        id: 'csa-regulation-2022',
        title: 'Regulation on preventing and combating child sexual abuse',
        url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:52022PC0209',
        reference: 'CELEX:52022PC0209',
        type: 'EU Regulation Proposal',
        description: 'Proposal for a regulation laying down rules to prevent and combat child sexual abuse'
      },
      {
        id: 'gdpr-2016',
        title: 'General Data Protection Regulation (GDPR)',
        url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32016R0679',
        reference: 'CELEX:32016R0679',
        type: 'EU Regulation',
        description: 'General Data Protection Regulation on the protection of natural persons'
      },
      {
        id: 'dsa-2022',
        title: 'Digital Services Act',
        url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32022R2065',
        reference: 'CELEX:32022R2065',
        type: 'EU Regulation',
        description: 'Regulation on a Single Market For Digital Services'
      },
      {
        id: 'ai-act-2024',
        title: 'Artificial Intelligence Act',
        url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32024R1689',
        reference: 'CELEX:32024R1689',
        type: 'EU Regulation',
        description: 'Regulation laying down harmonised rules on artificial intelligence'
      }
    ];
  }

  static async fetchDocument(document: AvailableDocument): Promise<LegislationDocument> {
    // Return real parsed content for CSA regulation
    if (document.id === 'csa-regulation-2022') {
      return {
        id: document.id,
        title: document.title,
        url: document.url,
        reference: document.reference,
        type: document.type,
        content: csaRegulationContent
      };
    }

    // For other documents, show that they would need to be implemented
    return {
      id: document.id,
      title: document.title,
      url: document.url,
      reference: document.reference,
      type: document.type,
      content: {
        title: document.title,
        chapters: [
          {
            id: 'placeholder',
            title: 'Document Not Yet Parsed',
            number: '1',
            articles: [
              {
                id: 'placeholder-1',
                title: 'Implementation Needed',
                number: '1',
                paragraphs: [
                  {
                    id: 'placeholder-1-p1',
                    content: `This document (${document.title}) would need to be downloaded and parsed using the same process as the Child Sexual Abuse regulation. The DocumentParser can be used to extract the real content from the EUR-Lex URL: ${document.url}`
                  }
                ]
              }
            ]
          }
        ]
      }
    };
  }
}

export default DocumentService;