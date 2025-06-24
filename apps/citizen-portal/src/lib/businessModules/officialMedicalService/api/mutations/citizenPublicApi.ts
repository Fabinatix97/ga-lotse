/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { unwrapRawResponse } from "@eshg/lib-portal";
import { PostCitizenProcedureRequest } from "@eshg/official-medical-service-api";

import { useCitizenPublicApi } from "@/lib/businessModules/officialMedicalService/api/clients";
import { isConcurrentAppointmentError } from "@/lib/businessModules/officialMedicalService/api/helpers";
import { citizenPublicApiQueryKey } from "@/lib/businessModules/officialMedicalService/api/queries/apiQueryKeys";

export function usePostCitizenProcedure() {
  const citizenPublicApi = useCitizenPublicApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: PostCitizenProcedureRequest) => {
      return citizenPublicApi
        .postCitizenProcedureRaw(request)
        .then(unwrapRawResponse);
    },
    onError: async (error) => {
      if (isConcurrentAppointmentError(error)) {
        await queryClient.invalidateQueries({
          queryKey: citizenPublicApiQueryKey(["getFreeAppointmentsForCitizen"]),
        });
      }
    },
  });
}
