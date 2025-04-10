/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ConfiguratorModuleName } from "@/lib/configurator/api/models/configuratorModuleName";
import { ConfiguratorStatusOverview } from "@/lib/configurator/api/models/configuratorStatusOverview";

function getFilteredModules(
  data: ConfiguratorStatusOverview,
  condition: (value: string) => boolean,
) {
  return Object.keys(data)
    .filter(condition)
    .reduce((obj, key) => {
      return {
        ...obj,
        [key]: data[key as ConfiguratorModuleName],
      };
    }, {} as ConfiguratorStatusOverview);
}

export function getAllOtherModules(
  currentModule: ConfiguratorModuleName,
  tabs: ConfiguratorStatusOverview,
) {
  return getFilteredModules(tabs, (tabKey) => tabKey !== currentModule);
}

export function getAllWarningModules(data: ConfiguratorStatusOverview) {
  return getFilteredModules(
    data,
    (tabKey) => data[tabKey as ConfiguratorModuleName].overview === "warning",
  );
}

export function getAllErrorModules(data: ConfiguratorStatusOverview) {
  return getFilteredModules(
    data,
    (tabKey) => data[tabKey as ConfiguratorModuleName].overview === "error",
  );
}

export function isAllModulesCompleted(data: ConfiguratorStatusOverview) {
  return Object.values(data).every((module) => module.overview === "complete");
}

export function existModuleWarning(data: ConfiguratorStatusOverview) {
  return Object.values(data).some((module) => module.overview === "warning");
}

export function existModuleError(data: ConfiguratorStatusOverview) {
  return Object.values(data).some((module) => module.overview === "error");
}
