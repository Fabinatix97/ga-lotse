/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { CssVarsThemeOptions } from "@mui/joy/styles";

declare module "@mui/joy/styles" {
  interface BreakpointOverrides {
    xxs: true;
    xxl: true;
  }
}

export const customBreakpoints = {
  values: {
    xxs: 0,
    xs: 640,
    sm: 768,
    md: 1024,
    lg: 1280,
    xl: 1440,
    xxl: 1728,
  },
  unit: "px",
} satisfies CssVarsThemeOptions["breakpoints"];
