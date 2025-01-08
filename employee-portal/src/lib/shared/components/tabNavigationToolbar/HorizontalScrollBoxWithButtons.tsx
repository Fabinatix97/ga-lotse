/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Box, IconButton, styled } from "@mui/joy";
import { PropsWithChildren, useCallback, useEffect, useRef } from "react";

type Direction = -1 | 1;
const SCROLL_SPEED = 4; // pixels per frame @ 60PFS
const START_CLASS = "scroll-position-start";
const END_CLASS = "scroll-position-end";
const FADE_WIDTH = "2rem";

// This box allows horizontal scrolling with two buttons at the edges that are
// hidden if we can't scroll in that direction.
// Use an IntersectionObserver to check if divs at the start and end of the
// content are visible and apply css classes `scroll-position-start` and
// `scroll-position-end` to the container.
// These classes are used to hide the buttons and enabled a fade-effect.
export function HorizontalScrollBoxWithButtons({
  children,
}: PropsWithChildren) {
  const outerBoxRef = useRef<HTMLDivElement>(null);
  const scrollBoxRef = useRef<HTMLDivElement>(null);
  const startRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startScroll = useCallback((direction: Direction) => {
    scrollBoxRef.current?.scrollBy(direction * SCROLL_SPEED, 0);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      startScroll(direction);
    }, 1000 / 60);
  }, []);

  const endScroll = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    function createObserver(cssClass: string) {
      return new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            outerBoxRef.current?.classList.add(cssClass);
            // The scroll button might have vanished under the cursor. Stop scrolling.
            endScroll();
          } else {
            outerBoxRef.current?.classList.remove(cssClass);
          }
        },
        {
          root: scrollBoxRef.current,
        },
      );
    }
    const startObserver = createObserver(START_CLASS);
    const endObserver = createObserver(END_CLASS);

    startObserver.observe(startRef.current!);
    endObserver.observe(endRef.current!);

    return () => {
      startObserver.disconnect();
      endObserver.disconnect();
    };
  }, [endScroll]);

  return (
    <Box
      ref={outerBoxRef}
      sx={{
        display: "flex",
        height: "100%",
        position: "relative",
        [`&:not(.${START_CLASS}):not(.${END_CLASS})`]: {
          // can scroll left and right
          "& > div": {
            maskImage: `linear-gradient(to right, transparent, transparent ${FADE_WIDTH}, black calc(2 * ${FADE_WIDTH}), black calc(100% - 2 * ${FADE_WIDTH}), transparent calc(100% - ${FADE_WIDTH}), transparent)`,
          },
        },
        [`&.${START_CLASS}:not(.${END_CLASS})`]: {
          // can only scroll right
          "& > div": {
            maskImage: `linear-gradient(to right, black, black calc(100% - 2 * ${FADE_WIDTH}), transparent calc(100% - ${FADE_WIDTH}), transparent)`,
          },
          "& > button:first-child": {
            display: "none",
          },
        },
        [`&:not(.${START_CLASS}).${END_CLASS}`]: {
          // can only scroll left
          "& > div": {
            maskImage: `linear-gradient(to right, transparent, transparent ${FADE_WIDTH}, black calc(2 * ${FADE_WIDTH}), black)`,
          },
          "& > button:last-child": {
            display: "none",
          },
        },
        [`&.${START_CLASS}.${END_CLASS}`]: {
          // cannot scroll
          "& > button": {
            display: "none",
          },
        },
      }}
    >
      <ScrollButton dir={-1} startScroll={startScroll} endScroll={endScroll} />
      <Box
        ref={scrollBoxRef}
        sx={{
          // allow horizontal scrolling
          overflowX: "auto",
          // take up all the remaining vertical space
          flexGrow: 1,
          // centered content
          display: "flex",
          alignItems: "center",
          // hide scrollbar
          scrollbarWidth: "none",
        }}
      >
        <EdgeSensor ref={startRef} />
        {children}
        <EdgeSensor ref={endRef} />
      </Box>
      <ScrollButton dir={1} startScroll={startScroll} endScroll={endScroll} />
    </Box>
  );
}

const EdgeSensor = styled(Box)(() => ({
  opacity: 0,
  flex: "0 0 2px",
  ml: "-1px",
  mr: "-1px",
  height: 1,
}));

// Button that behaves like a native scrollbar button, i.e. scroll as long as
// the user holds the mouse button down.
function ScrollButton({
  dir,
  startScroll,
  endScroll,
}: {
  dir: Direction;
  startScroll: (dir: Direction) => void;
  endScroll: () => void;
}) {
  const Icon = dir < 0 ? ChevronLeft : ChevronRight;
  const label = dir < 0 ? "Links scrollen" : "Rechts scrollen";
  const sx = {
    position: "absolute",
    zIndex: 2,
    left: dir < 0 ? 0 : "auto",
    right: dir < 0 ? "auto" : 0,
    top: 0,
    bottom: 0,
    marginTop: "auto",
    marginBottom: "auto",
  };
  return (
    <IconButton
      variant="plain"
      sx={sx}
      disabled={false}
      aria-label={label}
      onMouseDown={() => startScroll(dir)}
      onMouseUp={endScroll}
      onMouseLeave={endScroll}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }}
      onTouchStart={() => startScroll(dir)}
      onTouchEnd={endScroll}
      onTouchCancel={endScroll}
      onKeyDown={(e) => ["Enter", " "].includes(e.key) && startScroll(dir)}
      onKeyUp={endScroll}
    >
      <Icon size="lg" color="neutral" />
    </IconButton>
  );
}
