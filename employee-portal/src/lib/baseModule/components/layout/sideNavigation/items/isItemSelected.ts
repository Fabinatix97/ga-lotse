/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  SideNavigationLinkItem,
  SideNavigationSubItem,
} from "@eshg/lib-employee-portal/types/sideNavigation";

export function isItemSelected(
  item: SideNavigationLinkItem | SideNavigationSubItem,
  pathname: string,
) {
  return item.href !== "/"
    ? pathname.startsWith(item.href)
    : item.href === pathname;
}
