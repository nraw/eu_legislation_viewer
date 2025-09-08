import fs from 'fs';

// Script to convert JSON summaries to TypeScript module
function generateSummariesData() {
  const summariesPath = './content-summaries.json';
  const outputPath = './src/data/summaries.ts';
  
  try {
    // Read the JSON summaries file
    if (!fs.existsSync(summariesPath)) {
      console.error('❌ Summaries file not found. Run: node summarize-content.js first');
      process.exit(1);
    }
    
    const summariesData = JSON.parse(fs.readFileSync(summariesPath, 'utf8'));
    const summaries = summariesData.summaries || [];
    
    console.log(`📋 Processing ${summaries.length} summaries...`);
    
    // Create the summaries object
    const summariesObject = {};
    summaries.forEach(item => {
      summariesObject[item.id] = item.summary;
    });
    
    // Generate TypeScript content
    const tsContent = `// Auto-generated summaries data
// This file was generated on: ${new Date().toISOString()}
// Total summaries: ${summaries.length}
// To regenerate: npm run generate-summaries

export interface SummaryItem {
  id: string;
  type: string;
  level: number;
  title: string;
  summary: string;
  hasChildren: boolean;
}

// Summaries generated from Claude API
export const contentSummaries: Record<string, string> = ${JSON.stringify(summariesObject, null, 2)};

// Function to get summary for an item ID
export function getSummary(id: string): string | undefined {
  return contentSummaries[id];
}

// Function to check if summaries are available
export function hasSummaries(): boolean {
  return Object.keys(contentSummaries).length > 0;
}

// Function to get all summary statistics
export function getSummaryStats() {
  const stats = {
    total: Object.keys(contentSummaries).length,
    byType: {} as Record<string, number>
  };
  
  // Count by type (would need full data for this, simplified for now)
  return stats;
}
`;

    // Write the TypeScript file
    fs.writeFileSync(outputPath, tsContent);
    
    console.log(`✅ Generated summaries data file: ${outputPath}`);
    console.log(`📊 Total summaries: ${summaries.length}`);
    console.log(`🔄 Import in React with: import { getSummary } from '@/data/summaries'`);
    
  } catch (error) {
    console.error('❌ Error generating summaries data:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  generateSummariesData();
}

module.exports = { generateSummariesData };