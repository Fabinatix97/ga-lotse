/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ConfiguratorModuleName } from "./configuratorModuleName";
import { ConfiguratorStatus } from "./configuratorTabItem";

export interface ConfiguratorStatusTab {
  tabButtonName: string;
  link: string;
  status: ConfiguratorStatus;
}

export type ConfiguratorStatusOverview = Record<
  ConfiguratorModuleName,
  {
    overview: ConfiguratorStatus;
    tabs: ConfiguratorStatusTab[];
  }
>;
