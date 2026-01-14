/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { AccessCheck, SideNavigationItem } from "@eshg/lib-employee-portal";

export function filterNavigationItemsWithAccess(
  items: SideNavigationItem[],
  checkAccess: (check: AccessCheck) => boolean,
): SideNavigationItem[] {
  function removeRestrictedSubItems(
    item: SideNavigationItem,
  ): SideNavigationItem {
    if (item.type === "SideNavigationParentItem") {
      return {
        ...item,
        subItems: item.subItems.filter((subItem) =>
          checkAccess(subItem.accessCheck),
        ),
      };
    }
    return item;
  }

  function nonEmptyItem(item: SideNavigationItem): boolean {
    if (item.type === "SideNavigationParentItem") {
      return item.subItems.length > 0;
    }
    return true;
  }

  function permittedItem(item: SideNavigationItem): boolean {
    if (
      item.type === "SideNavigationLinkItem" ||
      item.type === "SideNavigationSuspenseItem"
    ) {
      return checkAccess(item.accessCheck);
    }
    return true;
  }

  return items
    .map(removeRestrictedSubItems)
    .filter(nonEmptyItem)
    .filter(permittedItem);
}
