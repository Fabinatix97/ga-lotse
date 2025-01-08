/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useEnvironmentIndicatorHeight } from "@eshg/lib-portal/components/EnvironmentIndicator";

import {
  appBarHeightDesktop,
  appBarHeightMobile,
} from "@/lib/baseModule/components/layout/sizes";

export function useHeaderHeights() {
  const environmentIndicatorHeight = useEnvironmentIndicatorHeight();

  return {
    headerHeightMobile: `calc(${environmentIndicatorHeight} + ${appBarHeightMobile})`,
    headerHeightDesktop: `calc(${environmentIndicatorHeight} + ${appBarHeightDesktop})`,
  };
}
