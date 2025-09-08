"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, FileText, BookOpen, Hash } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { LegislationDocument, DocumentChapter, DocumentSection } from "@/types/legislation";

interface ScrollingTableOfContentsProps {
  document: LegislationDocument;
  activeElementId: string;
  onElementClick: (elementId: string) => void;
}

export function ScrollingTableOfContents({ 
  document, 
  activeElementId, 
  onElementClick 
}: ScrollingTableOfContentsProps) {
  const [openChapters, setOpenChapters] = useState<Set<string>>(new Set(["chapter-1", "preamble"]));
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(["section-1"]));

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

  const handleElementClick = (elementId: string) => {
    onElementClick(elementId);
  };

  const renderTocItem = (id: string, title: string, level: number = 0, icon?: React.ReactNode) => (
    <Button
      key={id}
      variant="ghost"
      className={`w-full justify-start h-auto p-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
        activeElementId === id
          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-500"
          : ""
      }`}
      style={{ paddingLeft: `${12 + level * 16}px` }}
      onClick={() => handleElementClick(id)}
    >
      {icon || <FileText className="h-3 w-3 mr-2 flex-shrink-0" />}
      <span className="text-xs">{title}</span>
    </Button>
  );

  const renderSection = (section: DocumentSection, level: number = 0) => (
    <div key={section.id}>
      <Collapsible
        open={openSections.has(section.id)}
        onOpenChange={() => toggleSection(section.id)}
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className={`w-full justify-start h-auto p-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
              activeElementId === section.id
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-500"
                : ""
            }`}
            style={{ paddingLeft: `${12 + level * 16}px` }}
          >
            {openSections.has(section.id) ? (
              <ChevronDown className="h-3 w-3 mr-2 flex-shrink-0" />
            ) : (
              <ChevronRight className="h-3 w-3 mr-2 flex-shrink-0" />
            )}
            <Hash className="h-3 w-3 mr-2 flex-shrink-0" />
            <span className="text-xs font-medium">{section.title}</span>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          {/* Section itself as clickable */}
          {renderTocItem(section.id, `Go to ${section.title}`, level + 1, <Hash className="h-3 w-3 mr-2 flex-shrink-0" />)}
          
          {/* Subsections */}
          {section.subsections?.map((subsection) => renderSection(subsection, level + 1))}
          
          {/* Articles in section */}
          {section.articles?.map((article) => 
            renderTocItem(article.id, article.title, level + 1, <FileText className="h-3 w-3 mr-2 flex-shrink-0" />)
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );

  const renderChapter = (chapter: DocumentChapter) => (
    <Collapsible
      key={chapter.id}
      open={openChapters.has(chapter.id)}
      onOpenChange={() => toggleChapter(chapter.id)}
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className={`w-full justify-start h-auto p-2 font-medium text-left hover:bg-gray-100 dark:hover:bg-gray-800 ${
            activeElementId === chapter.id
              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-500"
              : ""
          }`}
        >
          {openChapters.has(chapter.id) ? (
            <ChevronDown className="h-4 w-4 mr-2 flex-shrink-0" />
          ) : (
            <ChevronRight className="h-4 w-4 mr-2 flex-shrink-0" />
          )}
          <BookOpen className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="text-sm">{chapter.title}</span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-1">
        {/* Chapter itself as clickable */}
        {renderTocItem(chapter.id, `Go to ${chapter.title}`, 0, <BookOpen className="h-3 w-3 mr-2 flex-shrink-0" />)}
        
        {/* Sections in chapter */}
        {chapter.sections?.map((section) => renderSection(section, 0))}
        
        {/* Direct articles in chapter (no sections) */}
        {chapter.articles?.map((article) => 
          renderTocItem(article.id, article.title, 0, <FileText className="h-3 w-3 mr-2 flex-shrink-0" />)
        )}
      </CollapsibleContent>
    </Collapsible>
  );

  return (
    <div className="space-y-2">
      <div className="mb-4">
        <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
          Navigation
        </h2>
        <p className="text-sm font-medium leading-tight">
          {document.content.title}
        </p>
        <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
          <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
            {document.type}
          </span>
          <span>{document.reference}</span>
        </div>
      </div>

      {/* Preamble */}
      {document.content.preamble && (
        <Collapsible
          open={openChapters.has("preamble")}
          onOpenChange={() => toggleChapter("preamble")}
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={`w-full justify-start h-auto p-2 font-medium text-left hover:bg-gray-100 dark:hover:bg-gray-800 ${
                activeElementId === "preamble"
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-500"
                  : ""
              }`}
            >
              {openChapters.has("preamble") ? (
                <ChevronDown className="h-4 w-4 mr-2 flex-shrink-0" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-2 flex-shrink-0" />
              )}
              <BookOpen className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="text-sm">{document.content.preamble.title}</span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1">
            {/* Preamble itself as clickable */}
            {renderTocItem("preamble", `Go to ${document.content.preamble.title}`, 0, <BookOpen className="h-3 w-3 mr-2 flex-shrink-0" />)}
            
            {/* Whereas clauses */}
            {document.content.preamble.articles?.map((article) => 
              renderTocItem(article.id, article.title, 0, <FileText className="h-3 w-3 mr-2 flex-shrink-0" />)
            )}
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Chapters */}
      {document.content.chapters.map((chapter) => renderChapter(chapter))}

      {/* Annexes */}
      {document.content.annexes?.map((annex) => (
        <Collapsible
          key={annex.id}
          open={openChapters.has(annex.id)}
          onOpenChange={() => toggleChapter(annex.id)}
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={`w-full justify-start h-auto p-2 font-medium text-left hover:bg-gray-100 dark:hover:bg-gray-800 ${
                activeElementId === annex.id
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-500"
                  : ""
              }`}
            >
              {openChapters.has(annex.id) ? (
                <ChevronDown className="h-4 w-4 mr-2 flex-shrink-0" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-2 flex-shrink-0" />
              )}
              <BookOpen className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="text-sm">{annex.title}</span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1">
            {/* Annex itself as clickable */}
            {renderTocItem(annex.id, `Go to ${annex.title}`, 0, <BookOpen className="h-3 w-3 mr-2 flex-shrink-0" />)}
            
            {/* Articles in annex */}
            {annex.articles?.map((article) => 
              renderTocItem(article.id, article.title, 0, <FileText className="h-3 w-3 mr-2 flex-shrink-0" />)
            )}
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
}