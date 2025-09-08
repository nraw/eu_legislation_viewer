import { LegislationDocument, DocumentContent, DocumentChapter, DocumentSection, DocumentArticle } from '@/types/legislation';

export class DocumentParser {
  static parseEuLexDocument(htmlContent: string, documentInfo: { id: string, title: string, url: string, reference: string }): LegislationDocument {
    // Create a DOM parser (this would need to be adapted for server-side)
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    const content = this.extractContent(doc);
    
    return {
      id: documentInfo.id,
      title: documentInfo.title,
      url: documentInfo.url,
      reference: documentInfo.reference,
      type: 'EU Regulation',
      content
    };
  }

  private static extractContent(doc: Document): DocumentContent {
    const title = this.extractTitle(doc);
    const preamble = this.extractPreamble(doc);
    const chapters = this.extractChapters(doc);
    
    return {
      title,
      preamble,
      chapters
    };
  }

  private static extractTitle(doc: Document): string {
    // Look for common EU legislation title patterns
    const titleSelectors = [
      'h1.doc-title',
      '.title-doc',
      'h1',
      '.document-title'
    ];
    
    for (const selector of titleSelectors) {
      const element = doc.querySelector(selector);
      if (element && element.textContent?.trim()) {
        return element.textContent.trim();
      }
    }
    
    return 'EU Legislation Document';
  }

  private static extractPreamble(doc: Document): DocumentSection | undefined {
    // Look for preamble or "whereas" clauses
    const preambleElements = doc.querySelectorAll('.preamble, .whereas, [id*="whereas"]');
    
    if (preambleElements.length === 0) return undefined;
    
    const articles: DocumentArticle[] = [];
    
    preambleElements.forEach((element, index) => {
      const content = element.textContent?.trim() || '';
      if (content) {
        articles.push({
          id: `whereas-${index + 1}`,
          title: `Whereas (${index + 1})`,
          number: `${index + 1}`,
          paragraphs: [{
            id: `whereas-${index + 1}-p1`,
            content: content
          }]
        });
      }
    });
    
    return {
      id: 'preamble',
      title: 'Preamble',
      articles
    };
  }

  private static extractChapters(doc: Document): DocumentChapter[] {
    const chapters: DocumentChapter[] = [];
    
    // Look for chapter headings
    const chapterElements = doc.querySelectorAll('h2, h3, .chapter, [id*="chapter"], [class*="chapter"]');
    
    let currentChapter: DocumentChapter | null = null;
    let chapterCounter = 1;
    
    // If no explicit chapters found, create a single chapter with all articles
    if (chapterElements.length === 0) {
      const articles = this.extractArticles(doc);
      if (articles.length > 0) {
        chapters.push({
          id: 'main-content',
          title: 'Main Content',
          articles
        });
      }
      return chapters;
    }
    
    chapterElements.forEach((element, index) => {
      const title = element.textContent?.trim() || `Chapter ${chapterCounter}`;
      const chapterId = `chapter-${chapterCounter}`;
      
      // Extract articles between this chapter and the next
      const articles = this.extractArticlesInRange(doc, element, 
        index < chapterElements.length - 1 ? chapterElements[index + 1] : null);
      
      currentChapter = {
        id: chapterId,
        title: title,
        number: chapterCounter.toString(),
        articles
      };
      
      chapters.push(currentChapter);
      chapterCounter++;
    });
    
    return chapters;
  }

  private static extractArticles(doc: Document): DocumentArticle[] {
    const articles: DocumentArticle[] = [];
    
    // Look for article elements
    const articleElements = doc.querySelectorAll('.article, [id*="article"], [class*="article"]');
    
    articleElements.forEach((element, index) => {
      const title = this.extractArticleTitle(element) || `Article ${index + 1}`;
      const content = this.extractArticleContent(element);
      
      articles.push({
        id: `article-${index + 1}`,
        title: title,
        number: `${index + 1}`,
        paragraphs: [{
          id: `article-${index + 1}-p1`,
          content: content
        }]
      });
    });
    
    return articles;
  }

  private static extractArticlesInRange(doc: Document, startElement: Element, endElement: Element | null): DocumentArticle[] {
    const articles: DocumentArticle[] = [];
    
    // This is a simplified version - in reality, you'd need more sophisticated DOM traversal
    let current: Element | null = startElement.nextElementSibling;
    
    while (current && current !== endElement) {
      if (current.matches('.article, [id*="article"], [class*="article"]')) {
        const title = this.extractArticleTitle(current) || `Article ${articles.length + 1}`;
        const content = this.extractArticleContent(current);
        
        articles.push({
          id: `article-${articles.length + 1}`,
          title: title,
          number: `${articles.length + 1}`,
          paragraphs: [{
            id: `article-${articles.length + 1}-p1`,
            content: content
          }]
        });
      }
      current = current.nextElementSibling;
    }
    
    return articles;
  }

  private static extractArticleTitle(element: Element): string {
    // Look for article title in various formats
    const titleElement = element.querySelector('h4, h5, .article-title, .title');
    if (titleElement) {
      return titleElement.textContent?.trim() || '';
    }
    
    // Extract from the beginning of the text content
    const text = element.textContent?.trim() || '';
    const match = text.match(/^(Article\s+\d+[a-z]?.*?)[\.\n]/i);
    return match ? match[1] : '';
  }

  private static extractArticleContent(element: Element): string {
    // Remove title and get the main content
    const clone = element.cloneNode(true) as Element;
    const titleElement = clone.querySelector('h4, h5, .article-title, .title');
    if (titleElement) {
      titleElement.remove();
    }
    
    return clone.textContent?.trim() || '';
  }
}

export default DocumentParser;