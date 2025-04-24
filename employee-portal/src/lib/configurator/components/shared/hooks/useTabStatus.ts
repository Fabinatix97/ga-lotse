/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ConfiguratorModuleName } from "@/lib/configurator/api/models/configuratorModuleName";
import { TabEndpointName } from "@/lib/configurator/api/models/configuratorStatusOverview";
import { useGetSingleModuleStatus } from "@/lib/configurator/api/queries/useGetSingleModuleStatus";

export function useTabStatus({
  moduleName,
  endpointName,
}: {
  moduleName: ConfiguratorModuleName;
  endpointName: TabEndpointName;
}) {
  const { data } = useGetSingleModuleStatus(moduleName, endpointName);

  return {
    currentTabStatus: data.status,
  };
}
