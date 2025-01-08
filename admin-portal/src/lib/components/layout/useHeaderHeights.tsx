/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useEnvironmentIndicatorHeight } from "@eshg/lib-portal/components/EnvironmentIndicator";

import {
  appBarHeightDesktop,
  appBarHeightMobile,
} from "@/lib/components/layout/theme/sizes";

export function useHeaderHeights() {
  const environmentIndicatorHeight = useEnvironmentIndicatorHeight();

  return {
    headerHeightMobile: `calc(${environmentIndicatorHeight} + ${appBarHeightMobile})`,
    headerHeightDesktop: `calc(${environmentIndicatorHeight} + ${appBarHeightDesktop})`,
  };
}
