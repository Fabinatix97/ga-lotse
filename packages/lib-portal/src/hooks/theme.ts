/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Theme, useTheme } from "@mui/joy";

import { useWindowDimensions } from "./useWindowDimension";

export function useIsBreakpointDown(
  breakpoint: keyof Theme["breakpoints"]["values"],
) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  return width !== undefined && width <= theme.breakpoints.values[breakpoint];
}

export function useIsMobile() {
  return useIsBreakpointDown("md");
}
