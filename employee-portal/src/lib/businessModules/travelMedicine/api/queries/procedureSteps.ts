/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { queryOptions } from "@tanstack/react-query";

import { useProcedureStepApi } from "@/lib/businessModules/travelMedicine/api/clients";
import { procedureStepsApiQueryKey } from "@/lib/businessModules/travelMedicine/api/queries/queryKeys";

export function useGetProcedureStepServicesQuery(procedureStepId: string) {
  const procedureStepApi = useProcedureStepApi();
  return queryOptions({
    queryKey: procedureStepsApiQueryKey([
      "getProcedureStepServices",
      procedureStepId,
    ]),
    queryFn: () => procedureStepApi.getProcedureStepServices(procedureStepId),
    select: (response) => response.procedureStepServices ?? [],
  });
}
