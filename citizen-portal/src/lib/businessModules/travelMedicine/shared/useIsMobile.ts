/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useWindowDimensions } from "@eshg/lib-portal/hooks/useWindowDimension";
import { useTheme } from "@mui/joy";

export function useIsMobile() {
  const { width } = useWindowDimensions();
  const theme = useTheme();
  return !!width && width <= theme.breakpoints.values.sm;
}
