/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box, useTheme } from "@mui/joy";
import { SxProps, Theme } from "@mui/joy/styles/types";
import { PropsWithChildren } from "react";

import {
  contentMarginDesktop,
  contentMarginMobile,
  maxContentWidthDesktop,
} from "./sizes";

declare module "@mui/system" {
  interface BreakpointOverrides {
    xxs: true;
    xxl: true;
  }
}

export function Content({ children }: PropsWithChildren) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        justifyContent: "center",
        boxSizing: "content-box",
      }}
    >
      <Box
        sx={{
          margin: theme.spacing(
            contentMarginDesktop.topBottom,
            contentMarginDesktop.leftRight,
          ),
          ...responsiveContent(theme, {
            sm: {
              margin: theme.spacing(
                contentMarginMobile.topBottom,
                contentMarginMobile.leftRight,
              ),
            },
          }),
        }}
      >
        {children}
      </Box>
    </Box>
  );
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
