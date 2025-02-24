/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEnvironmentIndicatorHeight } from "@eshg/lib-portal/components/EnvironmentIndicator";

import { useLayoutConfig } from "@/contexts/layoutConfig";

export function useHeaderHeights() {
  const environmentIndicatorHeight = useEnvironmentIndicatorHeight();
  const { appBarHeightMobile, appBarHeightDesktop } = useLayoutConfig();

  return {
    headerHeightMobile: `calc(${environmentIndicatorHeight} + ${appBarHeightMobile})`,
    headerHeightDesktop: `calc(${environmentIndicatorHeight} + ${appBarHeightDesktop})`,
  };
}
