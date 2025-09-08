const fs = require('fs');
const { JSDOM } = require('jsdom');

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
    const isChapterNumber = text.match(/^CHAPTER\s+[IVX]+$/) && 
                           element.className?.includes('ManualHeading1');
    
    const isChapterTitle = element.className?.includes('ManualHeading1') && 
                          !text.match(/^CHAPTER\s+[IVX]+$/) && 
                          text.length > 15;
    
    const isArticleNumber = text.match(/^Article\s+\d+$/) && 
                           element.className?.includes('ManualHeading3');
    
    const isArticleTitle = element.className?.includes('ManualHeading3') && 
                          !text.match(/^Article\s+\d+$/) && 
                          !text.match(/^Section\s+\d+/) &&
                          text.length > 10;
    
    const isSectionNumber = text.match(/^Section\s+\d+$/) && 
                           element.className?.includes('ManualHeading2');
    
    const isSectionTitle = element.className?.includes('ManualHeading2') && 
                          !text.match(/^Section\s+\d+$/) && 
                          text.length > 10;
    
    // Process chapter numbers and combine with titles
    if (isChapterNumber) {
      let chapterTitle = text;
      
      // Look ahead for chapter title
      for (let j = i + 1; j < Math.min(i + 3, regulationElements.length); j++) {
        const nextEl = regulationElements[j];
        const nextText = nextEl.textContent?.trim();
        if (nextEl.className?.includes('ManualHeading1') && 
            nextText && !nextText.match(/^CHAPTER\s+[IVX]+$/)) {
          chapterTitle = `${text} - ${nextText}`;
          processedIds.add(nextEl);
          break;
        }
      }
      
      const id = `chapter-${itemIndex}`;
      cleanElement.id = id;
      
      currentChapter = {
        id: id,
        title: chapterTitle,
        level: 1,
        type: 'chapter',
        children: []
      };
      
      chapters.push(currentChapter);
      currentSection = null;
      itemIndex++;
      htmlContent += cleanElement.outerHTML + '\n';
      processedIds.add(element);
    }
    // Process article numbers and combine with titles
    else if (isArticleNumber && currentChapter) {
      let articleTitle = text;
      
      // Look ahead for article title (next ManualHeading3 that's not an article number)
      for (let j = i + 1; j < Math.min(i + 3, regulationElements.length); j++) {
        const nextEl = regulationElements[j];
        const nextText = nextEl.textContent?.trim();
        if (nextEl.className?.includes('ManualHeading3') && 
            nextText && !nextText.match(/^Article\s+\d+$/) &&
            !nextText.match(/^Section\s+\d+/)) {
          articleTitle = `${text}: ${nextText}`;
          processedIds.add(nextEl);
          break;
        }
      }
      
      const id = `article-${itemIndex}`;
      cleanElement.id = id;
      
      const article = {
        id: id,
        title: articleTitle,
        level: 3,
        type: 'article'
      };
      
      if (currentSection) {
        currentSection.children.push(article);
      } else {
        currentChapter.children.push(article);
      }
      
      itemIndex++;
      htmlContent += cleanElement.outerHTML + '\n';
      processedIds.add(element);
    }
    // Process section numbers and combine with titles
    else if (isSectionNumber && currentChapter) {
      let sectionTitle = text;
      
      // Look ahead for section title
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
      itemIndex++;
      htmlContent += cleanElement.outerHTML + '\n';
      processedIds.add(element);
    }
    // Skip standalone titles that were already processed
    else if ((isChapterTitle || isArticleTitle || isSectionTitle) && processedIds.has(element)) {
      continue;
    }
    // Include other content
    else if (!isChapterTitle && !isArticleTitle && !isSectionTitle) {
      htmlContent += cleanElement.outerHTML + '\n';
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
    chapter.children.slice(0, 5).forEach((child, j) => { // Show first 5 only
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
  type: 'article' | 'whereas' | 'chapter' | 'section' | 'paragraph';
  hasChildren?: boolean;
}

export const regulationNavigationStructure: NavigationItem[] = ${JSON.stringify(result.navigationItems, null, 2)};

export const regulationHierarchicalStructure = ${JSON.stringify(result.hierarchicalNav, null, 2)};

export const regulationHtmlContent = \`${result.htmlContent.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;
`;
  
  fs.writeFileSync('src/data/regulation-content-final.ts', tsContent);
  
  console.log('Final regulation content with proper article titles extracted!');
  console.log(`- TypeScript data: src/data/regulation-content-final.ts`);
}