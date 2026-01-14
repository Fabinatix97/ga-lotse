/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEnvironmentIndicatorHeight } from "@eshg/lib-portal";

import { useOfflineIndicatorHeight } from "../components/OfflineIndicator";
import { useLayoutConfig } from "../contexts/layoutConfig";

export function useHeaderHeights() {
  const environmentIndicatorHeight = useEnvironmentIndicatorHeight();
  const offlineIndicatorHeight = useOfflineIndicatorHeight();
  const { appBarHeightMobile, appBarHeightDesktop } = useLayoutConfig();

  return {
    headerHeightMobile: `calc(${environmentIndicatorHeight} + ${offlineIndicatorHeight} + ${appBarHeightMobile})`,
    headerHeightDesktop: `calc(${environmentIndicatorHeight} + ${offlineIndicatorHeight}  + ${appBarHeightDesktop})`,
  };
}
