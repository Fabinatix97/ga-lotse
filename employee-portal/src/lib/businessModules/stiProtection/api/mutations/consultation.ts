/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MutationOptions, useMutation } from "@tanstack/react-query";

import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { MutationPassThrough } from "@eshg/lib-portal/types/query";
import { ApiConsultation } from "@eshg/sti-protection-api";

import { useConsultationApi } from "@/lib/businessModules/stiProtection/api/clients";
import { proceduresQueryKey } from "@/lib/businessModules/stiProtection/api/queries/apiQueryKeys";

interface UpsertConsultationParams {
  consultation: ApiConsultation;
}

export function useUpsertConsultationOptions({
  procedureId,
  passThrough,
}: {
  procedureId: string;
  passThrough?: MutationPassThrough<UpsertConsultationParams, void>;
}): MutationOptions<void, Error, UpsertConsultationParams> {
  const consultationApi = useConsultationApi();
  const snackbar = useSnackbar();

  return {
    mutationFn: ({ consultation }: UpsertConsultationParams) =>
      consultationApi.updateConsultation(procedureId, consultation),
    mutationKey: proceduresQueryKey([procedureId, "consultation"]),
    ...(passThrough ?? {
      onSuccess: () => {
        snackbar.confirmation(
          "Die Konsultation wurde erfolgreich gespeichert.",
        );
      },
      onError: () => {
        snackbar.error("Die Konsultation konnte nicht gespeichert werden.");
      },
    }),
  };
}

export function useUpsertConsultation({
  procedureId,
  passThrough,
}: {
  procedureId: string;
  passThrough?: MutationPassThrough<UpsertConsultationParams, void>;
}) {
  const options = useUpsertConsultationOptions({ procedureId, passThrough });

  return useMutation(options);
}
