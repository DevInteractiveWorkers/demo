"use client";

import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { IconButton } from "./icons/icon-button";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFComponentProps {
  file: string | File;
  className?: string;
  startAt?: number;
  controls?: boolean;
}

export function PDFReader({
  file,
  className,
  startAt = 1,
  controls = true,
}: PDFComponentProps) {
  const [currentPage, setCurrentPage] = useState(startAt);
  const [numPages, setNumPages] = useState(1);

  const containerRef = useRef<HTMLDivElement>(null);
  const [pageWidth, setPageWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(([entry]) => {
      setPageWidth(entry.contentRect.width);
    });

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  const changePage = (amount: number) => {
    setCurrentPage((page) => Math.min(Math.max(page + amount, 1), numPages));
  };

  return (
    <div
      className={`flex flex-col h-full w-full overflow-hidden ${className ?? ""}`}
    >
      <div
        ref={containerRef}
        className="flex-1 overflow-auto flex justify-center items-center"
      >
        <Document
          file={file}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          onLoadError={console.error}
          onSourceError={console.error}
        >
          {pageWidth > 0 && (
            <Page
              pageNumber={currentPage}
              width={Math.min(pageWidth, 900)}
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          )}
        </Document>
      </div>

      {controls && (
        <div className="flex items-center justify-between p-4 border-t  text-white">
          <IconButton
            icon="prev"
            onClick={() => changePage(-1)}
            filledOnHover
            className="disabled:opacity-0 disabled:cursor-default"
            disabled={currentPage === 1}
          >
            Prev
          </IconButton>

          <span>
            {currentPage} / {numPages}
          </span>

          <IconButton
            icon="next"
            reversed
            onClick={() => changePage(1)}
            filledOnHover
            className="disabled:opacity-0 disabled:cursor-default"
            disabled={currentPage === numPages}
          >
            Next
          </IconButton>
        </div>
      )}
    </div>
  );
}
