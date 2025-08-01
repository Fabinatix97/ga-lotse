/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useSuspenseQuery } from "@tanstack/react-query";

import { useConfigApi } from "@/lib/businessModules/inspection/api/clients";

import { configuratorApiQueryKey } from "./apiQueryKey";

export function useGetInspectionConfig() {
  const inspectionApi = useConfigApi();
  return useSuspenseQuery({
    queryKey: configuratorApiQueryKey([
      "getInspectionPropertiesConfig",
      inspectionApi,
    ]),
    queryFn: () => inspectionApi.getInspectionPropertiesConfig(),
  });
}
