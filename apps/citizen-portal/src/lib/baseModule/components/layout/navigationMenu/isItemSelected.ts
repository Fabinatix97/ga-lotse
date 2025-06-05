/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  NavigationItem,
  SubNavigationItem,
} from "@/lib/baseModule/components/layout/types";

export function isSubItemSelected(
  subItem: SubNavigationItem,
  pathname: string,
) {
  return subItem.href !== "/"
    ? pathname.startsWith(subItem.href)
    : subItem.href === pathname;
}

export function isItemSelected(item: NavigationItem, pathname: string) {
  return item.subItems.some((subItem) => isSubItemSelected(subItem, pathname));
}
