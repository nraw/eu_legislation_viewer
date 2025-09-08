"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { regulationNavigationStructure, NavigationItem } from "@/data/regulation-content";
import { ChevronDown, ChevronRight, FileText, BookOpen, Hash, List } from "lucide-react";

interface OriginalTableOfContentsProps {
  activeElementId: string;
  onElementClick: (elementId: string) => void;
}

export function OriginalTableOfContents({ 
  activeElementId, 
  onElementClick 
}: OriginalTableOfContentsProps) {
  
  const getIcon = (item: NavigationItem) => {
    switch (item.type) {
      case 'chapter':
        return <BookOpen className="h-3 w-3 mr-2 flex-shrink-0" />;
      case 'article':
        return <FileText className="h-3 w-3 mr-2 flex-shrink-0" />;
      case 'section':
        return <Hash className="h-3 w-3 mr-2 flex-shrink-0" />;
      case 'whereas':
        return <List className="h-3 w-3 mr-2 flex-shrink-0" />;
      default:
        return <FileText className="h-3 w-3 mr-2 flex-shrink-0" />;
    }
  };

  const getTypeColor = (type: NavigationItem['type']) => {
    switch (type) {
      case 'chapter': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'article': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'section': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'whereas': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-2">
      <div className="mb-4">
        <h2 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
          Navigation
        </h2>
        <p className="text-sm font-medium leading-tight">
          EU Regulation on Child Sexual Abuse
        </p>
        <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
          <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
            EU Regulation Proposal
          </span>
          <span>COM(2022) 209</span>
        </div>
      </div>

      <div className="space-y-1">
        {regulationNavigationStructure.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className={`w-full justify-start h-auto p-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
              activeElementId === item.id
                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-500"
                : ""
            }`}
            style={{ paddingLeft: `${12 + (item.level - 1) * 16}px` }}
            onClick={() => onElementClick(item.id)}
          >
            {getIcon(item)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs truncate">{item.title}</span>
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${getTypeColor(item.type)} px-1 py-0 text-[10px]`}
                >
                  {item.type}
                </Badge>
              </div>
              {item.level > 2 && (
                <div className="text-[10px] text-gray-400">
                  Level {item.level}
                </div>
              )}
            </div>
          </Button>
        ))}
      </div>

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
            <List className="h-3 w-3" />
            <span>Whereas</span>
          </div>
        </div>
      </div>
    </div>
  );
}