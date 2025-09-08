import fs from 'fs';
import { JSDOM } from 'jsdom';

const html = fs.readFileSync('csa-regulation-full.html', 'utf8');
const dom = new JSDOM(html);
const document = dom.window.document;

function parseRegulationFinal() {
  console.log('Parsing regulation with proper article title combination...');
  
  // Find the actual regulation start - look for "CHAPTER I"
  const allElements = Array.from(document.querySelectorAll('*'));
  const chapterOneIndex = allElements.findIndex(el => 
    el.textContent?.trim() === 'CHAPTER I'
  );
  
  if (chapterOneIndex === -1) {
    console.error('Could not find CHAPTER I');
    return null;
  }
  
  console.log('Found CHAPTER I, extracting regulation content...');
  
  // Get elements from CHAPTER I onwards
  const regulationElements = allElements.slice(chapterOneIndex);
  
  let htmlContent = '';
  let chapters = [];
  let currentChapter = null;
  let currentSection = null;
  let currentArticle = null;
  let currentParagraph = null;
  let itemIndex = 0;
  let processedIds = new Set();
  
  for (let i = 0; i < regulationElements.length; i++) {
    const element = regulationElements[i];
    const text = element.textContent?.trim();
    if (!text || text.length < 3) continue;
    
    // Skip if already processed
    if (processedIds.has(element)) continue;
    
    // Clone and clean the element
    const cleanElement = element.cloneNode(true);
    const images = cleanElement.querySelectorAll('img');
    images.forEach(img => img.remove());
    
    // Identify different types
    const isChapterNumber = text.match(/^CHAPTER\s*[IVX]+\s*$/) && 
                           element.className?.includes('ManualHeading1');
    
    const isChapterTitle = element.className?.includes('ManualHeading1') && 
                          !text.match(/^CHAPTER\s*[IVX]+\s*$/) && 
                          text.length > 15;
    
    const isArticleNumber = text.match(/^Article\s+\d+$/) && 
                           (element.className?.includes('ManualHeading3') || element.className?.includes('Normal'));
    
    const isArticleTitle = (element.className?.includes('ManualHeading3') || element.className?.includes('Normal')) && 
                          !text.match(/^Article\s+\d+$/) && 
                          !text.match(/^Section\s+\d+/) &&
                          text.length > 10 && text.length < 100;
    
    const isSectionNumber = text.match(/^Section\s+\d+/) && 
                           element.className?.includes('ManualHeading2');
    
    const isSectionTitle = element.className?.includes('ManualHeading2') && 
                          !text.match(/^Section\s+\d+/) && 
                          !text.match(/^Article\s+\d+/) &&
                          !text.match(/^CHAPTER\s+[IVX]+/) &&
                          text.length > 10;

    const isParagraphNumber = element.className?.includes('ManualNumPar1') && 
                             text.match(/^\d+\./);

    const isParagraphContent = element.className?.includes('Normal') && 
                              text.length > 20 && 
                              !text.match(/^(CHAPTER|Article|Section)\s/) &&
                              !text.match(/^Article\s+\d+$/) &&
                              text.length >= 100;

    const isPoint = element.className?.match(/Point\d+/) && text.length > 10;
    
    // Process chapter numbers and combine with titles
    if (isChapterNumber) {
      let chapterTitle = text;
      
      // Look ahead for chapter title (extend search range to handle complex structures)
      for (let j = i + 1; j < Math.min(i + 5, regulationElements.length); j++) {
        const nextEl = regulationElements[j];
        const nextText = nextEl.textContent?.trim();
        if (nextEl.className?.includes('ManualHeading1') && 
            nextText && !nextText.match(/^CHAPTER\s*[IVX]+\s*$/) &&
            nextText.length > 5) {
          chapterTitle = `${text} - ${nextText}`;
          processedIds.add(nextEl);
          break;
        }
      }
      
      const id = `chapter-${itemIndex}`;
      
      // Create a combined chapter header element
      const chapterHeader = element.cloneNode(true);
      chapterHeader.textContent = chapterTitle;
      chapterHeader.className = element.className || 'ManualHeading1';
      chapterHeader.id = id;
      
      currentChapter = {
        id: id,
        title: chapterTitle,
        level: 1,
        type: 'chapter',
        children: []
      };
      
      chapters.push(currentChapter);
      currentSection = null;
      currentArticle = null;
      currentParagraph = null;
      itemIndex++;
      htmlContent += chapterHeader.outerHTML + '\n';
      processedIds.add(element);
    }
    // Process article numbers and combine with titles
    else if (isArticleNumber && currentChapter) {
      let articleTitle = text;
      
      // Look ahead for article title (next ManualHeading3 or Normal element that's not an article number)
      for (let j = i + 1; j < Math.min(i + 3, regulationElements.length); j++) {
        const nextEl = regulationElements[j];
        const nextText = nextEl.textContent?.trim();
        if ((nextEl.className?.includes('ManualHeading3') || nextEl.className?.includes('Normal')) && 
            nextText && !nextText.match(/^Article\s+\d+$/) &&
            !nextText.match(/^Section\s+\d+/) &&
            nextText.length > 5 && nextText.length < 100) {
          articleTitle = `${text}: ${nextText}`;
          processedIds.add(nextEl);
          break;
        }
      }
      
      const id = `article-${itemIndex}`;
      cleanElement.id = id;
      
      // Create a combined article header element
      const articleHeader = element.cloneNode(true);
      articleHeader.textContent = articleTitle;
      articleHeader.className = element.className || 'ManualHeading3';
      articleHeader.id = id;
      
      currentArticle = {
        id: id,
        title: articleTitle,
        level: 3,
        type: 'article',
        children: []
      };
      
      if (currentSection) {
        currentSection.children.push(currentArticle);
      } else {
        currentChapter.children.push(currentArticle);
      }
      
      currentParagraph = null; // Reset paragraph when new article starts
      itemIndex++;
      htmlContent += articleHeader.outerHTML + '\n';
      processedIds.add(element);
    }
    // Process section numbers and combine with titles
    else if (isSectionNumber && currentChapter) {
      // Use the element's textContent which already contains the full text
      let sectionTitle = text; // This already contains the full section title from nested spans
      
      // Fix spacing issues in section titles (e.g., "Section 1Risk" -> "Section 1: Risk")
      sectionTitle = sectionTitle.replace(/^(Section\s+\d+)([A-Z])/, '$1: $2');
      
      // Mark all nested spans as processed to prevent duplicates
      const sectionSpans = element.querySelectorAll('span');
      sectionSpans.forEach(span => processedIds.add(span));
      
      // Look ahead for section title only if current element doesn't have the full title
      if (text.match(/^Section\s+\d+$/)) {
        for (let j = i + 1; j < Math.min(i + 3, regulationElements.length); j++) {
          const nextEl = regulationElements[j];
          const nextText = nextEl.textContent?.trim();
          if (nextEl.className?.includes('ManualHeading2') && 
              nextText && !nextText.match(/^Section\s+\d+$/)) {
            sectionTitle = `${text}: ${nextText}`;
            processedIds.add(nextEl);
            break;
          }
        }
      }
      
      const id = `section-${itemIndex}`;
      cleanElement.id = id;
      
      currentSection = {
        id: id,
        title: sectionTitle,
        level: 2,
        type: 'section',
        children: []
      };
      
      currentChapter.children.push(currentSection);
      currentArticle = null;
      currentParagraph = null;
      itemIndex++;
      htmlContent += cleanElement.outerHTML + '\n';
      processedIds.add(element);
    }
    // Process paragraph numbers (1., 2., 3., etc.)
    else if (isParagraphNumber && currentArticle) {
      const id = `paragraph-${itemIndex}`;
      cleanElement.id = id;
      
      currentParagraph = {
        id: id,
        title: text,
        level: 4,
        type: 'paragraph',
        children: []
      };
      
      currentArticle.children.push(currentParagraph);
      itemIndex++;
      htmlContent += cleanElement.outerHTML + '\n';
      processedIds.add(element);
    }
    // Process paragraph content (Normal class text following numbered paragraphs)
    else if (isParagraphContent && currentArticle && !currentParagraph) {
      // This is a paragraph without a number, treat it as a standalone paragraph
      const id = `paragraph-${itemIndex}`;
      cleanElement.id = id;
      
      const paragraph = {
        id: id,
        title: text.length > 100 ? text.substring(0, 97) + '...' : text,
        level: 4,
        type: 'paragraph',
        children: []
      };
      
      currentArticle.children.push(paragraph);
      itemIndex++;
      htmlContent += cleanElement.outerHTML + '\n';
      processedIds.add(element);
      // Debug
      if (text.includes('This Regulation lays down uniform rules')) {
        console.log('PROCESSED as paragraph content:', text.substring(0, 100));
        console.log('Element classes:', element.className);
      }
    }
    // Process points (a), (b), (c), etc.
    else if (isPoint && currentParagraph) {
      const id = `point-${itemIndex}`;
      cleanElement.id = id;
      
      const point = {
        id: id,
        title: text.length > 80 ? text.substring(0, 77) + '...' : text,
        level: 5,
        type: 'point'
      };
      
      currentParagraph.children.push(point);
      itemIndex++;
      htmlContent += cleanElement.outerHTML + '\n';
      processedIds.add(element);
    }
    // Process standalone points (when no numbered paragraph exists)
    else if (isPoint && currentArticle && !currentParagraph) {
      const id = `point-${itemIndex}`;
      cleanElement.id = id;
      
      const point = {
        id: id,
        title: text.length > 80 ? text.substring(0, 77) + '...' : text,
        level: 5,
        type: 'point'
      };
      
      currentArticle.children.push(point);
      itemIndex++;
      htmlContent += cleanElement.outerHTML + '\n';
      processedIds.add(element);
    }
    // Skip standalone titles that were already processed
    else if ((isChapterTitle || isArticleTitle || isSectionTitle) && processedIds.has(element)) {
      continue;
    }
    // Include other content ONLY if it hasn't been processed yet AND has meaningful content
    else if (!isChapterTitle && !isArticleTitle && !isArticleNumber && !isSectionTitle && !isParagraphContent && !isParagraphNumber && !isPoint && !processedIds.has(element)) {
      // Skip elements with no class or only whitespace content that might be duplicates
      const hasClass = element.className && element.className.trim().length > 0;
      const isFormattingElement = element.tagName === 'BR' || element.tagName === 'HR' || text.length < 5;
      const isUnclassifiedSpan = element.tagName === 'SPAN' && !hasClass;
      
      // More aggressive filtering to prevent duplicates
      // Only include meaningful content elements, skip nested spans and potential duplicates
      const isRelevantContent = hasClass && !isUnclassifiedSpan && !isFormattingElement &&
        !text.match(/^\([a-z]\)$/) && // Skip standalone point markers like "(a)"
        !text.match(/^\d+\.$/) && // Skip standalone paragraph numbers like "1."
        !element.className?.includes('num') && // Skip number/marker elements
        !element.className?.match(/Point\d+/) && // Skip Point elements (they should be processed earlier)
        text.length > 10; // Only include substantial content
      
      if (isRelevantContent) {
        htmlContent += cleanElement.outerHTML + '\n';
      }
      processedIds.add(element);
    }
  }
  
  // Flatten the hierarchical structure
  function flattenNavigation(items, result = []) {
    for (const item of items) {
      result.push({
        id: item.id,
        title: item.title,
        level: item.level,
        type: item.type,
        hasChildren: item.children && item.children.length > 0
      });
      
      if (item.children) {
        flattenNavigation(item.children, result);
      }
    }
    return result;
  }
  
  const flatNavigationItems = flattenNavigation(chapters);
  
  console.log(`Extracted ${htmlContent.length} characters of regulation content`);
  console.log(`Created ${flatNavigationItems.length} navigation items`);
  console.log(`Found ${chapters.length} chapters`);
  
  // Log structure for debugging
  chapters.forEach((chapter, i) => {
    console.log(`Chapter ${i + 1}: ${chapter.title} (${chapter.children.length} children)`);
    chapter.children.slice(0, 5).forEach((child) => { // Show first 5 only
      if (child.type === 'section') {
        console.log(`  Section: ${child.title} (${child.children?.length || 0} articles)`);
      } else {
        console.log(`  ${child.type}: ${child.title}`);
      }
    });
    if (chapter.children.length > 5) {
      console.log(`  ... and ${chapter.children.length - 5} more items`);
    }
  });
  
  return {
    htmlContent: htmlContent,
    navigationItems: flatNavigationItems,
    hierarchicalNav: chapters
  };
}

const result = parseRegulationFinal();

if (result) {
  const tsContent = `export interface NavigationItem {
  id: string;
  title: string;
  level: number;
  type: 'article' | 'whereas' | 'chapter' | 'section' | 'paragraph' | 'point';
  hasChildren?: boolean;
}

export const regulationNavigationStructure: NavigationItem[] = ${JSON.stringify(result.navigationItems, null, 2)};

export const regulationHierarchicalStructure = ${JSON.stringify(result.hierarchicalNav, null, 2)};

export const regulationHtmlContent = \`${result.htmlContent.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;
`;
  
  fs.writeFileSync('src/data/regulation-content.ts', tsContent);
  
  console.log('Regulation content parsed successfully!');
  console.log(`- TypeScript data: src/data/regulation-content.ts`);
}