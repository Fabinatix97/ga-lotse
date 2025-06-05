/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { styled } from "@mui/joy";
import { SxProps, Theme } from "@mui/joy/styles/types";

import {
  contentMarginDesktop,
  contentMarginMobile,
  maxContentWidthDesktop,
} from "@/lib/baseModule/components/layout/sizes";
import { MobileBreakpoint } from "@/lib/shared/breakpoints";

declare module "@mui/system" {
  interface BreakpointOverrides {
    xxs: true;
    xxl: true;
  }
}

const customProps = ["spacing", "spaceContentToSide", "fullHeight"];

interface PageContentProps {
  spacing?: "md" | "lg";
  spaceContentToSide?: boolean;
  fullHeight?: boolean;
}

export const PageContent = styled("div", {
  shouldForwardProp: filterCustomProps,
})<PageContentProps>(({ theme, spacing, spaceContentToSide, fullHeight }) => ({
  flex: fullHeight ? 1 : undefined,
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(spacing === "lg" ? 5 : contentMarginDesktop.topBottom),
  paddingBlock: theme.spacing(
    spacing === "lg" ? 5 : contentMarginDesktop.topBottom,
  ),
  paddingInline: 0,
  ...responsiveContent(theme, {
    [MobileBreakpoint.Down]: {
      gap: theme.spacing(contentMarginMobile.topBottom),
      paddingBlock: theme.spacing(contentMarginMobile.topBottom),
      paddingInline: spaceContentToSide
        ? theme.spacing(contentMarginMobile.leftRight)
        : 0,
    },
  }),
}));

function filterCustomProps(propName: string): boolean {
  return !customProps.includes(propName);
}

const ContentBreakpoints = {
  XL: "xl",
  LG: "lg",
  MD: "md",
  SM: "sm",
} as const;
type ContentBreakpoints =
  (typeof ContentBreakpoints)[keyof typeof ContentBreakpoints];

export function responsiveContent(
  theme: Theme,
  additionalStyles: Partial<Record<ContentBreakpoints, SxProps>> = {},
) {
  return {
    width: maxContentWidthDesktop,
    [theme.breakpoints.down(ContentBreakpoints.XL)]: {
      width: "1152px",
      ...additionalStyles[ContentBreakpoints.XL],
    },
    [theme.breakpoints.down(ContentBreakpoints.LG)]: {
      width: "960px",
      ...additionalStyles[ContentBreakpoints.LG],
    },
    [theme.breakpoints.down(ContentBreakpoints.MD)]: {
      width: "100%",
      ...additionalStyles[ContentBreakpoints.MD],
    },
    [theme.breakpoints.down(ContentBreakpoints.SM)]: {
      ...additionalStyles[ContentBreakpoints.SM],
    },
  } satisfies SxProps;
}
