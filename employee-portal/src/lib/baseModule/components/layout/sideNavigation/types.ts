/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SideNavigationItem } from "@eshg/lib-employee-portal/types/sideNavigation";

export interface SideNavItemGroups {
  dashboardItem: SideNavigationItem[];
  businessItems: SideNavigationItem[];
  baseItems: SideNavigationItem[];
}

export interface UseSideNavigationItemGroupsResult {
  isLoading: boolean;
  itemGroups: SideNavItemGroups;
}
