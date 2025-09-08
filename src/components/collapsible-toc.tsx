"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { regulationHierarchicalStructure } from "@/data/regulation-content-final";
import { ChevronDown, ChevronRight, FileText, BookOpen, Hash, List } from "lucide-react";

interface CollapsibleTocProps {
  activeElementId: string;
  onElementClick: (elementId: string) => void;
}

export function CollapsibleToc({ 
  activeElementId, 
  onElementClick 
}: CollapsibleTocProps) {
  const [openChapters, setOpenChapters] = useState<Set<string>>(new Set(['chapter-0', 'chapter-1']));
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());

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

  const getIcon = (type: string) => {
    switch (type) {
      case 'chapter':
        return <BookOpen className="h-4 w-4 mr-2 flex-shrink-0" />;
      case 'article':
        return <FileText className="h-3 w-3 mr-2 flex-shrink-0" />;
      case 'section':
        return <Hash className="h-3 w-3 mr-2 flex-shrink-0" />;
      default:
        return <FileText className="h-3 w-3 mr-2 flex-shrink-0" />;
    }
  };

  const renderTocItem = (id: string, title: string, type: string, level: number = 0) => (
    <Button
      key={id}
      variant="ghost"
      className={`w-full justify-start h-auto p-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
        activeElementId === id
          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-500"
          : ""
      }`}
      style={{ paddingLeft: `${12 + level * 16}px` }}
      onClick={() => onElementClick(id)}
    >
      {getIcon(type)}
      <div className="flex-1 min-w-0">
        <span className="text-xs truncate">{title}</span>
        {type && (
          <Badge variant="secondary" className="ml-2 text-[10px] px-1 py-0">
            {type}
          </Badge>
        )}
      </div>
    </Button>
  );

  const renderSection = (section: any, chapterLevel: number) => (
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
            style={{ paddingLeft: `${12 + chapterLevel * 16}px` }}
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
          {renderTocItem(section.id, `Go to ${section.title}`, section.type, chapterLevel + 1)}
          
          {/* Articles in section */}
          {section.children?.map((article: any) => 
            renderTocItem(article.id, article.title, article.type, chapterLevel + 1)
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );

  const renderChapter = (chapter: any) => (
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
        {renderTocItem(chapter.id, `Go to ${chapter.title}`, chapter.type, 0)}
        
        {/* Sections and articles in chapter */}
        {chapter.children?.map((child: any) => 
          child.type === 'section' 
            ? renderSection(child, 0)
            : renderTocItem(child.id, child.title, child.type, 0)
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
          EU Child Sexual Abuse Regulation
        </p>
        <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
          <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
            EU Regulation
          </span>
          <span>COM(2022) 209</span>
        </div>
      </div>

      {/* Chapters */}
      <div className="space-y-1">
        {regulationHierarchicalStructure.map((chapter: any) => renderChapter(chapter))}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex items-center gap-2">
            <BookOpen className="h-3 w-3" />
            <span>Chapter</span>
          </div>
          <div className="flex items-center gap-2">
            <Hash className="h-3 w-3" />
            <span>Section</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-3 w-3" />
            <span>Article</span>
          </div>
        </div>
      </div>
    </div>
  );
}