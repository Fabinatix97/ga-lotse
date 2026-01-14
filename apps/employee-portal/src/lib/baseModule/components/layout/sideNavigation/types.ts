/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SideNavigationItem } from "@eshg/lib-employee-portal";

export interface SideNavItemGroups {
  dashboardItem: SideNavigationItem[];
  businessItems: SideNavigationItem[];
  baseItems: SideNavigationItem[];
}
