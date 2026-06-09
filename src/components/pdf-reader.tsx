"use client";

import React, { useEffect, useState } from "react";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import { IconButton } from "./icons/icon-button";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export interface ReaderProps {
  isOpen: boolean;
  pdf: string;
  toggle?: () => void;
}

const PDFComponent = ({ file }: { file: string }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [numPages, setNumPages] = useState<number>(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }
  const changePage = (num: number) => {
    if ((num < 0 && currentPage === 1) || currentPage + num > numPages) return;
    else setCurrentPage(currentPage + num);
  };

  const [pageWidth, setPageWidth] = useState<number>();

  useEffect(() => {
    const updateSize = () => {
      setPageWidth(
        window.innerWidth < window.innerHeight ? window.innerWidth : undefined,
      );
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div className="relative flex items-center h-dvh">
      <Document
        file={file}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={(error) => console.error("PDF Load Error:", error)}
        onSourceError={(error) => console.error("Source Error:", error)}
      >
        <Page
          width={pageWidth}
          pageNumber={currentPage}
          renderAnnotationLayer={false}
          renderTextLayer={false}
        />
      </Document>
      <div className="absolute h-1/2 bottom-0 text-white w-full hover:opacity-100 opacity-0 transition-all">
        <div className="absolute bottom-0 w-full p-6 flex justify-between items-center bg-linear-to-b from-transparent to-[#181621]">
          <IconButton
            icon="prev"
            filledOnHover
            onClick={() => changePage(-1)}
            className="active:scale-95 transition-all duration-200"
          >
            Prev
          </IconButton>
          <span>
            {currentPage} / {numPages}
          </span>
          <IconButton
            icon="next"
            filledOnHover
            onClick={() => changePage(1)}
            className="active:scale-95 transition-all duration-200"
            reversed
          >
            Next
          </IconButton>
        </div>
      </div>
    </div>
  );
};

const PDFReader = ({ isOpen, pdf, toggle }: ReaderProps) => {
  return (
    <div
      className={`absolute top-0 left-0 w-full h-dvh flex items-center justify-center bg-[#18162199] backdrop-blur-lg transition-all duration-500 overflow-y-hidden ${
        isOpen ? "opacity-100 z-50" : "opacity-0 -z-50"
      }`}
    >
      <IconButton
        icon="close"
        className="absolute top-0 right-0 p-5 z-50"
        onClick={toggle}
      />
      {isOpen && (
        <div className="absolute top-0 h-dvh flex">
          <PDFComponent file="/portfolios/Mauro/MauroLealResumeDEMO.pdf" />
        </div>
      )}
    </div>
  );
};

export default PDFReader;
