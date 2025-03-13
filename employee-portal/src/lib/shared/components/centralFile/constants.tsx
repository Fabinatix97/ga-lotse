/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { TabNavigationItem } from "@eshg/lib-employee-portal";
import WarningIcon from "@mui/icons-material/WarningAmberOutlined";

export function updateAvailableNavItem(href: string): TabNavigationItem {
  return {
    href,
    tabButtonName: "Update",
    decorator: <WarningIcon />,
    color: "danger",
    exactMatch: true,
  };
}
