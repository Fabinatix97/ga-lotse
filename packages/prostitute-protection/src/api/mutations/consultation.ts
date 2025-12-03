/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MutationOptions } from "@tanstack/react-query";

import { useSnackbar } from "@eshg/lib-portal";
import { ApiConsultation } from "@eshg/prostitute-protection-api";

import { useProstituteProtectionApiClients } from "../../contexts/ProstituteProtectionApi";
import { proceduresQueryKey } from "../queries/apiQueryKeys";

export function useUpsertConsultationOptions({
  procedureId,
}: {
  procedureId: string;
}): MutationOptions<ApiConsultation, Error, ApiConsultation> {
  const snackbar = useSnackbar();
  const { prostituteProtectionApi } = useProstituteProtectionApiClients();

  return {
    mutationFn: (consultation: ApiConsultation) =>
      prostituteProtectionApi.updateConsultation(procedureId, consultation),
    mutationKey: proceduresQueryKey([procedureId, "consultation"]),
    onSuccess: () => {
      snackbar.confirmation("Die Konsultation wurde erfolgreich gespeichert.");
    },
  };
}
