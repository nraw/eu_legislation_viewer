export interface LegislationDocument {
  id: string;
  title: string;
  url: string;
  reference: string;
  type: string;
  date?: string;
  content: DocumentContent;
}

export interface DocumentContent {
  title: string;
  preamble?: DocumentSection;
  chapters: DocumentChapter[];
  annexes?: DocumentSection[];
}

export interface DocumentChapter {
  id: string;
  title: string;
  number?: string;
  sections?: DocumentSection[];
  articles?: DocumentArticle[];
}

export interface DocumentSection {
  id: string;
  title: string;
  number?: string;
  subsections?: DocumentSection[];
  articles?: DocumentArticle[];
  content?: string;
}

export interface DocumentArticle {
  id: string;
  title: string;
  number: string;
  paragraphs: DocumentParagraph[];
  content?: string;
}

export interface DocumentParagraph {
  id: string;
  number?: string;
  content: string;
  subparagraphs?: DocumentParagraph[];
}

export interface AvailableDocument {
  id: string;
  title: string;
  url: string;
  reference: string;
  type: string;
  description: string;
}