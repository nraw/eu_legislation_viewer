"use client";

import { regulationHtmlContent } from "@/data/regulation-content-final";

interface OriginalDocumentViewProps {
  // This component displays the original HTML content
}

export function OriginalDocumentView({}: OriginalDocumentViewProps) {
  return (
    <div className="original-document-container">
      <style jsx>{`
        .original-document-container {
          font-family: "Georgia", "Times New Roman", Times, serif;
          line-height: 1.7;
          color: #2d3748;
          background: #fff;
          padding: 3rem 2rem;
          max-width: none;
        }
        
        /* Chapter Headings */
        .original-document-container .ManualHeading1 {
          font-weight: 700;
          font-size: 1.5em;
          color: #1a202c;
          margin: 3rem 0 1.5rem 0;
          padding: 1rem 0 0.5rem 0;
          border-bottom: 3px solid #3182ce;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        /* Section Headings */
        .original-document-container .ManualHeading2 {
          font-weight: 600;
          font-size: 1.25em;
          color: #2d3748;
          margin: 2rem 0 1rem 0;
          padding: 0.75rem 0;
          border-left: 4px solid #4299e1;
          padding-left: 1rem;
          background: #f7fafc;
        }
        
        /* Sub-section Headings */
        .original-document-container .ManualHeading3 {
          font-weight: 600;
          font-size: 1.1em;
          color: #4a5568;
          margin: 1.5rem 0 0.75rem 0;
          padding: 0.5rem 0;
          border-left: 2px solid #a0aec0;
          padding-left: 0.75rem;
        }
        
        /* Articles */
        .original-document-container .li.ManualHeading3 {
          font-weight: 700;
          font-size: 1.15em;
          color: #2b6cb0;
          margin: 2rem 0 1rem 0;
          padding: 1rem;
          background: #ebf8ff;
          border: 1px solid #bee3f8;
          border-radius: 0.5rem;
        }
        
        /* Normal paragraphs */
        .original-document-container .Normal {
          text-align: justify;
          margin: 1rem 0;
          line-height: 1.8;
          font-size: 1rem;
          color: #4a5568;
        }
        
        /* Points and numbered items */
        .original-document-container .Point0,
        .original-document-container .Point1,
        .original-document-container .Point2 {
          margin: 0.75rem 0 0.75rem 1.5rem;
          line-height: 1.7;
          position: relative;
        }
        
        /* Number styling */
        .original-document-container .num {
          font-weight: 700;
          color: #2b6cb0;
          margin-right: 0.75rem;
          min-width: 2rem;
          display: inline-block;
        }
        
        /* Special formatting for formulas and legal text */
        .original-document-container .Formuledadoption {
          font-weight: 700;
          text-align: center;
          font-size: 1.1em;
          margin: 2rem 0;
          padding: 1.5rem;
          background: #f0fff4;
          border: 2px solid #48bb78;
          border-radius: 0.5rem;
          color: #22543d;
        }
        
        /* Footnotes */
        .original-document-container .FootnoteReference0 {
          font-size: 0.75em;
          vertical-align: super;
          color: #3182ce;
          font-weight: 600;
        }
        
        /* Lists and indentation */
        .original-document-container .li {
          margin: 0.5rem 0;
        }
        
        /* Improve readability with better spacing */
        .original-document-container p {
          margin: 0.75rem 0;
        }
        
        /* Headers and document info */
        .original-document-container .Logo {
          text-align: center;
          margin-bottom: 2rem;
          font-weight: 600;
        }
        
        .original-document-container .Emission,
        .original-document-container .Rfrenceinstitutionnelle,
        .original-document-container .Rfrenceinterinstitutionnelle {
          text-align: center;
          margin: 0.5rem 0;
          color: #718096;
          font-size: 0.95em;
        }
        
        .original-document-container .Rfrenceinstitutionnelle {
          font-weight: 700;
          color: #2d3748;
        }
        
        /* Responsive improvements */
        @media (max-width: 768px) {
          .original-document-container {
            padding: 1.5rem 1rem;
            font-size: 0.95em;
          }
          
          .original-document-container .ManualHeading1 {
            font-size: 1.3em;
          }
          
          .original-document-container .ManualHeading2 {
            font-size: 1.15em;
          }
        }
        
        /* Dark mode improvements */
        @media (prefers-color-scheme: dark) {
          .original-document-container {
            background: #1a202c;
            color: #e2e8f0;
          }
          
          .original-document-container .ManualHeading1 {
            color: #f7fafc;
            border-bottom-color: #4299e1;
          }
          
          .original-document-container .ManualHeading2 {
            color: #e2e8f0;
            background: #2d3748;
            border-left-color: #63b3ed;
          }
          
          .original-document-container .ManualHeading3 {
            color: #cbd5e0;
            border-left-color: #718096;
          }
          
          .original-document-container .li.ManualHeading3 {
            background: #2a4365;
            border-color: #4299e1;
            color: #90cdf4;
          }
          
          .original-document-container .Normal {
            color: #cbd5e0;
          }
          
          .original-document-container .Formuledadoption {
            background: #22543d;
            border-color: #38a169;
            color: #c6f6d5;
          }
          
          .original-document-container .num {
            color: #90cdf4;
          }
          
          .original-document-container .FootnoteReference0 {
            color: #90cdf4;
          }
        }
      `}</style>
      
      <div 
        dangerouslySetInnerHTML={{ __html: regulationHtmlContent }}
        className="prose prose-lg max-w-none"
      />
    </div>
  );
}