/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
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
