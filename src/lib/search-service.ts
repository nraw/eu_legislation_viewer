import { NavigationItem, regulationNavigationStructure, regulationHtmlContent } from "@/data/regulation-content";

export interface SearchResult {
  id: string;
  title: string;
  type: 'article' | 'whereas' | 'chapter' | 'section' | 'paragraph' | 'point';
  content: string;
  highlights: string[];
  score: number;
}

export interface SearchIndex {
  id: string;
  title: string;
  content: string;
  type: 'article' | 'whereas' | 'chapter' | 'section' | 'paragraph' | 'point';
  level: number;
}

class SearchService {
  private searchIndex: SearchIndex[] = [];
  private initialized = false;

  private getHtmlContentMap(): Map<string, string> {
    if (typeof window === 'undefined') return new Map();
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = regulationHtmlContent;
    
    const contentMap = new Map<string, string>();
    const elementsWithIds = tempDiv.querySelectorAll('[id]');
    
    elementsWithIds.forEach(element => {
      const id = element.id;
      const textContent = element.textContent?.trim() || '';
      if (id && textContent) {
        contentMap.set(id, textContent);
      }
    });
    
    return contentMap;
  }

  private initializeIndex() {
    if (this.initialized) return;

    // Create a map to track which IDs we've already indexed
    const indexedIds = new Set<string>();
    
    // Get HTML content for navigation items
    const htmlContentMap = this.getHtmlContentMap();
    
    // Index navigation items first (these have the clean titles)
    const navigationIndex = regulationNavigationStructure.map(item => {
      indexedIds.add(item.id);
      const htmlContent = htmlContentMap.get(item.id) || item.title;
      return {
        id: item.id,
        title: item.title,
        content: htmlContent,
        type: item.type,
        level: item.level
      };
    });

    // Extract text content from HTML for items not in navigation
    const htmlIndex = this.extractContentFromHtml(indexedIds);
    
    this.searchIndex = [...navigationIndex, ...htmlIndex];
    this.initialized = true;
  }

  private extractContentFromHtml(indexedIds: Set<string>): SearchIndex[] {
    if (typeof window === 'undefined') return [];
    
    // Create a temporary DOM element to parse the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = regulationHtmlContent;
    
    const index: SearchIndex[] = [];
    
    // Extract content from specific elements with IDs that haven't been indexed yet
    const elementsWithIds = tempDiv.querySelectorAll('[id]');
    
    elementsWithIds.forEach(element => {
      const id = element.id;
      const textContent = element.textContent?.trim() || '';
      
      // Skip if already indexed or if content is too short
      if (!id || indexedIds.has(id) || !textContent || textContent.length < 10) {
        return;
      }
      
      // Try to infer type from element class or structure
      const className = element.className || '';
      let type: SearchIndex['type'] = 'paragraph';
      let level = 4;

      if (className.includes('ManualHeading1')) {
        type = 'chapter';
        level = 1;
      } else if (className.includes('ManualHeading2')) {
        type = 'section';
        level = 2;
      } else if (className.includes('ManualHeading3')) {
        type = 'article';
        level = 3;
      } else if (className.includes('Point')) {
        type = 'point';
        level = 5;
      }

      index.push({
        id,
        title: textContent.substring(0, 100) + (textContent.length > 100 ? '...' : ''),
        content: textContent,
        type,
        level
      });
    });
    
    return index;
  }

  private normalizeText(text: string): string {
    return text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private calculateScore(item: SearchIndex, query: string): number {
    const normalizedQuery = this.normalizeText(query);
    const normalizedTitle = this.normalizeText(item.title);
    const normalizedContent = this.normalizeText(item.content);
    
    let score = 0;
    
    // Exact title match gets highest score
    if (normalizedTitle.includes(normalizedQuery)) {
      score += 100;
      // Bonus for exact word match
      if (normalizedTitle.split(' ').includes(normalizedQuery)) {
        score += 50;
      }
    }
    
    // Content match
    if (normalizedContent.includes(normalizedQuery)) {
      score += 20;
      // Bonus for word boundary matches
      const words = normalizedQuery.split(' ');
      words.forEach(word => {
        if (word.length > 2) {
          const regex = new RegExp(`\\b${word}\\b`, 'gi');
          const matches = normalizedContent.match(regex);
          if (matches) {
            score += matches.length * 5;
          }
        }
      });
    }
    
    // Type-based scoring (higher level elements get slight bonus)
    const typeBonus = {
      chapter: 20,
      section: 15,
      article: 10,
      paragraph: 5,
      point: 2,
      whereas: 1
    };
    
    score += typeBonus[item.type] || 0;
    
    // Shorter titles are often more relevant
    if (item.title.length < 50) {
      score += 10;
    }
    
    return score;
  }

  private highlightMatches(text: string, query: string): string[] {
    const normalizedQuery = this.normalizeText(query);
    const words = normalizedQuery.split(' ').filter(word => word.length > 2);
    
    const highlights: string[] = [];
    
    words.forEach(word => {
      const regex = new RegExp(`(\\S*${word}\\S*)`, 'gi');
      const matches = text.match(regex);
      if (matches) {
        matches.forEach(match => {
          // Get surrounding context (30 chars before and after)
          const index = text.toLowerCase().indexOf(match.toLowerCase());
          if (index !== -1) {
            const start = Math.max(0, index - 30);
            const end = Math.min(text.length, index + match.length + 30);
            let context = text.substring(start, end);
            
            // Add ellipsis if we're not at the beginning/end
            if (start > 0) context = '...' + context;
            if (end < text.length) context = context + '...';
            
            // Highlight the match
            context = context.replace(
              new RegExp(`(${match})`, 'gi'),
              '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>'
            );
            
            highlights.push(context);
          }
        });
      }
    });
    
    // Remove duplicates and limit to 3 highlights
    return [...new Set(highlights)].slice(0, 3);
  }

  search(query: string): SearchResult[] {
    this.initializeIndex();
    
    if (!query || query.trim().length < 2) {
      return [];
    }
    
    const normalizedQuery = this.normalizeText(query);
    
    const results = this.searchIndex
      .map(item => {
        const score = this.calculateScore(item, normalizedQuery);
        
        if (score === 0) return null;
        
        const highlights = this.highlightMatches(item.content, query);
        
        return {
          id: item.id,
          title: item.title,
          type: item.type,
          content: item.content.substring(0, 200) + (item.content.length > 200 ? '...' : ''),
          highlights,
          score
        };
      })
      .filter((result): result is SearchResult => result !== null)
      .sort((a, b) => b.score - a.score)
      .slice(0, 50); // Limit to 50 results
    
    return results;
  }

  searchNavigation(query: string): NavigationItem[] {
    if (!query || query.trim().length < 2) {
      return regulationNavigationStructure;
    }

    const normalizedQuery = this.normalizeText(query);
    
    return regulationNavigationStructure.filter(item => {
      const normalizedTitle = this.normalizeText(item.title);
      return normalizedTitle.includes(normalizedQuery);
    });
  }
}

export const searchService = new SearchService();