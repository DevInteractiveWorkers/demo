"use client";

import dynamic from "next/dynamic";
import type { ReaderProps } from "./pdf-reader";

const PDFReader = dynamic(() => import("./pdf-reader"), {
  ssr: false,
});

const PDFReaderWrapper = (props: ReaderProps) => {
  return <PDFReader {...props} />;
};

export default PDFReaderWrapper;
