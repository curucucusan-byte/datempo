"use client";

import React, {
  ForwardedRef,
  ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";

type VerticalFAQCarouselProps = {
  items: ReactNode[];
  speed?: number; // pixels per second
  pauseOnHover?: boolean;
  className?: string;
};

type CarouselHandle = {
  pause: () => void;
  play: () => void;
};

function useLatest<T>(value: T) {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref;
}

const VerticalFAQCarousel = forwardRef(function VerticalFAQCarousel(
  { items, speed = 24, pauseOnHover = true, className }: VerticalFAQCarouselProps,
  ref: ForwardedRef<CarouselHandle>,
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const pausedRef = useRef(false);
  const userPausedRef = useRef(false);
  const wheelTimeoutRef = useRef<number | null>(null);
  const pointerDataRef = useRef<{ startY: number; scrollTop: number } | null>(null);
  const itemsRef = useLatest(items);
  const scrollOffsetRef = useRef(0);

  const loopCount = Math.max(3, Math.ceil(8 / Math.max(items.length || 1, 1)));
  const loopCountRef = useRef(loopCount);
  loopCountRef.current = loopCount;

  const renderedItems = useMemo(() => {
    if (items.length === 0) return [];
    return Array.from({ length: loopCount }, () => items).flat();
  }, [items, loopCount]);

  const resetLoop = useCallback((el: HTMLDivElement) => {
    const segments = loopCountRef.current;
    if (!segments) return;
    const segmentHeight = el.scrollHeight / segments;
    if (segmentHeight <= 0) return;

    while (scrollOffsetRef.current >= segmentHeight) {
      scrollOffsetRef.current -= segmentHeight;
    }

    while (scrollOffsetRef.current < 0) {
      scrollOffsetRef.current += segmentHeight;
    }

    el.scrollTop = scrollOffsetRef.current;
  }, []);

  const step = useCallback(
    (time: number) => {
      const el = containerRef.current;
      if (!el) return;

      if (pausedRef.current || userPausedRef.current) {
        lastTimeRef.current = time;
        rafRef.current = window.requestAnimationFrame(step);
        return;
      }

      if (itemsRef.current.length === 0) {
        rafRef.current = window.requestAnimationFrame(step);
        return;
      }

      if (lastTimeRef.current == null) {
        lastTimeRef.current = time;
      }
      const deltaSeconds = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;
      scrollOffsetRef.current += speed * deltaSeconds;
      el.scrollTop = scrollOffsetRef.current;
      resetLoop(el);
      rafRef.current = window.requestAnimationFrame(step);
    },
    [resetLoop, speed, itemsRef],
  );

  const startAnimation = useCallback(() => {
    if (rafRef.current) {
      window.cancelAnimationFrame(rafRef.current);
    }
    lastTimeRef.current = null;
    rafRef.current = window.requestAnimationFrame(step);
  }, [step]);

  useImperativeHandle(ref, () => ({
    pause: () => {
      pausedRef.current = true;
    },
    play: () => {
      pausedRef.current = false;
      lastTimeRef.current = null;
      startAnimation();
    },
  }));

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTop = 0;
    scrollOffsetRef.current = 0;
    pausedRef.current = false;
    userPausedRef.current = false;
    startAnimation();

    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      if (wheelTimeoutRef.current) window.clearTimeout(wheelTimeoutRef.current);
    };
  }, [items, startAnimation]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateOffsetFromDom = () => {
      const elInner = containerRef.current;
      if (!elInner) return;
      scrollOffsetRef.current = elInner.scrollTop;
    };

    const resumeAfterDelay = () => {
      if (wheelTimeoutRef.current) window.clearTimeout(wheelTimeoutRef.current);
      wheelTimeoutRef.current = window.setTimeout(() => {
        userPausedRef.current = false;
        lastTimeRef.current = null;
        updateOffsetFromDom();
      }, 1200);
    };

    const handleMouseEnter = () => {
      if (pauseOnHover) {
        userPausedRef.current = true;
      }
    };
    const handleMouseLeave = () => {
      if (pauseOnHover) {
        userPausedRef.current = false;
        lastTimeRef.current = null;
        updateOffsetFromDom();
      }
    };
    const handleWheel = () => {
      userPausedRef.current = true;
      updateOffsetFromDom();
      resumeAfterDelay();
    };

    const handlePointerDown = (event: PointerEvent) => {
      pointerDataRef.current = {
        startY: event.clientY,
        scrollTop: el.scrollTop,
      };
      userPausedRef.current = true;
      updateOffsetFromDom();
      try {
        el.setPointerCapture?.(event.pointerId);
      } catch {
        // noop
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      const data = pointerDataRef.current;
      if (!data) return;
      const delta = data.startY - event.clientY;
      el.scrollTop = data.scrollTop + delta;
      updateOffsetFromDom();
      resetLoop(el);
    };

    const clearPointer = (event: PointerEvent) => {
      pointerDataRef.current = null;
      userPausedRef.current = false;
      lastTimeRef.current = null;
      updateOffsetFromDom();
      try {
        el.releasePointerCapture?.(event.pointerId);
      } catch {
        // noop
      }
      resumeAfterDelay();
    };

    const handlePointerCancel = clearPointer;

    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mouseleave", handleMouseLeave);
    el.addEventListener("wheel", handleWheel, { passive: true });
    el.addEventListener("pointerdown", handlePointerDown);
    el.addEventListener("pointerup", clearPointer);
    el.addEventListener("pointercancel", handlePointerCancel);
    el.addEventListener("pointerleave", handlePointerCancel);
    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mouseleave", handleMouseLeave);
      el.removeEventListener("wheel", handleWheel);
      el.removeEventListener("pointerdown", handlePointerDown);
      el.removeEventListener("pointerup", clearPointer);
      el.removeEventListener("pointercancel", handlePointerCancel);
      el.removeEventListener("pointerleave", handlePointerCancel);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [pauseOnHover, resetLoop]);

  const style: React.CSSProperties = {
    maxWidth: "532px",
    width: "100%",
    aspectRatio: "532 / 426",
  };

  return (
    <div className={className} style={style}>
      <div
        ref={containerRef}
        className="relative h-full w-full overflow-hidden rounded-2xl"
        role="list"
        tabIndex={0}
        aria-label="Carrossel de exemplos do FAQ"
      >
        <div className="flex h-full w-full flex-col" aria-hidden={items.length === 0}>
          {renderedItems.map((node, index) => (
            <div
              key={index}
              className="min-h-[106px] shrink-0 rounded-xl border border-white/10 bg-slate-800/60 px-4 py-3 text-xs text-slate-300"
              role="listitem"
            >
              {node}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export type { CarouselHandle };
export default VerticalFAQCarousel;
