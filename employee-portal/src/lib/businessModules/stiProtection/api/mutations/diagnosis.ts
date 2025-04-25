/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MutationOptions, useMutation } from "@tanstack/react-query";

import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { MutationPassThrough } from "@eshg/lib-portal/types/query";
import { ApiDiagnosis } from "@eshg/sti-protection-api";

import { useDiagnosisApi } from "@/lib/businessModules/stiProtection/api/clients";
import { proceduresQueryKey } from "@/lib/businessModules/stiProtection/api/queries/apiQueryKeys";

interface UpsertDiagnosisParams {
  diagnosis: ApiDiagnosis;
}

export function useUpsertDiagnosisOptions({
  procedureId,
  passThrough,
}: {
  procedureId: string;
  passThrough?: MutationPassThrough<UpsertDiagnosisParams, void>;
}): MutationOptions<void, Error, UpsertDiagnosisParams> {
  const diagnosisApi = useDiagnosisApi();
  const snackbar = useSnackbar();

  return {
    mutationFn: ({ diagnosis }: UpsertDiagnosisParams) =>
      diagnosisApi.updateDiagnosis(procedureId, diagnosis),
    mutationKey: proceduresQueryKey([procedureId, "diagnosis"]),
    ...(passThrough ?? {
      onSuccess: () => {
        snackbar.confirmation("Die Diagnose wurde erfolgreich gespeichert.");
      },
      onError: () => {
        snackbar.error("Die Diagnose konnte nicht gespeichert werden.");
      },
    }),
  };
}

export function useUpsertDiagnosis({
  procedureId,
  passThrough,
}: {
  procedureId: string;
  passThrough?: MutationPassThrough<UpsertDiagnosisParams, void>;
}) {
  const options = useUpsertDiagnosisOptions({ procedureId, passThrough });

  return useMutation(options);
}
