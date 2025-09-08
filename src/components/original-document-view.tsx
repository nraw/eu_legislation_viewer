"use client";

import { regulationHtmlContent } from "@/data/regulation-content";

export function OriginalDocumentView() {
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen overflow-hidden">
      <style dangerouslySetInnerHTML={{
        __html: `
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif !important;
            line-height: 1.6 !important;
          }
          
          /* Reset default styling */
          * {
            box-sizing: border-box;
          }
          
          /* Prevent horizontal overflow */
          * {
            max-width: 100% !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
          }
          
          /* Long text and URLs */
          span, p, div {
            hyphens: auto !important;
            word-break: break-word !important;
          }
          
          /* Chapter Headings */
          .ManualHeading1 {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif !important;
            font-weight: 600 !important;
            font-size: 1.5rem !important;
            color: #1f2937 !important;
            margin: 2.5rem 0 1.5rem 0 !important;
            padding: 1rem 0 0.75rem 0 !important;
            border-bottom: 2px solid #e5e7eb !important;
            text-transform: uppercase !important;
            letter-spacing: 0.5px !important;
          }
          
          /* Section Headings */
          .ManualHeading2 {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif !important;
            font-weight: 600 !important;
            font-size: 1.25rem !important;
            color: #374151 !important;
            margin: 2rem 0 1rem 0 !important;
            padding: 0.75rem 0 0.75rem 1rem !important;
            border-left: 3px solid #9ca3af !important;
            background: #f9fafb !important;
          }
          
          /* Sub-section Headings / Articles */
          .ManualHeading3 {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif !important;
            font-weight: 600 !important;
            font-size: 1.125rem !important;
            color: #4b5563 !important;
            margin: 1.5rem 0 0.75rem 0 !important;
            padding: 0.5rem 0 0.5rem 0.75rem !important;
            border-left: 2px solid #d1d5db !important;
            background: #fafafa !important;
          }
          
          /* Articles in list format */
          .li.ManualHeading3 {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif !important;
            font-weight: 600 !important;
            font-size: 1.1rem !important;
            color: #374151 !important;
            margin: 1.5rem 0 0.75rem 0 !important;
            padding: 1rem !important;
            background: #f3f4f6 !important;
            border: 1px solid #e5e7eb !important;
            border-radius: 4px !important;
          }
          
          /* Normal paragraphs */
          .Normal {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif !important;
            font-size: 1rem !important;
            line-height: 1.7 !important;
            color: #111827 !important;
            margin: 1.25rem 0 !important;
            text-align: justify !important;
            text-justify: inter-word !important;
          }
          
          /* Numbered paragraphs */
          .ManualNumPar1 {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif !important;
            font-weight: 600 !important;
            font-size: 1rem !important;
            color: #111827 !important;
            margin: 1.5rem 0 1rem 0 !important;
            padding: 0.75rem 0 !important;
            line-height: 1.6 !important;
          }
          
          /* Points and numbered items */
          .Point0,
          .Point1,
          .Point2 {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif !important;
            font-size: 0.95rem !important;
            line-height: 1.6 !important;
            color: #111827 !important;
            margin: 0.75rem 0 0.75rem 2rem !important;
            padding: 0.5rem 0 !important;
            position: relative !important;
            text-align: justify !important;
          }
          
          /* Number styling */
          .num {
            font-weight: 700 !important;
            color: #6b7280 !important;
            margin-right: 0.75rem !important;
            min-width: 2.5rem !important;
            display: inline-block !important;
            font-size: 0.95rem !important;
          }
          
          /* Special formatting for formulas and legal text */
          .Formuledadoption {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif !important;
            font-weight: 700 !important;
            text-align: center !important;
            font-size: 1.125rem !important;
            margin: 2.5rem 0 !important;
            padding: 2rem !important;
            background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%) !important;
            border: 2px solid #22c55e !important;
            border-radius: 12px !important;
            color: #15803d !important;
            box-shadow: 0 4px 12px rgba(34, 197, 94, 0.15) !important;
          }
          
          /* Footnotes */
          .FootnoteReference0 {
            font-size: 0.75em !important;
            vertical-align: super !important;
            color: #2563eb !important;
            font-weight: 600 !important;
            margin-left: 2px !important;
          }
          
          .FootnoteReference0 a {
            color: #2563eb !important;
            text-decoration: none !important;
          }
          
          .FootnoteReference0 a:hover {
            text-decoration: underline !important;
          }
          
          /* Lists and indentation */
          .li {
            margin: 0.75rem 0 !important;
          }
          
          /* Headers and document info */
          .Logo {
            text-align: center !important;
            margin-bottom: 2rem !important;
            font-weight: 700 !important;
            font-size: 1.25rem !important;
            color: #1e293b !important;
          }
          
          .Emission,
          .Rfrenceinstitutionnelle,
          .Rfrenceinterinstitutionnelle {
            text-align: center !important;
            margin: 1rem 0 !important;
            color: #64748b !important;
            font-size: 0.9rem !important;
            font-style: italic !important;
          }
          
          .Rfrenceinstitutionnelle {
            font-weight: 700 !important;
            color: #1e293b !important;
            font-style: normal !important;
          }
          
          /* Responsive design */
          @media (max-width: 768px) {
            .ManualHeading1 {
              font-size: 1.5rem !important;
              padding: 1rem 0.75rem !important;
            }
            
            .ManualHeading2 {
              font-size: 1.25rem !important;
              padding: 0.75rem 1rem !important;
            }
            
            .ManualHeading3 {
              font-size: 1.125rem !important;
              padding: 0.5rem 0.75rem !important;
            }
            
            .Point0,
            .Point1,
            .Point2 {
              margin-left: 1rem !important;
              font-size: 0.9rem !important;
            }
          }
          
          /* Dark mode improvements */
          @media (prefers-color-scheme: dark) {
            .ManualHeading1 {
              color: #ffffff !important;
              border-bottom-color: #6b7280 !important;
            }
            
            .ManualHeading2 {
              color: #f9fafb !important;
              background: #374151 !important;
              border-left-color: #9ca3af !important;
            }
            
            .ManualHeading3 {
              color: #f3f4f6 !important;
              background: #1f2937 !important;
              border-left-color: #6b7280 !important;
            }
            
            .li.ManualHeading3 {
              background: #374151 !important;
              border-color: #6b7280 !important;
              color: #f9fafb !important;
            }
            
            .Normal,
            .Point0,
            .Point1,
            .Point2 {
              color: #e5e7eb !important;
            }
            
            .ManualNumPar1 {
              color: #f3f4f6 !important;
            }
            
            .Formuledadoption {
              background: #374151 !important;
              border-color: #6b7280 !important;
              color: #f3f4f6 !important;
            }
            
            .num {
              color: #d1d5db !important;
            }
            
            .FootnoteReference0,
            .FootnoteReference0 a {
              color: #93c5fd !important;
            }
          }
          
          /* Alternative dark mode selectors */
          :root.dark .ManualHeading1,
          html.dark .ManualHeading1 {
            color: #ffffff !important;
            border-bottom-color: #6b7280 !important;
          }
          
          :root.dark .ManualHeading2,
          html.dark .ManualHeading2 {
            color: #f9fafb !important;
            background: #374151 !important;
            border-left-color: #9ca3af !important;
          }
          
          :root.dark .ManualHeading3,
          html.dark .ManualHeading3 {
            color: #f3f4f6 !important;
            background: #1f2937 !important;
            border-left-color: #6b7280 !important;
          }
          
          :root.dark .li.ManualHeading3,
          html.dark .li.ManualHeading3 {
            background: #374151 !important;
            border-color: #6b7280 !important;
            color: #f9fafb !important;
          }
          
          :root.dark .Normal,
          :root.dark .Point0,
          :root.dark .Point1,
          :root.dark .Point2,
          html.dark .Normal,
          html.dark .Point0,
          html.dark .Point1,
          html.dark .Point2 {
            color: #e5e7eb !important;
          }
          
          :root.dark .ManualNumPar1,
          html.dark .ManualNumPar1 {
            color: #f3f4f6 !important;
          }
          
          :root.dark .Formuledadoption,
          html.dark .Formuledadoption {
            background: #374151 !important;
            border-color: #6b7280 !important;
            color: #f3f4f6 !important;
          }
          
          :root.dark .num,
          html.dark .num {
            color: #d1d5db !important;
          }
          
          :root.dark .FootnoteReference0,
          :root.dark .FootnoteReference0 a,
          html.dark .FootnoteReference0,
          html.dark .FootnoteReference0 a {
            color: #93c5fd !important;
          }
        `
      }} />
      
      <div 
        dangerouslySetInnerHTML={{ __html: regulationHtmlContent }}
        className="prose prose-lg max-w-none p-4 md:p-6 lg:p-8 overflow-x-auto break-words"
        style={{ 
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
          fontSize: '16px',
          lineHeight: '1.6',
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          hyphens: 'auto'
        }}
      />
    </div>
  );
}