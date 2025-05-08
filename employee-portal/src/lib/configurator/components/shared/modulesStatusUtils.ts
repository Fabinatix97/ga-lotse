/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ConfiguratorStatusOverview } from "@/lib/configurator/api/models/configuratorStatusOverview";
import { ConfiguratorModuleName } from "@/lib/configurator/shared/types";

function getFilteredModules(
  data: Partial<ConfiguratorStatusOverview>,
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
  tabs: Partial<ConfiguratorStatusOverview>,
) {
  return getFilteredModules(tabs, (tabKey) => tabKey !== currentModule);
}

export function getAllWarningModules(data: ConfiguratorStatusOverview) {
  return getFilteredModules(
    data,
    (tabKey) =>
      data[tabKey as ConfiguratorModuleName].moduleState ===
      "PARTIALLY_COMPLETE",
  );
}

export function getAllErrorModules(data: ConfiguratorStatusOverview) {
  return getFilteredModules(
    data,
    (tabKey) =>
      data[tabKey as ConfiguratorModuleName].moduleState === "INCOMPLETE",
  );
}

export function isAllModulesCompleted(
  data: Partial<ConfiguratorStatusOverview>,
) {
  return Object.values(data).every(
    (module) => module.moduleState === "COMPLETE",
  );
}

export function existModuleWarning(data: Partial<ConfiguratorStatusOverview>) {
  return Object.values(data).some(
    (module) => module.moduleState === "PARTIALLY_COMPLETE",
  );
}

export function existModuleError(data: Partial<ConfiguratorStatusOverview>) {
  return Object.values(data).some(
    (module) => module.moduleState === "INCOMPLETE",
  );
}
