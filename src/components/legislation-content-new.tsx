"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LegislationDocument, DocumentArticle, DocumentChapter, DocumentSection } from "@/types/legislation";

interface LegislationContentProps {
  document: LegislationDocument;
  selectedArticleId: string;
}

export function LegislationContentNew({ document, selectedArticleId }: LegislationContentProps) {
  // Find the selected article and its context
  const findArticleWithContext = (articleId: string) => {
    // Check preamble
    if (document.content.preamble?.articles) {
      const article = document.content.preamble.articles.find(a => a.id === articleId);
      if (article) {
        return {
          article,
          chapter: null,
          section: document.content.preamble,
          path: [`Preamble`]
        };
      }
    }

    // Check chapters
    for (const chapter of document.content.chapters) {
      // Direct articles in chapter
      if (chapter.articles) {
        const article = chapter.articles.find(a => a.id === articleId);
        if (article) {
          return {
            article,
            chapter,
            section: null,
            path: [chapter.title]
          };
        }
      }

      // Articles in sections
      if (chapter.sections) {
        for (const section of chapter.sections) {
          const result = findInSection(section, articleId, [chapter.title]);
          if (result) return result;
        }
      }
    }

    // Check annexes
    if (document.content.annexes) {
      for (const annex of document.content.annexes) {
        if (annex.articles) {
          const article = annex.articles.find(a => a.id === articleId);
          if (article) {
            return {
              article,
              chapter: null,
              section: annex,
              path: [annex.title]
            };
          }
        }
      }
    }

    return null;
  };

  const findInSection = (section: DocumentSection, articleId: string, currentPath: string[]): any => {
    const path = [...currentPath, section.title];
    
    if (section.articles) {
      const article = section.articles.find(a => a.id === articleId);
      if (article) {
        return {
          article,
          chapter: null,
          section,
          path
        };
      }
    }

    if (section.subsections) {
      for (const subsection of section.subsections) {
        const result = findInSection(subsection, articleId, path);
        if (result) return result;
      }
    }

    return null;
  };

  const context = findArticleWithContext(selectedArticleId);
  
  if (!context) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Select an article from the table of contents to view its content.</p>
      </div>
    );
  }

  const { article, section, path } = context;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 space-y-2">
        <div className="font-medium">{document.content.title}</div>
        <div className="flex items-center flex-wrap gap-2">
          {path.map((item: string, index: number) => (
            <div key={index} className="flex items-center">
              {index > 0 && <span className="mx-2">→</span>}
              <Badge variant="secondary" className="text-xs">
                {item}
              </Badge>
            </div>
          ))}
          <span className="mx-2">→</span>
          <Badge variant="default" className="text-xs">
            {article.title}
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            {article.title}
            {article.number && (
              <Badge variant="outline" className="text-xs font-mono">
                #{article.number}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            {article.content && (
              <p className="text-base leading-relaxed mb-4 font-medium">
                {article.content}
              </p>
            )}
            
            {article.paragraphs.map((paragraph: any, index: number) => (
              <div key={paragraph.id} className="mb-4">
                {paragraph.number && (
                  <div className="text-sm font-mono text-gray-500 mb-1">
                    Paragraph {paragraph.number}
                  </div>
                )}
                <p className="text-base leading-relaxed">
                  {paragraph.content}
                </p>
                
                {paragraph.subparagraphs && paragraph.subparagraphs.length > 0 && (
                  <div className="ml-6 mt-3 space-y-2">
                    {paragraph.subparagraphs.map((subpara: any) => (
                      <div key={subpara.id} className="border-l-2 border-gray-200 pl-4">
                        {subpara.number && (
                          <div className="text-sm font-mono text-gray-500 mb-1">
                            ({subpara.number})
                          </div>
                        )}
                        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                          {subpara.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Context: Show other articles in the same section/chapter */}
      {section && section.articles && section.articles.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Other articles in {section.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {section.articles
                .filter((a: any) => a.id !== selectedArticleId)
                .map((otherArticle: any) => (
                  <div
                    key={otherArticle.id}
                    className="p-3 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{otherArticle.title}</h4>
                      {otherArticle.number && (
                        <Badge variant="outline" className="text-xs font-mono">
                          #{otherArticle.number}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {otherArticle.content || otherArticle.paragraphs[0]?.content}
                    </p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Legal Reference */}
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="text-xs text-gray-500 space-y-2">
            <p><strong>Document Reference:</strong> {document.reference}</p>
            <p><strong>Legal Framework:</strong> {document.type}</p>
            <p><strong>Document URL:</strong> 
              <a 
                href={document.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 ml-1"
              >
                View Original
              </a>
            </p>
            <p><strong>Article Path:</strong> {path.join(' > ')} &gt; {article.title}</p>
            <p><strong>Article ID:</strong> {article.id}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}