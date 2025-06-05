/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEnvironmentIndicatorHeight } from "@eshg/lib-portal";

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
