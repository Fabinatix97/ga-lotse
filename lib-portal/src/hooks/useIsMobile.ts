/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useTheme } from "@mui/joy";

import { useWindowDimensions } from "./useWindowDimension";

export function useIsMobile() {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  return width !== undefined && width <= theme.breakpoints.values.sm;
}
