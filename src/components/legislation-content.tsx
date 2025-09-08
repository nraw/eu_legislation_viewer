"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Article {
  id: string;
  title: string;
  content: string;
}

interface Section {
  id: string;
  title: string;
  articles: Article[];
}

interface Chapter {
  id: string;
  title: string;
  sections: Section[];
}

interface LegislationStructure {
  title: string;
  chapters: Chapter[];
}

interface LegislationContentProps {
  structure: LegislationStructure;
  selectedArticle: string;
}

export function LegislationContent({ structure, selectedArticle }: LegislationContentProps) {
  // Find the selected article
  // const findArticle = (articleId: string): Article | null => {
  //   for (const chapter of structure.chapters) {
  //     for (const section of chapter.sections) {
  //       const article = section.articles.find(a => a.id === articleId);
  //       if (article) return article;
  //     }
  //   }
  //   return null;
  // };

  // Find the context (chapter and section) for the selected article
  const findArticleContext = (articleId: string) => {
    for (const chapter of structure.chapters) {
      for (const section of chapter.sections) {
        const article = section.articles.find(a => a.id === articleId);
        if (article) {
          return { chapter, section, article };
        }
      }
    }
    return null;
  };

  const context = findArticleContext(selectedArticle);
  
  if (!context) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Select an article from the table of contents to view its content.</p>
      </div>
    );
  }

  const { chapter, section, article } = context;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 space-y-1">
        <div className="font-medium">{structure.title}</div>
        <div className="flex items-center space-x-2">
          <span>{chapter.title}</span>
          <span>→</span>
          <span>{section.title}</span>
          <span>→</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">{article.title}</span>
        </div>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{article.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-base leading-relaxed">{article.content}</p>
          </div>
        </CardContent>
      </Card>

      {/* Context: Show other articles in the same section */}
      {section.articles.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Other articles in {section.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {section.articles
                .filter(a => a.id !== selectedArticle)
                .map((otherArticle) => (
                  <div
                    key={otherArticle.id}
                    className="p-3 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                  >
                    <h4 className="font-medium text-sm mb-1">{otherArticle.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {otherArticle.content}
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
            <p><strong>Document Reference:</strong> CELEX:52022PC0209</p>
            <p><strong>Legal Framework:</strong> EU Regulation Proposal</p>
            <p><strong>Article Path:</strong> {chapter.title} &gt; {section.title} &gt; {article.title}</p>
            <p><strong>Article ID:</strong> {article.id}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}