"use client";

/**
 * Mobile scroll mode (viewport <= 767px): all pages are stacked in one
 * vertically scrolling column. Desktop spreads/Prev/Next are untouched.
 *
 * New state / effects introduced for the scroll-based rendering:
 *  - state `scrollRange` {from, to}: pages near the viewport; only these mount
 *    a <Page> canvas, the other slots stay as fixed-size placeholders so the
 *    column keeps its full height (continuous scroll, bounded memory).
 *  - ref `pageRef`: latest `page`, read when restoring the scroll position.
 *  - useLayoutEffect [isMobile, stride, numPages]: restores the scroll offset
 *    for the current page (startAt on first render, and after resize / aspect
 *    changes) and refreshes `scrollRange` before paint.
 *  - useEffect [isMobile, stride, numPages]: rAF-throttled, passive scroll
 *    listener that updates `scrollRange` and `page` (the counter).
 *  - the existing ResizeObserver is reused for sizing.
 */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { IconButton } from "./icons/icon-button";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFComponentProps {
  file: string | File;
  className?: string;
  startAt?: number;
  controls?: boolean;
  onClose?: () => void;
}

const LABELS_MIN_WIDTH = 640;
/** Viewport (not container) width below which the device counts as mobile. */
const MOBILE_QUERY = "(max-width: 767px)";
const MAX_PAGE_WIDTH = 900;
/** Mobile scroll mode: gap between stacked pages (px). */
const MOBILE_GAP = 12;
/** Mobile scroll mode: viewports of pages kept rendered above/below the view. */
const SCROLL_RENDER_MARGIN = 1;
const TURN_MS = 600;
const TURN_EASING = "cubic-bezier(0.645, 0.045, 0.355, 1)";
const RENDER_WINDOW = 2;
const DRAG_DISTANCE_FACTOR = 1.2;
const DRAG_START_THRESHOLD = 8;
const COMMIT_PROGRESS = 0.25;
const COMMIT_VELOCITY = 0.4; // px / ms

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

interface DragState {
  dir: 1 | -1;
  progress: number;
}

interface Gesture {
  id: number;
  startX: number;
  lastX: number;
  lastT: number;
  vx: number;
  dir: 0 | 1 | -1;
  progress: number;
}

export function PDFReader({
  file,
  className,
  startAt = 1,
  controls = true,
  onClose,
}: PDFComponentProps) {
  // Source of truth: the left-most visible page. Works across desktop/mobile.
  const [page, setPage] = useState(Math.max(1, Math.floor(startAt)));
  const [numPages, setNumPages] = useState(1);
  const [aspect, setAspect] = useState(1.414);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [turning, setTurning] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [scrollRange, setScrollRange] = useState({ from: 1, to: 3 });
  const pageRef = useRef(page);
  const gesture = useRef<Gesture | null>(null);
  const turningTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
      setContainerHeight(entry.contentRect.height);
    });

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(
    () => () => {
      if (turningTimer.current) clearTimeout(turningTimer.current);
    },
    [],
  );

  // Spreads on desktop whenever there is more than one page besides the cover;
  // mobile viewports always show one page at a time.
  const isDesktop = numPages > 2 && !isMobile;
  const showLabels = containerWidth >= LABELS_MIN_WIDTH;
  // Fit the whole book inside the container (width and height) so it never
  // needs scrolling; the 900px cap still applies per page.
  const fitWidth = isDesktop ? containerWidth / 2 : containerWidth;
  const fitHeight =
    containerHeight > 0 && !isMobile ? containerHeight / aspect : Infinity;
  const pageW = Math.floor(Math.min(fitWidth, fitHeight, MAX_PAGE_WIDTH));
  const pageH = Math.round(pageW * aspect);
  const stride = pageH + MOBILE_GAP;

  const maxFlipped = isDesktop ? Math.floor(numPages / 2) : numPages - 1;
  const leafCount = isDesktop ? Math.ceil(numPages / 2) : numPages;
  const pageToFlipped = (p: number) => (isDesktop ? Math.floor(p / 2) : p - 1);
  const flippedToPage = (f: number) =>
    isDesktop ? (f === 0 ? 1 : 2 * f) : f + 1;

  const flipped = clamp(
    pageToFlipped(clamp(page, 1, numPages)),
    0,
    Math.max(maxFlipped, 0),
  );
  const atStart = flipped <= 0;
  const atEnd = flipped >= maxFlipped;

  const startTurning = (leaf: number) => {
    setTurning(leaf);
    if (turningTimer.current) clearTimeout(turningTimer.current);
    turningTimer.current = setTimeout(() => setTurning(null), TURN_MS + 50);
  };

  const changePage = (amount: number) => {
    const target = clamp(flipped + amount, 0, maxFlipped);
    if (target === flipped) return;
    startTurning(amount > 0 ? flipped : flipped - 1);
    setPage(flippedToPage(target));
  };

  // --- Mobile scroll mode ---------------------------------------------------

  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  const readScroll = () => {
    const el = containerRef.current;
    if (!el || pageH <= 0) return null;
    const top = el.scrollTop;
    const h = el.clientHeight;
    const pageAt = (y: number) =>
      clamp(Math.floor(y / stride) + 1, 1, Math.max(numPages, 1));
    return {
      center: pageAt(top + h / 2),
      from: pageAt(top - h * SCROLL_RENDER_MARGIN),
      to: pageAt(top + h * (1 + SCROLL_RENDER_MARGIN)),
    };
  };

  const applyRange = (from: number, to: number) =>
    setScrollRange((r) => (r.from === from && r.to === to ? r : { from, to }));

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!isMobile || !el || pageH <= 0) return;
    el.scrollTop = (clamp(pageRef.current, 1, numPages) - 1) * stride;
    const s = readScroll();
    if (s) applyRange(s.from, s.to);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, stride, numPages]);

  useEffect(() => {
    const el = containerRef.current;
    if (!isMobile || !el) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const s = readScroll();
        if (!s) return;
        applyRange(s.from, s.to);
        setPage(s.center);
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, stride, numPages]);

  const scrollColumn = isMobile ? (
    <div className="mx-auto" style={{ width: pageW }}>
      {Array.from({ length: numPages }, (_, i) => {
        const n = i + 1;
        const live = n >= scrollRange.from && n <= scrollRange.to;
        return (
          <div
            key={n}
            data-page={n}
            className="relative overflow-hidden bg-white"
            style={{
              width: pageW,
              height: pageH,
              marginBottom: n < numPages ? MOBILE_GAP : 0,
            }}
          >
            {live && (
              <Page
                pageNumber={n}
                width={pageW}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                onLoadSuccess={(p) =>
                  setAspect((a) =>
                    a === 1.414 && p.originalWidth > 0
                      ? p.originalHeight / p.originalWidth
                      : a,
                  )
                }
              />
            )}
          </div>
        );
      })}
    </div>
  ) : null;

  // --- Swipe (touch + mouse drag) -----------------------------------------

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    gesture.current = {
      id: e.pointerId,
      startX: e.clientX,
      lastX: e.clientX,
      lastT: performance.now(),
      vx: 0,
      dir: 0,
      progress: 0,
    };
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    if (!g || g.id !== e.pointerId) return;

    const now = performance.now();
    const dt = now - g.lastT;
    if (dt > 0) g.vx = (e.clientX - g.lastX) / dt;
    g.lastX = e.clientX;
    g.lastT = now;

    let dx = e.clientX - g.startX;

    if (g.dir === 0) {
      if (Math.abs(dx) < DRAG_START_THRESHOLD) return;
      const dir = dx < 0 ? 1 : -1;
      const target = flipped + dir;
      if (target < 0 || target > maxFlipped) return; // nothing to turn to
      g.dir = dir;
      g.startX = e.clientX; // start the turn from the current pointer position
      dx = 0;
      e.currentTarget.setPointerCapture(e.pointerId);
    }

    g.progress = clamp((-g.dir * dx) / (pageW * DRAG_DISTANCE_FACTOR), 0, 1);
    setDrag({ dir: g.dir, progress: g.progress });
  };

  const endGesture = (
    e: ReactPointerEvent<HTMLDivElement>,
    cancelled: boolean,
  ) => {
    const g = gesture.current;
    if (!g || g.id !== e.pointerId) return;
    gesture.current = null;
    if (g.dir === 0) return;

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    const flick = -g.dir * g.vx > COMMIT_VELOCITY && g.progress > 0.03;
    const commit = !cancelled && (g.progress > COMMIT_PROGRESS || flick);

    setDrag(null);
    if (commit) {
      changePage(g.dir);
    } else {
      // Spring back: the leaf animates to its resting angle.
      startTurning(g.dir > 0 ? flipped : flipped - 1);
    }
  };

  // --- Rendering helpers ---------------------------------------------------

  const draggedLeaf = drag ? (drag.dir > 0 ? flipped : flipped - 1) : null;

  const leafAngle = (i: number) => {
    if (drag && i === draggedLeaf) {
      return drag.dir > 0 ? -180 * drag.progress : -180 * (1 - drag.progress);
    }
    return i < flipped ? -180 : 0;
  };

  const leafZ = (i: number) => {
    if (i === draggedLeaf || i === turning) return leafCount + 2;
    return i < flipped ? i : leafCount - i;
  };

  // Horizontal offset that keeps a lone cover / lone last page centred.
  const shiftFor = (f: number) => {
    if (!isDesktop) return 0;
    if (f === 0) return -pageW / 2;
    if (f === maxFlipped && numPages % 2 === 0) return pageW / 2;
    return 0;
  };
  const shift = drag
    ? shiftFor(flipped) +
      (shiftFor(clamp(flipped + drag.dir, 0, maxFlipped)) - shiftFor(flipped)) *
        drag.progress
    : shiftFor(flipped);

  const transition = drag ? "none" : `transform ${TURN_MS}ms ${TURN_EASING}`;

  const renderFace = (pageNumber: number | null, leaf: number) => {
    if (pageNumber === null || pageNumber > numPages) return null;
    if (Math.abs(leaf - flipped) > RENDER_WINDOW) return null;
    return (
      <Page
        pageNumber={pageNumber}
        width={pageW}
        renderAnnotationLayer={false}
        renderTextLayer={false}
        onLoadSuccess={(p) =>
          setAspect((a) =>
            a === 1.414 && p.originalWidth > 0
              ? p.originalHeight / p.originalWidth
              : a,
          )
        }
      />
    );
  };

  const faceBase: CSSProperties = {
    position: "absolute",
    inset: 0,
    overflow: "hidden",
    backgroundColor: "#fff",
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
  };

  const leaves = Array.from({ length: leafCount }, (_, i) => {
    const front = isDesktop ? 2 * i + 1 : i + 1;
    const back = isDesktop ? 2 * i + 2 : null;

    return (
      <div
        key={i}
        style={{
          position: "absolute",
          top: 0,
          left: isDesktop ? "50%" : 0,
          width: pageW,
          height: pageH,
          zIndex: leafZ(i),
          transformOrigin: "left center",
          transformStyle: "preserve-3d",
          transform: `rotateY(${leafAngle(i)}deg)`,
          transition,
        }}
      >
        <div style={faceBase}>
          {renderFace(front, i)}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to right, rgba(0,0,0,0.22), rgba(0,0,0,0) 8%)",
            }}
          />
        </div>
        <div style={{ ...faceBase, transform: "rotateY(180deg)" }}>
          {renderFace(back, i)}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to left, rgba(0,0,0,0.22), rgba(0,0,0,0) 8%)",
            }}
          />
        </div>
      </div>
    );
  });

  const pageLabel = (() => {
    if (!isDesktop) return `${flipped + 1}`;
    if (flipped === 0) return "1";
    const left = 2 * flipped;
    return left + 1 <= numPages ? `${left}–${left + 1}` : `${left}`;
  })();

  return (
    <div
      className={`flex flex-col h-full w-full overflow-hidden ${className ?? ""}`}
    >
      <div className="flex flex-1 min-h-0 items-center">
        {controls && !isMobile && (
          <IconButton
            icon="prev"
            onClick={() => changePage(-1)}
            filledOnHover
            className="flex-none text-white disabled:opacity-0 disabled:cursor-default"
            disabled={atStart}
            width="48px"
            height="48px"
          >
            {showLabels ? "Prev" : ""}
          </IconButton>
        )}

        <div
          ref={containerRef}
          className={
            isMobile
              ? "flex-1 min-w-0 self-stretch overflow-y-auto overflow-x-hidden"
              : "flex flex-1 min-w-0 self-stretch overflow-hidden justify-center items-center p-4"
          }
        >
          <Document
            file={file}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            onLoadError={console.error}
            onSourceError={console.error}
          >
            {containerWidth > 0 &&
              (isMobile ? (
                scrollColumn
              ) : (
                <div
                  className="relative select-none"
                  style={{
                    width: isDesktop ? pageW * 2 : pageW,
                    height: pageH,
                    perspective: 2400,
                    overflow: isDesktop ? "visible" : "hidden",
                    touchAction: "pan-y",
                    cursor: drag ? "grabbing" : "grab",
                    transform: `translateX(${shift}px)`,
                    transition,
                  }}
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={(e) => endGesture(e, false)}
                  onPointerCancel={(e) => endGesture(e, true)}
                  onDragStart={(e) => e.preventDefault()}
                >
                  {leaves}
                </div>
              ))}
          </Document>
        </div>

        {controls && !isMobile && (
          <IconButton
            icon="next"
            reversed
            onClick={() => changePage(1)}
            filledOnHover={!atEnd}
            className="flex-none text-white disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={atEnd}
            width="48px"
            height="48px"
          >
            {showLabels ? "Next" : ""}
          </IconButton>
        )}
      </div>

      {controls && (
        <div className="flex justify-center gap-6 pb-2">
          <div className="p-2 text-center text-white">
            {pageLabel} / {numPages}
          </div>
          {onClose && (
            <button
              className="px-4 border border-white rounded cursor-pointer hover:scale-95 transition-all duration-150 bg-black/50 backdrop-blur-md active:bg-white active:text-black active:scale-95"
              onClick={onClose}
            >
              Close
            </button>
          )}
        </div>
      )}
    </div>
  );
}
