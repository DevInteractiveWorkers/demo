"use client";

import React, { useEffect, useState } from "react";
import { IconButton } from "../components/icon-button";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";

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
    console.log(num, currentPage);
    if ((num < 0 && currentPage === 1) || currentPage + num > numPages) return;
    else setCurrentPage(currentPage + num);
  };

  console.log();
  const [screenWidth, setScreenWidth] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setScreenWidth(window.screen.width);
    }
  }, []);

  return (
    <div className="relative flex items-center h-screen">
      <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
        <Page
          width={
            screenWidth && screenWidth < window.screen.height
              ? screenWidth
              : undefined
          }
          pageNumber={currentPage}
          renderAnnotationLayer={false}
          renderTextLayer={false}
        />
      </Document>
      <div className="absolute h-1/2 bottom-0 text-white w-full hover:opacity-100 opacity-0 transition-all">
        <div className="absolute bottom-0 w-full p-6 flex justify-between items-center bg-gradient-to-b from-transparent to-[#181621]">
          <IconButton icon="prev" onClick={() => changePage(-1)} filled>
            Prev
          </IconButton>
          <span>
            {currentPage} / {numPages}
          </span>
          <IconButton icon="next" onClick={() => changePage(1)} filled reversed>
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
      className={`absolute top-0 left-0 w-full h-screen flex items-center justify-center bg-[#18162199] backdrop-blur-lg transition-all duration-500 overflow-y-hidden ${
        isOpen ? "opacity-100 z-50" : "opacity-0 -z-50"
      }`}
    >
      <IconButton
        icon="close"
        className="absolute top-0 right-0 p-5 z-50"
        onClick={toggle}
      />
      <div
        className={`absolute top-0 h-screen transition-all duration-500 flex max-md:content-between ${
          isOpen ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
      >
        <PDFComponent file={"/portfolios/Mauro/MauroLealResumeDEMO.pdf"} />
      </div>
    </div>
  );
};

export default PDFReader;
