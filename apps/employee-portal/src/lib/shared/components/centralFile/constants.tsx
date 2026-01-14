/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import WarningIcon from "@mui/icons-material/WarningAmberOutlined";

import { TabNavigationItem } from "@eshg/lib-employee-portal";

export function updateAvailableNavItem(href: string): TabNavigationItem {
  return {
    href,
    tabButtonName: "Update",
    decorator: <WarningIcon />,
    color: "danger",
    exactMatch: true,
  };
}
