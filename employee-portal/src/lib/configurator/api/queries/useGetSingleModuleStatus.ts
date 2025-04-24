/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import { ConfiguratorModuleName } from "@/lib/configurator/api/models/configuratorModuleName";
import { TabEndpointName } from "@/lib/configurator/api/models/configuratorStatusOverview";

import { useGetModuleStatusUtils } from "./shared/useGetModuleStatusUtils";

export function useGetSingleModuleStatus(
  moduleName: ConfiguratorModuleName,
  endpointName: TabEndpointName,
) {
  const { createQuery } = useGetModuleStatusUtils();

  const query = useSuspenseQuery({
    ...createQuery(moduleName),
    select: (result) => {
      return {
        endpointName,
        status: result.endpointStates[endpointName],
      };
    },
  });
  return query;
}
