/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useWindowDimensions } from "@eshg/lib-portal/hooks/useWindowDimension";
import { useTheme } from "@mui/joy";

export function useIsMobile() {
  const { width } = useWindowDimensions();
  const theme = useTheme();
  return !!width && width <= theme.breakpoints.values.sm;
}
