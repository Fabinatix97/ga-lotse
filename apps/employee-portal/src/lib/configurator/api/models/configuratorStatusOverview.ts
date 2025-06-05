/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ConfiguratorModuleName } from "@/lib/configurator/shared/types";

import { ConfiguratorStatus } from "./configuratorTabItem";

export interface ConfiguratorStatusTab {
  endpointName: string;
  tabButtonName: string;
  link: string;
  status?: ConfiguratorStatus;
}

export type ConfiguratorStatusOverview = Partial<
  Record<
    ConfiguratorModuleName,
    {
      moduleState: ConfiguratorStatus;
      endpointStates: ConfiguratorStatusTab[];
    }
  >
>;
