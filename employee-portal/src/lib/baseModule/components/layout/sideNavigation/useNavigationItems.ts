/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useResolveSideNavigationItems } from "@/lib/baseModule/moduleRegister/sideNavigationItemsResolver";
import { AccessCheck } from "@/lib/shared/helpers/accessControl";
import { useAccessControl } from "@/lib/shared/hooks/useAccessControl";

import { SideNavigationItem, UseSideNavigationItemGroupsResult } from "./types";

export function filterNavigationItemsWithAccess(
  items: SideNavigationItem[],
  checkAccess: (check: AccessCheck) => boolean,
) {
  return (
    items
      // 1. Remove subItems that don't pass the check
      .map((item) => {
        if ("subItems" in item) {
          return {
            ...item,
            subItems: item.subItems.filter((subItem) =>
              checkAccess(subItem.accessCheck),
            ),
          };
        }
        return item;
      })
      // 2. Remove items that do not have any subItems anymore
      .filter((item) => {
        if ("subItems" in item) {
          return item.subItems.length > 0;
        }
        return true;
      })
      // 3. Remove items that don't pass the check
      .filter((item) => {
        if ("accessCheck" in item) {
          return checkAccess(item.accessCheck);
        }
        return true;
      })
  );
}

export function useNavigationItems(): UseSideNavigationItemGroupsResult {
  const checkAccess = useAccessControl();
  const { isLoading, itemGroups } = useResolveSideNavigationItems();

  return {
    isLoading,
    itemGroups: {
      dashboardItem: itemGroups.dashboardItem,
      businessItems: filterNavigationItemsWithAccess(
        itemGroups.businessItems,
        checkAccess,
      ),
      baseItems: filterNavigationItemsWithAccess(
        itemGroups.baseItems,
        checkAccess,
      ),
    },
  };
}
