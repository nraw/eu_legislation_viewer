import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

// Import the parsed legislation content
const contentPath = './src/data/regulation-content.ts';

// Configuration for Claude API
const CLAUDE_API_CONFIG = {
  apiKey: process.env.ANTHROPIC_API_KEY,
  baseUrl: process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com',
  model: 'claude-3-5-sonnet-20241022',
  maxTokens: 150,
  temperature: 0.1
};

// Construct full API URL
const API_URL = CLAUDE_API_CONFIG.baseUrl.endsWith('/v1/messages') 
  ? CLAUDE_API_CONFIG.baseUrl 
  : `${CLAUDE_API_CONFIG.baseUrl.replace(/\/$/, '')}/v1/messages`;

// TEST MODE - Process only first 10 items
const TEST_MODE = false;  // Set to true for testing
const TEST_LIMIT = 5;

// Progress saving configuration
const SAVE_PROGRESS_INTERVAL = 25; // Save every 25 items
const PROGRESS_FILE = './content-summaries-progress.json';

// Check if API key is provided
if (!CLAUDE_API_CONFIG.apiKey) {
  console.error('Error: ANTHROPIC_API_KEY environment variable is required');
  console.error('Please add it to your .env file');
  process.exit(1);
}

if (TEST_MODE) {
  console.log(`🧪 TEST MODE: Processing only first ${TEST_LIMIT} items`);
}

console.log(`🔗 API URL: ${API_URL}`);
console.log(`🔑 API Key: ${CLAUDE_API_CONFIG.apiKey ? 'Set' : 'Missing'}`);
console.log(`🏠 Base URL: ${CLAUDE_API_CONFIG.baseUrl}`);

// Function to extract content from the TypeScript file
function parseRegulationContent() {
  try {
    const content = fs.readFileSync(contentPath, 'utf8');
    
    // Extract the navigation structure array
    const navStructureMatch = content.match(/export const regulationNavigationStructure: NavigationItem\[\] = (\[[\s\S]*?\]);/);
    if (!navStructureMatch) {
      throw new Error('Could not find regulationNavigationStructure in the file');
    }
    
    const navigationItems = JSON.parse(navStructureMatch[1]);
    
    // Extract the HTML content
    const htmlMatch = content.match(/export const regulationHtmlContent = `([\s\S]*?)`;/);
    if (!htmlMatch) {
      throw new Error('Could not find regulationHtmlContent in the file');
    }
    
    const htmlContent = htmlMatch[1]
      .replace(/\\`/g, '`')
      .replace(/\\\$/g, '$');
    
    return { navigationItems, htmlContent };
    
  } catch (error) {
    console.error('Error parsing regulation content:', error.message);
    process.exit(1);
  }
}

// Function to extract text content from HTML for a specific ID
function extractTextFromHtml(htmlContent, id) {
  // First try to find the element with the specific ID
  const idPattern = new RegExp(`<[^>]*id="${id}"[^>]*>([\\s\\S]*?)(?=<[^>]*id="[^"]*"|$)`, 'i');
  const match = htmlContent.match(idPattern);
  
  if (match) {
    let extractedContent = match[1];
    
    // Clean HTML tags but preserve the text content
    extractedContent = extractedContent
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Remove scripts
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') // Remove styles
      .replace(/<[^>]*>/g, ' ') // Remove HTML tags
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
    
    // If we have substantial content, return it
    if (extractedContent.length > 20) {
      return extractedContent;
    }
  }
  
  // Fallback: try to find content by looking for the ID in a more flexible way
  const flexiblePattern = new RegExp(`id="${id}"[^>]*>([^<]*)`, 'i');
  const flexibleMatch = htmlContent.match(flexiblePattern);
  
  if (flexibleMatch && flexibleMatch[1].trim().length > 0) {
    return flexibleMatch[1].trim();
  }
  
  return '';
}

// Function to call Claude API for summarization
async function summarizeContent(title, content, type) {
  // Prepare content for summarization
  let contentToSummarize = title;
  
  if (content && content.length > 20 && content !== title) {
    // We have both title and content - use both
    contentToSummarize = `${title}\n\nDetailed content: ${content}`;
  }
  
  let prompt;
  
  if (type === 'chapter' || type === 'article') {
    // For structural elements, provide context about their role
    prompt = `Provide an extremely concise summary for quick skimming. Requirements:
- Maximum 10 words
- No filler words like "This chapter" or "This article"
- Just the core topic/area covered
- Plain English only

${type === 'chapter' ? 'Chapter:' : 'Article:'} ${title}

Summary:`;
  } else {
    // For content elements (paragraphs, points), summarize the actual content
    prompt = `Provide an extremely concise summary for quick skimming. Requirements:
- Maximum 15 words
- No filler phrases 
- Just the core requirement/action
- Plain English only

${type === 'paragraph' ? 'Content:' : type === 'point' ? 'Content:' : 'Content:'} ${contentToSummarize}

Summary:`;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_CONFIG.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: CLAUDE_API_CONFIG.model,
        max_tokens: CLAUDE_API_CONFIG.maxTokens,
        temperature: CLAUDE_API_CONFIG.temperature,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    
    if (data.content && data.content[0] && data.content[0].text) {
      return data.content[0].text.trim();
    } else {
      throw new Error('Unexpected response format from Claude API');
    }
    
  } catch (error) {
    console.error(`Error summarizing "${title}":`, error.message);
    return `[Error: Could not generate summary for ${type}]`;
  }
}

// Add delay between API calls to respect rate limits
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Load existing progress if available
function loadProgress() {
  try {
    if (fs.existsSync(PROGRESS_FILE)) {
      const progressData = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
      console.log(`📂 Found existing progress: ${progressData.summaries?.length || 0} items completed`);
      return progressData.summaries || [];
    }
  } catch {
    console.log('⚠️  Could not load progress file, starting fresh');
  }
  return [];
}

// Save progress incrementally
function saveProgress(summaries, isComplete = false) {
  const progressData = {
    generatedAt: new Date().toISOString(),
    totalItems: summaries.length,
    isComplete: isComplete,
    summaries: summaries
  };
  
  try {
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progressData, null, 2));
    console.log(`💾 Progress saved: ${summaries.length} items completed`);
  } catch (error) {
    console.error('❌ Failed to save progress:', error.message);
  }
}

// Main processing function
async function processSummaries() {
  console.log('Starting content summarization...');
  console.log('Reading regulation content...');
  
  const { navigationItems, htmlContent } = parseRegulationContent();
  
  console.log(`Found ${navigationItems.length} items to summarize`);
  
  // Load existing progress
  const existingSummaries = loadProgress();
  const processedIds = new Set(existingSummaries.map(s => s.id));
  
  // In test mode, limit the items to process
  const itemsToProcess = TEST_MODE ? navigationItems.slice(0, TEST_LIMIT) : navigationItems;
  
  // Filter out already processed items
  const remainingItems = itemsToProcess.filter(item => !processedIds.has(item.id));
  
  if (TEST_MODE) {
    console.log(`🧪 Processing only ${itemsToProcess.length} items for testing`);
  }
  
  console.log(`📊 Already completed: ${existingSummaries.length} items`);
  console.log(`📝 Remaining to process: ${remainingItems.length} items`);
  
  const summaries = [...existingSummaries];
  let processedCount = existingSummaries.length;
  
  for (const item of remainingItems) {
    processedCount++;
    console.log(`Processing ${processedCount}/${navigationItems.length}: ${item.type} - ${item.title.substring(0, 50)}...`);
    
    // Extract the actual content from HTML
    const textContent = extractTextFromHtml(htmlContent, item.id);
    
    // Use title if no content found, or combine both
    const contentToSummarize = textContent ? `${item.title}\n\n${textContent}` : item.title;
    
    // Generate summary using Claude API
    const summary = await summarizeContent(item.title, contentToSummarize, item.type);
    
    summaries.push({
      id: item.id,
      type: item.type,
      level: item.level,
      title: item.title,
      summary: summary,
      hasChildren: item.hasChildren || false
    });
    
    // Save progress every N items
    if (summaries.length % SAVE_PROGRESS_INTERVAL === 0) {
      saveProgress(summaries);
    }
    
    // Add delay between requests to respect rate limits (1 request per second)
    if (processedCount < navigationItems.length) {
      await delay(1000);
    }
  }
  
  // Save final results
  saveProgress(summaries, true);
  
  return summaries;
}

// Function to save results
function saveSummaries(summaries) {
  const outputPath = './content-summaries.json';
  
  const output = {
    generatedAt: new Date().toISOString(),
    totalItems: summaries.length,
    summaries: summaries
  };
  
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`\nSummaries saved to: ${outputPath}`);
  
  // Also create a readable text version
  const textOutputPath = './content-summaries.txt';
  let textOutput = `EU Legislation Content Summaries\n`;
  textOutput += `Generated: ${output.generatedAt}\n`;
  textOutput += `Total Items: ${output.totalItems}\n\n`;
  textOutput += '='.repeat(80) + '\n\n';
  
  summaries.forEach((item, index) => {
    const indent = '  '.repeat(Math.max(0, item.level - 1));
    textOutput += `${index + 1}. ${indent}[${item.type.toUpperCase()}] ${item.title}\n`;
    textOutput += `${indent}   Summary: ${item.summary}\n\n`;
  });
  
  fs.writeFileSync(textOutputPath, textOutput);
  console.log(`Readable summaries saved to: ${textOutputPath}`);
}

// Run the script
async function main() {
  try {
    const summaries = await processSummaries();
    saveSummaries(summaries);
    
    console.log('\n✅ Content summarization completed successfully!');
    console.log(`📊 Generated ${summaries.length} summaries`);
    console.log('📁 Output files:');
    console.log('   - content-summaries.json (structured data)');
    console.log('   - content-summaries.txt (human-readable)');
    console.log('   - content-summaries-progress.json (progress backup)');
    
    // Clean up progress file on successful completion
    try {
      if (fs.existsSync(PROGRESS_FILE)) {
        fs.unlinkSync(PROGRESS_FILE);
        console.log('🧹 Cleaned up progress file');
      }
    } catch {
      console.log('⚠️  Could not clean up progress file (not critical)');
    }
    
  } catch (error) {
    console.error('❌ Error during processing:', error.message);
    console.log('\n💾 Progress has been saved. You can resume by running the script again.');
    console.log(`📂 Progress file: ${PROGRESS_FILE}`);
    process.exit(1);
  }
}

// Handle uncaught errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the script
main();