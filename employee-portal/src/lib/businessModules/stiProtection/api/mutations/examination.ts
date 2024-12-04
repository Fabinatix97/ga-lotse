/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiRapidTestExamination } from "@eshg/employee-portal-api/stiProtection";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { useMutation } from "@tanstack/react-query";

import { useExaminationApi } from "@/lib/businessModules/stiProtection/api/clients";
import { stiProtectionProceduresApiQueryKey } from "@/lib/businessModules/stiProtection/api/queries/apiQueryKeys";

export function useUpsertRapidTest() {
  const examinationApi = useExaminationApi();
  const snackbar = useSnackbar();

  return useMutation({
    mutationFn: ({
      id,
      rapidTests,
    }: {
      id: string;
      rapidTests: ApiRapidTestExamination;
    }) => examinationApi.updateRapidTestExamination(id, rapidTests),
    onSuccess: () => {
      snackbar.confirmation(
        "Die Schnelltests wurden erfolgreich aktualisiert.",
      );
    },
    onError: () => {
      snackbar.error("Die Schnelltests konnte nicht aktualisiert werden.");
    },
    mutationKey: stiProtectionProceduresApiQueryKey(["rapidTests"]),
  });
}
