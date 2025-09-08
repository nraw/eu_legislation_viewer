"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchClear: () => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({ 
  searchQuery, 
  onSearchChange, 
  onSearchClear, 
  placeholder = "Search legislation...",
  className 
}: SearchInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative">
        <Search className={cn(
          "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors",
          isFocused || searchQuery ? "text-blue-600" : "text-muted-foreground"
        )} />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            "pl-10 pr-10 transition-all",
            (isFocused || searchQuery) && "ring-1 ring-blue-600 border-blue-600"
          )}
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onSearchClear}
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
}