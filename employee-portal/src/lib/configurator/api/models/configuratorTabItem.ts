/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiConfigurationStatus } from "@eshg/base-api";
import { TabNavigationItem } from "@eshg/lib-employee-portal";

export type ConfiguratorStatus = ApiConfigurationStatus;

export type configuratorTabItem = Pick<
  TabNavigationItem,
  "tabButtonName" | "href"
> & {
  status: ConfiguratorStatus;
};
