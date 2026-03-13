/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useGetSingleModuleStatus } from "@/lib/configurator/api/queries/status";
import { ConfiguratorModuleName } from "@/lib/configurator/shared/types";

export function useTabStatus({
  moduleName,
  endpointName,
}: {
  moduleName: ConfiguratorModuleName;
  endpointName: string;
}) {
  const { data } = useGetSingleModuleStatus(moduleName, endpointName);

  return {
    currentTabStatus: data.status,
  };
}
