/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useQueryClient } from "@tanstack/react-query";

import { unwrapRawResponse, useSnackbar } from "@eshg/lib-portal";
import { ApiConsultation } from "@eshg/prostitute-protection-api";

import { useProstituteProtectionApiClients } from "../../contexts/ProstituteProtectionApi";
import { useGetConsultationQueryOptions } from "../queries/consultation";

export function useUpsertConsultationOptions(procedureId: string) {
  const snackbar = useSnackbar();
  const { prostituteProtectionApi } = useProstituteProtectionApiClients();
  const { queryKey } = useGetConsultationQueryOptions(procedureId);
  const queryClient = useQueryClient();

  return {
    meta: { updatesQuery: queryKey },
    mutationFn: (apiConsultation: ApiConsultation) =>
      prostituteProtectionApi
        .updateConsultationRaw({ procedureId, apiConsultation })
        .then(unwrapRawResponse),
    onSuccess: (response: ApiConsultation) => {
      queryClient.setQueryData(queryKey, response);
      snackbar.confirmation("Die Beratung wurde erfolgreich geändert.");
    },
  };
}
