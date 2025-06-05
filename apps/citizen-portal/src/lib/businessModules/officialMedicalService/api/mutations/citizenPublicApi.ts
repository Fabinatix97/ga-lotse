/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useMutation } from "@tanstack/react-query";

import { unwrapRawResponse } from "@eshg/lib-portal";
import { PostCitizenProcedureRequest } from "@eshg/official-medical-service-api";

import { useCitizenPublicApi } from "@/lib/businessModules/officialMedicalService/api/clients";

export function usePostCitizenProcedure() {
  const citizenPublicApi = useCitizenPublicApi();

  return useMutation({
    mutationFn: (request: PostCitizenProcedureRequest) => {
      return citizenPublicApi
        .postCitizenProcedureRaw(request)
        .then(unwrapRawResponse);
    },
  });
}
