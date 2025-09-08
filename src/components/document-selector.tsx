"use client";

import { useState } from "react";
import { Check, FileText, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AvailableDocument } from "@/types/legislation";

interface DocumentSelectorProps {
  availableDocuments: AvailableDocument[];
  selectedDocumentId?: string;
  onDocumentSelect: (document: AvailableDocument) => void;
  isLoading?: boolean;
}

export function DocumentSelector({ 
  availableDocuments, 
  selectedDocumentId, 
  onDocumentSelect, 
  isLoading 
}: DocumentSelectorProps) {
  const [hoveredDocument, setHoveredDocument] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Select a Document</h2>
        <div className="text-sm text-gray-500">
          {availableDocuments.length} document{availableDocuments.length !== 1 ? 's' : ''} available
        </div>
      </div>

      <div className="grid gap-3">
        {availableDocuments.map((document) => {
          const isSelected = selectedDocumentId === document.id;
          const isHovered = hoveredDocument === document.id;
          
          return (
            <Card
              key={document.id}
              className={`transition-all duration-200 cursor-pointer hover:shadow-md ${
                isSelected 
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20" 
                  : "hover:border-gray-300"
              }`}
              onMouseEnter={() => setHoveredDocument(document.id)}
              onMouseLeave={() => setHoveredDocument(null)}
              onClick={() => onDocumentSelect(document)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 p-2 rounded-lg ${
                      isSelected 
                        ? "bg-blue-100 dark:bg-blue-900/30" 
                        : "bg-gray-100 dark:bg-gray-800"
                    }`}>
                      <FileText className={`h-4 w-4 ${
                        isSelected ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm font-medium leading-5 mb-1">
                        {document.title}
                      </CardTitle>
                      <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
                        <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                          {document.type}
                        </span>
                        <span>{document.reference}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {(isHovered || isSelected) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(document.url, '_blank');
                        }}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    )}
                    
                    {isSelected && (
                      <div className="flex-shrink-0">
                        <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                    )}
                    
                    {isLoading && selectedDocumentId === document.id && (
                      <div className="flex-shrink-0">
                        <Download className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-400" />
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              {document.description && (
                <CardContent className="pt-0">
                  <CardDescription className="text-xs">
                    {document.description}
                  </CardDescription>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {availableDocuments.length === 0 && (
        <Card className="py-8">
          <CardContent className="text-center">
            <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No documents available</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}