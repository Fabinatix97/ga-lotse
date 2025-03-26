/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { TabNavigationItem } from "@eshg/lib-employee-portal";

export type ConfiguratorStatus = "complete" | "warning" | "error";

export type ConfigurationTabItem = Pick<
  TabNavigationItem,
  "tabButtonName" | "href"
> & {
  status: ConfiguratorStatus;
};
