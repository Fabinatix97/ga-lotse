/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useQuery } from "@tanstack/react-query";

import { useProcedureStepApi } from "@/lib/businessModules/travelMedicine/api/clients";
import { procedureStepsApiQueryKey } from "@/lib/businessModules/travelMedicine/api/queries/queryKeys";

export function useGetProcedureStepServices(procedureStepId: string) {
  const procedureStepApi = useProcedureStepApi();
  return useQuery({
    queryKey: procedureStepsApiQueryKey([
      "getProcedureStepServices",
      procedureStepId,
    ]),
    queryFn: () => procedureStepApi.getProcedureStepServices(procedureStepId),
    enabled: procedureStepId.length > 0,
  });
}
