/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ConfiguratorModuleName } from "@/lib/configurator/api/models/configuratorModuleName";
import { useGetModuleStatus } from "@/lib/configurator/api/queries/useGetModuleStatus";

export function useTabStatus({
  moduleName,
  tabButtonName,
}: {
  moduleName: ConfiguratorModuleName;
  tabButtonName: string;
}) {
  const allStatuses = useGetModuleStatus().data;

  function getCurrentTabStatus() {
    return allStatuses[moduleName].tabs.find(
      (tab) => tab.tabButtonName === tabButtonName,
    )!.status;
  }

  return {
    currentTabStatus: getCurrentTabStatus(),
  };
}
