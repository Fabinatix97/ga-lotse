/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import WarningIcon from "@mui/icons-material/WarningAmberOutlined";

import { TabNavigationItem } from "@/lib/shared/components/tabNavigation/types";

export function updateAvailableNavItem(href: string): TabNavigationItem {
  return {
    href,
    tabButtonName: "Update",
    decorator: <WarningIcon />,
    color: "danger",
    exactMatch: true,
  };
}
