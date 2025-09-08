"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LegislationDocument } from "@/types/legislation";

interface FullDocumentViewProps {
  document: LegislationDocument;
}

export function FullDocumentView({ document }: FullDocumentViewProps) {
  return (
    <div className="space-y-8 p-6">
      {/* Document Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {document.content.title}
        </h1>
        <div className="flex items-center flex-wrap gap-2 mb-4">
          <Badge variant="default">{document.type}</Badge>
          <Badge variant="secondary">{document.reference}</Badge>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <a 
            href={document.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            View Original Document
          </a>
        </p>
      </div>

      {/* Preamble */}
      {document.content.preamble && (
        <section id="preamble" className="scroll-mt-4">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">{document.content.preamble.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {document.content.preamble.articles?.map((article) => (
                  <div key={article.id} id={article.id} className="scroll-mt-4">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
                      {article.title}
                    </h3>
                    {article.paragraphs.map((paragraph) => (
                      <p key={paragraph.id} className="text-base leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
                        {paragraph.content}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Chapters */}
      {document.content.chapters.map((chapter) => (
        <section key={chapter.id} id={chapter.id} className="scroll-mt-4">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                {chapter.title}
                {chapter.number && (
                  <Badge variant="outline" className="text-xs font-mono">
                    {chapter.number}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* Chapter Sections */}
                {chapter.sections?.map((section) => (
                  <div key={section.id} id={section.id} className="scroll-mt-4">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200 border-l-4 border-blue-500 pl-4">
                      {section.title}
                    </h3>
                    <div className="space-y-6 ml-4">
                      {section.articles?.map((article) => (
                        <div key={article.id} id={article.id} className="scroll-mt-4">
                          <h4 className="text-base font-semibold mb-2 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            {article.title}
                            {article.number && (
                              <Badge variant="outline" className="text-xs font-mono">
                                #{article.number}
                              </Badge>
                            )}
                          </h4>
                          <div className="space-y-3">
                            {article.content && (
                              <p className="text-base leading-relaxed text-gray-600 dark:text-gray-400 font-medium">
                                {article.content}
                              </p>
                            )}
                            {article.paragraphs.map((paragraph) => (
                              <div key={paragraph.id} className="ml-4">
                                {paragraph.number && (
                                  <div className="text-sm font-mono text-gray-500 mb-1">
                                    ({paragraph.number})
                                  </div>
                                )}
                                <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                                  {paragraph.content}
                                </p>
                                
                                {paragraph.subparagraphs && paragraph.subparagraphs.length > 0 && (
                                  <div className="ml-6 mt-3 space-y-2">
                                    {paragraph.subparagraphs.map((subpara) => (
                                      <div key={subpara.id} className="border-l-2 border-gray-200 pl-4">
                                        {subpara.number && (
                                          <div className="text-sm font-mono text-gray-500 mb-1">
                                            ({subpara.number})
                                          </div>
                                        )}
                                        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                                          {subpara.content}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Direct chapter articles (no sections) */}
                {chapter.articles?.map((article) => (
                  <div key={article.id} id={article.id} className="scroll-mt-4">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200 flex items-center gap-2">
                      {article.title}
                      {article.number && (
                        <Badge variant="outline" className="text-xs font-mono">
                          #{article.number}
                        </Badge>
                      )}
                    </h3>
                    <div className="space-y-3 ml-4">
                      {article.content && (
                        <p className="text-base leading-relaxed text-gray-600 dark:text-gray-400 font-medium">
                          {article.content}
                        </p>
                      )}
                      {article.paragraphs.map((paragraph) => (
                        <div key={paragraph.id}>
                          {paragraph.number && (
                            <div className="text-sm font-mono text-gray-500 mb-1">
                              ({paragraph.number})
                            </div>
                          )}
                          <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                            {paragraph.content}
                          </p>
                          
                          {paragraph.subparagraphs && paragraph.subparagraphs.length > 0 && (
                            <div className="ml-6 mt-3 space-y-2">
                              {paragraph.subparagraphs.map((subpara) => (
                                <div key={subpara.id} className="border-l-2 border-gray-200 pl-4">
                                  {subpara.number && (
                                    <div className="text-sm font-mono text-gray-500 mb-1">
                                      ({subpara.number})
                                    </div>
                                  )}
                                  <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                                    {subpara.content}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      ))}

      {/* Annexes */}
      {document.content.annexes?.map((annex) => (
        <section key={annex.id} id={annex.id} className="scroll-mt-4">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">{annex.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {annex.articles?.map((article) => (
                  <div key={article.id} id={article.id} className="scroll-mt-4">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200 flex items-center gap-2">
                      {article.title}
                      {article.number && (
                        <Badge variant="outline" className="text-xs font-mono">
                          #{article.number}
                        </Badge>
                      )}
                    </h3>
                    {article.paragraphs.map((paragraph) => (
                      <p key={paragraph.id} className="text-base leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
                        {paragraph.content}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      ))}
    </div>
  );
}