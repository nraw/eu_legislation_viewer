"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { DocumentSelector } from "@/components/document-selector";
import { CollapsibleToc } from "@/components/collapsible-toc";
import { OriginalDocumentView } from "@/components/original-document-view";
import DocumentService from "@/lib/document-service";
import { AvailableDocument, LegislationDocument } from "@/types/legislation";
import { ChevronLeft, Menu } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [activeElementId, setActiveElementId] = useState<string>("");
  const [currentDocument, setCurrentDocument] = useState<LegislationDocument | null>(null);
  const [availableDocuments] = useState<AvailableDocument[]>(DocumentService.getAvailableDocuments());
  const [isLoadingDocument, setIsLoadingDocument] = useState(false);
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [showDocumentSelector, setShowDocumentSelector] = useState(true);

  // Handle URL parameters on mount and URL changes
  useEffect(() => {
    const documentId = searchParams.get('doc');
    const elementId = searchParams.get('element');
    
    if (documentId && documentId !== selectedDocumentId) {
      const document = availableDocuments.find(doc => doc.id === documentId);
      if (document) {
        handleDocumentSelectFromURL(document, elementId);
      }
    } else if (!documentId && selectedDocumentId) {
      // URL was cleared, go back to document selector
      setShowDocumentSelector(true);
      setCurrentDocument(null);
      setSelectedDocumentId(null);
      setActiveElementId("");
    }
    
    if (elementId && elementId !== activeElementId) {
      setActiveElementId(elementId);
    }
  }, [searchParams]);

  const handleDocumentSelectFromURL = async (document: AvailableDocument, elementId?: string | null) => {
    setIsLoadingDocument(true);
    try {
      const legislationDoc = await DocumentService.fetchDocument(document);
      setCurrentDocument(legislationDoc);
      setSelectedDocumentId(document.id);
      
      // Set active element from URL or default to first chapter
      const targetElementId = elementId || "chapter-0";
      setActiveElementId(targetElementId);
      
      setShowDocumentSelector(false);
      
      // Scroll to element after a brief delay to ensure content is rendered
      if (elementId) {
        setTimeout(() => {
          const element = window.document.getElementById(elementId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    } catch (error) {
      console.error('Error loading document:', error);
    } finally {
      setIsLoadingDocument(false);
    }
  };

  const handleDocumentSelect = async (document: AvailableDocument) => {
    if (selectedDocumentId === document.id) return;
    
    // Update URL immediately
    const params = new URLSearchParams();
    params.set('doc', document.id);
    params.set('element', 'chapter-0');
    router.push(`?${params.toString()}`, { scroll: false });
    
    setIsLoadingDocument(true);
    try {
      const legislationDoc = await DocumentService.fetchDocument(document);
      setCurrentDocument(legislationDoc);
      setSelectedDocumentId(document.id);
      
      // Auto-set first active element to first chapter
      setActiveElementId("chapter-0"); // First chapter
      
      setShowDocumentSelector(false);
    } catch (error) {
      console.error('Error loading document:', error);
    } finally {
      setIsLoadingDocument(false);
    }
  };

  const handleElementClick = (elementId: string) => {
    setActiveElementId(elementId);
    
    // Update URL with current document and element
    if (selectedDocumentId) {
      const params = new URLSearchParams();
      params.set('doc', selectedDocumentId);
      params.set('element', elementId);
      router.replace(`?${params.toString()}`, { scroll: false });
    }
    
    const element = window.document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleBackToSelection = () => {
    setShowDocumentSelector(true);
    setCurrentDocument(null);
    setSelectedDocumentId(null);
    setActiveElementId("");
  };

  if (showDocumentSelector) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              EU Legislation Viewer
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Browse and explore European Union legislation documents with an interactive table of contents.
            </p>
          </div>
          
          <DocumentSelector
            availableDocuments={availableDocuments}
            selectedDocumentId={selectedDocumentId || undefined}
            onDocumentSelect={handleDocumentSelect}
            isLoading={isLoadingDocument}
          />
        </div>
      </div>
    );
  }

  if (!currentDocument) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading document...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToSelection}
            className="p-2"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-sm font-semibold truncate max-w-[200px]">
              {currentDocument.title}
            </h1>
            <p className="text-xs text-gray-500">{currentDocument.reference}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsTocOpen(!isTocOpen)}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex">
        {/* Table of Contents - Left Side */}
        <div className={`lg:w-1/2 w-full lg:relative absolute lg:translate-x-0 transition-transform duration-300 z-10 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-700 ${
          isTocOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 hidden lg:flex items-center justify-between">
            <button 
              onClick={handleBackToSelection}
              className="text-lg font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              EU Legislation Viewer
            </button>
          </div>
          <ScrollArea className="h-[calc(100vh-73px)] lg:h-[calc(100vh-73px)] h-[calc(100vh-133px)]">
            <div className="p-4">
              <CollapsibleToc 
                activeElementId={activeElementId}
                onElementClick={(elementId) => {
                  handleElementClick(elementId);
                  setIsTocOpen(false); // Close ToC on mobile after selection
                }}
              />
            </div>
          </ScrollArea>
        </div>

        {/* Mobile Overlay */}
        {isTocOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-5"
            onClick={() => setIsTocOpen(false)}
          />
        )}

        {/* Legislation Content - Right Side */}
        <div className="lg:w-1/2 w-full lg:relative">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 hidden lg:block">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold">Document Content</h1>
              <div className="text-xs text-gray-500 text-right">
                <div>{currentDocument.type}</div>
                <div>Analysis: Sep 8, 2025</div>
              </div>
            </div>
          </div>
          <ScrollArea className="lg:h-[calc(100vh-73px)] h-[calc(100vh-60px)]">
            <OriginalDocumentView />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}