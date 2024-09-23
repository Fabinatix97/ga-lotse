/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  SideNavigationItemWithoutSubItems,
  SideNavigationSubItem,
} from "./types";

export function isItemSelected(
  item: SideNavigationItemWithoutSubItems | SideNavigationSubItem,
  pathname: string,
) {
  return item.href !== "/"
    ? pathname.startsWith(item.href)
    : item.href === pathname;
}
