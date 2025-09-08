"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { regulationHierarchicalStructure } from "@/data/regulation-content";
import { getSummary, hasSummaries } from "@/data/summaries";
import { ChevronDown, ChevronRight, FileText, BookOpen, Hash, List, Dot, Sparkles } from "lucide-react";

interface CollapsibleTocProps {
  activeElementId: string;
  onElementClick: (elementId: string) => void;
  onBackToHome: () => void;
}

export function CollapsibleToc({ 
  activeElementId, 
  onElementClick,
  onBackToHome
}: CollapsibleTocProps) {
  const [openChapters, setOpenChapters] = useState<Set<string>>(new Set(['chapter-0', 'chapter-1']));
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  const [openArticles, setOpenArticles] = useState<Set<string>>(new Set());
  const [openParagraphs, setOpenParagraphs] = useState<Set<string>>(new Set());

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

  const toggleArticle = (articleId: string) => {
    const newOpenArticles = new Set(openArticles);
    if (newOpenArticles.has(articleId)) {
      newOpenArticles.delete(articleId);
    } else {
      newOpenArticles.add(articleId);
    }
    setOpenArticles(newOpenArticles);
  };

  const toggleParagraph = (paragraphId: string) => {
    const newOpenParagraphs = new Set(openParagraphs);
    if (newOpenParagraphs.has(paragraphId)) {
      newOpenParagraphs.delete(paragraphId);
    } else {
      newOpenParagraphs.add(paragraphId);
    }
    setOpenParagraphs(newOpenParagraphs);
  };

  const collapseAll = () => {
    setOpenChapters(new Set());
    setOpenSections(new Set());
    setOpenArticles(new Set());
    setOpenParagraphs(new Set());
  };

  const showAll = () => {
    const allChapterIds = regulationHierarchicalStructure.map(chapter => chapter.id);
    const allSectionIds = regulationHierarchicalStructure
      .flatMap(chapter => chapter.children?.filter(child => child.type === 'section').map(section => section.id) || []);
    const allArticleIds = regulationHierarchicalStructure
      .flatMap(chapter => [
        ...(chapter.children?.filter(child => child.type === 'article').map(article => article.id) || []),
        ...(chapter.children?.filter(child => child.type === 'section').flatMap(section => 
          section.children?.filter(child => child.type === 'article').map(article => article.id) || []
        ) || [])
      ]);
    const allParagraphIds = regulationHierarchicalStructure
      .flatMap(chapter => [
        ...(chapter.children?.filter(child => child.type === 'article').flatMap(article =>
          article.children?.filter(child => child.type === 'paragraph').map(paragraph => paragraph.id) || []
        ) || []),
        ...(chapter.children?.filter(child => child.type === 'section').flatMap(section =>
          section.children?.filter(child => child.type === 'article').flatMap(article =>
            article.children?.filter(child => child.type === 'paragraph').map(paragraph => paragraph.id) || []
          ) || []
        ) || [])
      ]);
    
    setOpenChapters(new Set(allChapterIds));
    setOpenSections(new Set(allSectionIds));
    setOpenArticles(new Set(allArticleIds));
    setOpenParagraphs(new Set(allParagraphIds));
  };

  const showUpToLevel = (level: 'chapters' | 'sections' | 'articles' | 'paragraphs' | 'points') => {
    const allChapterIds = regulationHierarchicalStructure.map(chapter => chapter.id);
    const allSectionIds = regulationHierarchicalStructure
      .flatMap(chapter => chapter.children?.filter(child => child.type === 'section').map(section => section.id) || []);
    const allArticleIds = regulationHierarchicalStructure
      .flatMap(chapter => [
        ...(chapter.children?.filter(child => child.type === 'article').map(article => article.id) || []),
        ...(chapter.children?.filter(child => child.type === 'section').flatMap(section => 
          section.children?.filter(child => child.type === 'article').map(article => article.id) || []
        ) || [])
      ]);
    const allParagraphIds = regulationHierarchicalStructure
      .flatMap(chapter => [
        ...(chapter.children?.filter(child => child.type === 'article').flatMap(article =>
          article.children?.filter(child => child.type === 'paragraph').map(paragraph => paragraph.id) || []
        ) || []),
        ...(chapter.children?.filter(child => child.type === 'section').flatMap(section =>
          section.children?.filter(child => child.type === 'article').flatMap(article =>
            article.children?.filter(child => child.type === 'paragraph').map(paragraph => paragraph.id) || []
          ) || []
        ) || [])
      ]);
    
    if (level === 'chapters') {
      // Show only chapters (same as collapse all - just close everything)
      setOpenChapters(new Set());
      setOpenSections(new Set());
      setOpenArticles(new Set());
      setOpenParagraphs(new Set());
    } else if (level === 'sections') {
      setOpenChapters(new Set(allChapterIds));
      setOpenSections(new Set());
      setOpenArticles(new Set());
      setOpenParagraphs(new Set());
    } else if (level === 'articles') {
      setOpenChapters(new Set(allChapterIds));
      setOpenSections(new Set(allSectionIds));
      setOpenArticles(new Set());
      setOpenParagraphs(new Set());
    } else if (level === 'paragraphs') {
      setOpenChapters(new Set(allChapterIds));
      setOpenSections(new Set(allSectionIds));
      setOpenArticles(new Set(allArticleIds));
      setOpenParagraphs(new Set());
    } else if (level === 'points') {
      setOpenChapters(new Set(allChapterIds));
      setOpenSections(new Set(allSectionIds));
      setOpenArticles(new Set(allArticleIds));
      setOpenParagraphs(new Set(allParagraphIds));
    }
  };

  const handleSectionClick = (sectionId: string) => {
    // Open the section if it's not already open
    if (!openSections.has(sectionId)) {
      const newOpenSections = new Set(openSections);
      newOpenSections.add(sectionId);
      setOpenSections(newOpenSections);
    }
    // Navigate to the section
    onElementClick(sectionId);
  };

  const handleChapterClick = (chapterId: string) => {
    // Open the chapter if it's not already open
    if (!openChapters.has(chapterId)) {
      const newOpenChapters = new Set(openChapters);
      newOpenChapters.add(chapterId);
      setOpenChapters(newOpenChapters);
    }
    // Navigate to the chapter
    onElementClick(chapterId);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'chapter':
        return <BookOpen className="h-4 w-4 mr-2 flex-shrink-0" />;
      case 'article':
        return <FileText className="h-3 w-3 mr-2 flex-shrink-0" />;
      case 'section':
        return <Hash className="h-3 w-3 mr-2 flex-shrink-0" />;
      case 'paragraph':
        return <List className="h-2 w-2 mr-2 flex-shrink-0" />;
      case 'point':
        return <Dot className="h-2 w-2 mr-2 flex-shrink-0" />;
      default:
        return <FileText className="h-3 w-3 mr-2 flex-shrink-0" />;
    }
  };

  const renderTocItem = (id: string, title: string, type: string, level: number = 0) => {
    const summary = getSummary(id);
    
    return (
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
        <span className="w-3 h-3 flex items-center justify-center mr-2 flex-shrink-0 text-gray-400 text-xs">-</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-base truncate">{title}</span>
            {type && (
              <Badge variant="secondary" className="ml-1 text-sm px-1 py-0 flex-shrink-0">
                {type}
              </Badge>
            )}
          </div>
          {summary && (
            <div className="flex items-start gap-1 text-sm text-gray-500 dark:text-gray-400 leading-relaxed pr-1">
              <Sparkles className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5 opacity-60" />
              <span>{summary}</span>
            </div>
          )}
        </div>
      </Button>
    );
  };

  const renderParagraph = (paragraph: any, level: number) => {
    const summary = getSummary(paragraph.id);
    
    if (paragraph.children && paragraph.children.length > 0) {
      return (
        <div key={paragraph.id}>
          <Collapsible
            open={openParagraphs.has(paragraph.id)}
            onOpenChange={() => toggleParagraph(paragraph.id)}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className={`w-full justify-start h-auto p-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                  activeElementId === paragraph.id
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-500"
                    : ""
                }`}
                style={{ paddingLeft: `${12 + level * 16}px` }}
                onClick={() => onElementClick(paragraph.id)}
              >
                <List className="h-2 w-2 mr-2 flex-shrink-0" />
                {openParagraphs.has(paragraph.id) ? (
                  <ChevronDown className="h-2 w-2 mr-2 flex-shrink-0" />
                ) : (
                  <ChevronRight className="h-2 w-2 mr-2 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-base font-medium truncate">{paragraph.title}</span>
                  </div>
                  {summary && (
                    <div className="flex items-start gap-1 text-sm text-gray-500 dark:text-gray-400 leading-relaxed mt-1 pr-1">
                      <Sparkles className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5 opacity-60" />
                      <span>{summary}</span>
                    </div>
                  )}
                </div>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {/* Points in paragraph */}
              {paragraph.children?.map((point: any) => 
                renderTocItem(point.id, point.title, point.type, level + 1)
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>
      );
    } else {
      return renderTocItem(paragraph.id, paragraph.title, paragraph.type, level);
    }
  };

  const renderArticle = (article: any, level: number) => {
    const summary = getSummary(article.id);
    
    if (article.children && article.children.length > 0) {
      return (
        <div key={article.id}>
          <Collapsible
            open={openArticles.has(article.id)}
            onOpenChange={() => toggleArticle(article.id)}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className={`w-full justify-start h-auto p-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                  activeElementId === article.id
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-500"
                    : ""
                }`}
                style={{ paddingLeft: `${12 + level * 16}px` }}
                onClick={() => onElementClick(article.id)}
              >
                <FileText className="h-3 w-3 mr-2 flex-shrink-0" />
                {openArticles.has(article.id) ? (
                  <ChevronDown className="h-3 w-3 mr-2 flex-shrink-0" />
                ) : (
                  <ChevronRight className="h-3 w-3 mr-2 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-base font-medium truncate">{article.title}</span>
                  </div>
                  {summary && (
                    <div className="flex items-start gap-1 text-sm text-gray-500 dark:text-gray-400 leading-relaxed mt-1 pr-1">
                      <Sparkles className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5 opacity-60" />
                      <span>{summary}</span>
                    </div>
                  )}
                </div>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {/* Paragraphs and points in article */}
              {article.children?.map((child: any) => 
                child.type === 'paragraph' 
                  ? renderParagraph(child, level + 1)
                  : renderTocItem(child.id, child.title, child.type, level + 1)
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>
      );
    } else {
      return renderTocItem(article.id, article.title, article.type, level);
    }
  };

  const renderSection = (section: any, chapterLevel: number) => {
    const summary = getSummary(section.id);
    
    return (
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
              onClick={() => handleSectionClick(section.id)}
            >
              <Hash className="h-3 w-3 mr-2 flex-shrink-0" />
              {openSections.has(section.id) ? (
                <ChevronDown className="h-3 w-3 mr-2 flex-shrink-0" />
              ) : (
                <ChevronRight className="h-3 w-3 mr-2 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-base font-medium truncate">{section.title}</span>
                </div>
                {summary && (
                  <div className="flex items-start gap-1 text-sm text-gray-500 dark:text-gray-400 leading-relaxed mt-1 pr-1">
                    <Sparkles className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5 opacity-60" />
                    <span>{summary}</span>
                  </div>
                )}
              </div>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            {/* Articles in section */}
            {section.children?.map((article: any) => 
              renderArticle(article, chapterLevel + 1)
            )}
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  };

  const renderChapter = (chapter: any) => {
    const summary = getSummary(chapter.id);
    
    return (
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
            onClick={() => handleChapterClick(chapter.id)}
          >
            <BookOpen className="h-4 w-4 mr-2 flex-shrink-0" />
            {openChapters.has(chapter.id) ? (
              <ChevronDown className="h-4 w-4 mr-2 flex-shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 mr-2 flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-lg truncate">{chapter.title}</span>
              </div>
              {summary && (
                <div className="flex items-start gap-1 text-base text-gray-500 dark:text-gray-400 leading-relaxed mt-1 pr-1">
                  <Sparkles className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5 opacity-60" />
                  <span>{summary}</span>
                </div>
              )}
            </div>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-1">
          {/* Sections and articles in chapter */}
          {chapter.children?.map((child: any) => 
            child.type === 'section' 
              ? renderSection(child, 0)
              : renderArticle(child, 0)
          )}
        </CollapsibleContent>
      </Collapsible>
    );
  };

  return (
    <div className="space-y-2">
      <div className="mb-4">
        <div>
          <a 
            href="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex%3A52022PC0209"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium leading-tight mb-1 text-blue-600 dark:text-blue-400 hover:underline block"
          >
            Child Sexual Abuse Regulation
          </a>
          <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
            <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
              EU Regulation
            </span>
            <span>COM(2022) 209</span>
          </div>
          
          {/* Summary indicator */}
          {hasSummaries() && (
            <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
              <Sparkles className="h-3 w-3" />
              <span>AI summaries available</span>
            </div>
          )}
        </div>
      </div>

      {/* Control buttons */}
      <div className="flex gap-2 mb-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7 px-3 py-1"
            >
              Show <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
            <DropdownMenuItem onClick={() => showUpToLevel('chapters')} className="text-xs py-1">
              <BookOpen className="h-3 w-3 mr-2" />
              Show Chapters
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => showUpToLevel('sections')} className="text-xs py-1">
              <Hash className="h-3 w-3 mr-2" />
              Show Sections
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => showUpToLevel('articles')} className="text-xs py-1">
              <FileText className="h-3 w-3 mr-2" />
              Show Articles
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => showUpToLevel('paragraphs')} className="text-xs py-1">
              <List className="h-3 w-3 mr-2" />
              Show Paragraphs
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => showUpToLevel('points')} className="text-xs py-1">
              <Dot className="h-3 w-3 mr-2" />
              Show Points
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
          <div className="flex items-center gap-2">
            <List className="h-2 w-2" />
            <span>Paragraph</span>
          </div>
          <div className="flex items-center gap-2">
            <Dot className="h-2 w-2" />
            <span>Point</span>
          </div>
        </div>
      </div>
    </div>
  );
}