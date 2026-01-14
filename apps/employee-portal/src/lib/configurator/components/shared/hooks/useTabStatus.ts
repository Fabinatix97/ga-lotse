/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ConfiguratorModuleName } from "@/lib/configurator/shared/types";
import { useGetSingleModuleStatus } from "@/lib/shared/api/queries/configurator/status";

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
