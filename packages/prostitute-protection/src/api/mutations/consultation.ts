/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { unwrapRawResponse, useSnackbar } from "@eshg/lib-portal";
import { UpdateConsultationRequest } from "@eshg/prostitute-protection-api";

import { useProstituteProtectionApiClients } from "../../contexts/ProstituteProtectionApi";

export function useUpsertConsultationOptions() {
  const snackbar = useSnackbar();
  const { prostituteProtectionApi } = useProstituteProtectionApiClients();

  return {
    mutationFn: (request: UpdateConsultationRequest) =>
      prostituteProtectionApi
        .updateConsultationRaw(request)
        .then(unwrapRawResponse),
    onSuccess: () => {
      snackbar.confirmation("Die Beratung wurde erfolgreich geändert.");
    },
  };
}
