/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHandledBackgroundQuery } from "@eshg/lib-portal/api/useHandledBackgroundQuery";

import { useProcedureStepApi } from "@/lib/businessModules/travelMedicine/api/clients";
import { procedureStepsApiQueryKey } from "@/lib/businessModules/travelMedicine/api/queries/queryKeys";

export function useGetProcedureStepServices(
  procedureStepId: string,
  open: boolean,
) {
  const procedureStepApi = useProcedureStepApi();
  return useHandledBackgroundQuery({
    queryKey: procedureStepsApiQueryKey([
      "getProcedureStepServices",
      procedureStepId,
    ]),
    queryFn: () => procedureStepApi.getProcedureStepServices(procedureStepId),
    enabled: procedureStepId.length > 0 && open,
    gcTime: 60000,
    staleTime: 60000,
  });
}
