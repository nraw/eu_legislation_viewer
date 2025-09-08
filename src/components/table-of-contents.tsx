"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, FileText } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

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

interface TableOfContentsProps {
  structure: LegislationStructure;
  selectedArticle: string;
  onArticleSelect: (articleId: string) => void;
}

export function TableOfContents({ structure, selectedArticle, onArticleSelect }: TableOfContentsProps) {
  const [openChapters, setOpenChapters] = useState<Set<string>>(new Set(["chapter-1"]));
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(["section-1-1"]));

  const toggleChapter = (chapterId: string) => {
    const newOpenChapters = new Set(openChapters);
    if (newOpenChapters.has(chapterId)) {
      newOpenChapters.delete(chapterId);
    } else {
      newOpenChapters.add(chapterId);
    }
    setOpenChapters(newOpenChapters);
  };

  const toggleSection = (sectionId: string) => {
    const newOpenSections = new Set(openSections);
    if (newOpenSections.has(sectionId)) {
      newOpenSections.delete(sectionId);
    } else {
      newOpenSections.add(sectionId);
    }
    setOpenSections(newOpenSections);
  };

  return (
    <div className="space-y-2">
      <div className="mb-4">
        <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
          Document
        </h2>
        <p className="text-sm font-medium leading-tight">
          {structure.title}
        </p>
      </div>

      {structure.chapters.map((chapter) => (
        <Collapsible
          key={chapter.id}
          open={openChapters.has(chapter.id)}
          onOpenChange={() => toggleChapter(chapter.id)}
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start h-auto p-2 font-medium text-left hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {openChapters.has(chapter.id) ? (
                <ChevronDown className="h-4 w-4 mr-2 flex-shrink-0" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-2 flex-shrink-0" />
              )}
              <span className="text-sm">{chapter.title}</span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="ml-6 space-y-1">
            {chapter.sections.map((section) => (
              <Collapsible
                key={section.id}
                open={openSections.has(section.id)}
                onOpenChange={() => toggleSection(section.id)}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-auto p-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    {openSections.has(section.id) ? (
                      <ChevronDown className="h-3 w-3 mr-2 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="h-3 w-3 mr-2 flex-shrink-0" />
                    )}
                    <span className="text-xs font-medium">{section.title}</span>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="ml-5 space-y-1">
                  {section.articles.map((article) => (
                    <Button
                      key={article.id}
                      variant="ghost"
                      className={`w-full justify-start h-auto p-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                        selectedArticle === article.id
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-500"
                          : ""
                      }`}
                      onClick={() => onArticleSelect(article.id)}
                    >
                      <FileText className="h-3 w-3 mr-2 flex-shrink-0" />
                      <span className="text-xs">{article.title}</span>
                    </Button>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
}