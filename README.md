# EU Legislation Viewer

A modern web application for browsing and exploring European Union legislation documents with an interactive table of contents and responsive design.

## Features

### 🔍 Interactive Navigation
- **Collapsible Table of Contents**: Hierarchical navigation with expandable sections for chapters, sections, articles, paragraphs, and points
- **Smart Display Controls**: Dropdown menu to show different levels of detail (sections only, articles, paragraphs, or full content)
- **Active Element Highlighting**: Visual indication of the current section being viewed
- **Smooth Scrolling**: Seamless navigation between document sections

### 📱 Responsive Design
- **Mobile-First Approach**: Optimized for mobile devices with collapsible sidebar
- **Desktop Layout**: Split-view with table of contents on the left and content on the right
- **Dark Mode Support**: Automatic theme switching based on system preferences

### 📄 Document Support
Currently supports the **EU Child Sexual Abuse Regulation** (COM(2022) 209) with the framework to easily add more EU legislation documents:
- General Data Protection Regulation (GDPR)
- Digital Services Act (DSA)
- Artificial Intelligence Act
- And more...

### 🎨 Modern UI/UX
- **shadcn/ui Components**: Professional design system with consistent styling
- **Tailwind CSS**: Responsive design with modern aesthetics
- **Lucide Icons**: Consistent iconography throughout the interface
- **Smooth Animations**: Subtle transitions and hover effects

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Parsing**: Custom HTML parser for EUR-Lex documents

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd legislation-viewer
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or  
pnpm install
# or
bun install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
legislation-viewer/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Main application page
│   ├── components/            # React components
│   │   ├── ui/                # shadcn/ui components
│   │   ├── collapsible-toc.tsx    # Main table of contents
│   │   ├── document-selector.tsx  # Document selection interface
│   │   └── original-document-view.tsx  # Document content viewer
│   ├── data/                  # Parsed legislation data
│   │   └── regulation-content.ts    # Structured content and navigation
│   ├── lib/                   # Utility libraries
│   │   └── document-service.ts      # Document management service
│   └── types/                 # TypeScript type definitions
│       └── legislation.ts           # Type definitions for legislation data
├── parse-regulation.js        # HTML parsing script
├── csa-regulation-full.html   # Source HTML document
└── package.json
```

## Adding New Documents

To add a new EU legislation document:

1. **Download HTML**: Get the full HTML from EUR-Lex
2. **Adapt Parser**: Modify `parse-regulation.js` to handle the new document structure
3. **Update Service**: Add the document to `DocumentService.getAvailableDocuments()`
4. **Generate Data**: Run the parser to generate structured content
5. **Test Navigation**: Verify the table of contents and content display

## Document Parser

The custom parser (`parse-regulation.js`) extracts structured content from EUR-Lex HTML:

### Features
- **Hierarchical Structure**: Identifies chapters, sections, articles, paragraphs, and points
- **Title Combination**: Merges numbered elements with their descriptive titles
- **Duplicate Prevention**: Advanced filtering to avoid content duplication
- **ID Generation**: Creates unique identifiers for navigation
- **HTML Preservation**: Maintains original formatting and styling

### Usage
```bash
node parse-regulation.js
```

This generates `src/data/regulation-content.ts` with:
- Navigation structure for the table of contents
- Complete HTML content for document display
- TypeScript interfaces for type safety

## Key Components

### CollapsibleToc
The main navigation component featuring:
- Hierarchical collapsible sections
- Smart expand/collapse controls
- Active element tracking
- Mobile-responsive design
- Icon-based visual hierarchy

### OriginalDocumentView
Displays the parsed document with:
- Custom CSS styling for legal document formatting
- Dark mode support
- Responsive typography
- Preservation of original document structure

### DocumentService
Manages document loading and processing:
- Available document registry
- Content transformation
- Type-safe interfaces

## Styling System

### CSS Classes
The parser preserves original EUR-Lex CSS classes and adds custom styling:
- `ManualHeading1`: Chapter headings
- `ManualHeading2`: Section headings  
- `ManualHeading3`: Article headings
- `ManualNumPar1`: Numbered paragraphs
- `Point0`, `Point1`, `Point2`: Nested points
- `Normal`: Regular paragraph text

### Responsive Design
- Mobile-first approach with collapsible sidebar
- Breakpoint-aware typography scaling
- Touch-friendly interface elements

## Development

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Consistent component patterns
- Comprehensive error handling

### Component Architecture
- Functional components with hooks
- Props-based configuration
- Separation of concerns
- Reusable UI components

### State Management
- React useState for component state
- Context-free architecture
- Props drilling for simplicity

## Performance Optimizations

- **Code Splitting**: Next.js automatic optimization
- **Tree Shaking**: Dead code elimination
- **Image Optimization**: Next.js image components
- **Static Generation**: Pre-built pages where possible

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Responsive design for all screen sizes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

[Add your license information here]

## Acknowledgments

- **EUR-Lex**: European Union law database
- **Next.js Team**: React framework
- **shadcn**: UI component library
- **Tailwind CSS**: Utility-first CSS framework

---

Built with ❤️ for exploring EU legislation