/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions } from "@tanstack/react-query";

import { useCitizenAuthApi } from "@/lib/businessModules/officialMedicalService/api/clients";
import { citizenAuthApiQueryKey } from "@/lib/businessModules/officialMedicalService/api/queries/apiQueryKeys";

export function useGetProcedureDetails() {
  const citizenAuthApi = useCitizenAuthApi();
  return queryOptions({
    queryKey: citizenAuthApiQueryKey(["getProcedureDetails"]),
    queryFn: () => citizenAuthApi.getProcedureDetails(),
  });
}
