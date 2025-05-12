"use client";

import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { IconButton } from "../components/icon-button";

export interface ReaderProps {
  isOpen: boolean;
  pdf: string;
  toggle?: () => void;
}

const PDFReader = ({ isOpen, pdf, toggle }: ReaderProps) => {
  return (
    <div
      className={`absolute top-0 left-0 w-full h-full flex items-center justify-center bg-[#18162199] backdrop-blur-lg transition-all duration-500 overflow-y-hidden ${
        isOpen ? "opacity-100 z-50" : "opacity-0 -z-50"
      }`}
    >
      <IconButton
        icon="close"
        className="absolute top-0 right-0 p-5 z-50"
        onClick={toggle}
      />
      <div
        className={`absolute top-0 md:w-5xl w-full h-screen transition-all duration-500 ${
          isOpen ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
      >
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
          <Viewer fileUrl={pdf} />
        </Worker>
      </div>
    </div>
  );
};

export default PDFReader;
