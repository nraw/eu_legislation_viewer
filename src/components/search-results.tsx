"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { SearchResult } from "@/lib/search-service";
import { FileText, BookOpen, Hash, List, Dot, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchResultsProps {
  results: SearchResult[];
  searchQuery: string;
  onResultClick: (resultId: string) => void;
  activeElementId?: string;
}

const typeIcons = {
  chapter: BookOpen,
  section: Hash,
  article: FileText,
  paragraph: List,
  point: Dot,
  whereas: FileText
};

const typeColors = {
  chapter: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  section: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", 
  article: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  paragraph: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  point: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
  whereas: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
};

export function SearchResults({ 
  results, 
  searchQuery, 
  onResultClick, 
  activeElementId 
}: SearchResultsProps) {
  if (results.length === 0 && searchQuery.trim().length >= 2) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
        <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p className="text-lg mb-2">No results found</p>
        <p className="text-sm">Try different keywords or check your spelling</p>
      </div>
    );
  }

  if (searchQuery.trim().length < 2) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
        <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p className="text-lg mb-2">Start typing to search</p>
        <p className="text-sm">Search through legislation content, articles, and sections</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-2">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Found {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{searchQuery}&rdquo;
        </div>
        
        {results.map((result) => {
          const IconComponent = typeIcons[result.type] || FileText;
          const isActive = activeElementId === result.id;
          
          return (
            <button
              key={result.id}
              onClick={() => onResultClick(result.id)}
              className={cn(
                "w-full text-left p-3 rounded-lg border transition-all duration-200 hover:shadow-md",
                isActive 
                  ? "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 shadow-sm"
                  : "bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              )}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <IconComponent className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge 
                      variant="secondary" 
                      className={cn("text-xs px-2 py-1", typeColors[result.type])}
                    >
                      {result.type}
                    </Badge>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Score: {result.score}
                    </span>
                  </div>
                  
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2 line-clamp-2 leading-snug">
                    {result.title}
                  </h4>
                  
                  {result.highlights.length > 0 && (
                    <div className="space-y-1">
                      {result.highlights.map((highlight, index) => (
                        <div
                          key={`${result.id}-highlight-${index}`}
                          className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2"
                          dangerouslySetInnerHTML={{ __html: highlight }}
                        />
                      ))}
                    </div>
                  )}
                  
                  {result.highlights.length === 0 && result.content && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {result.content}
                    </p>
                  )}
                </div>
                
                <div className="flex-shrink-0 mt-1">
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </button>
          );
        })}
        
        {results.length >= 50 && (
          <div className="text-center p-4 text-sm text-gray-500 dark:text-gray-400">
            Showing first 50 results. Try refining your search for more specific results.
          </div>
        )}
      </div>
    </ScrollArea>
  );
}