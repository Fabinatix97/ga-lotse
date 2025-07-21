/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  NavigationItem,
  isNavigationLink,
} from "@/lib/baseModule/components/layout/types";

export function isItemSelected(
  item: NavigationItem,
  pathname: string,
): boolean {
  if (isNavigationLink(item)) {
    return pathname.startsWith(item.href);
  }

  return item.items.some((subItem) => isItemSelected(subItem, pathname));
}
