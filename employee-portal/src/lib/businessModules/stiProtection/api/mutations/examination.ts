/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiLaboratoryTestExamination,
  ApiRapidTestExamination,
} from "@eshg/employee-portal-api/stiProtection";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { useMutation } from "@tanstack/react-query";

import { useExaminationApi } from "@/lib/businessModules/stiProtection/api/clients";
import { proceduresQueryKey } from "@/lib/businessModules/stiProtection/api/queries/apiQueryKeys";

export function useUpsertRapidTest(procedureId: string) {
  const examinationApi = useExaminationApi();
  const snackbar = useSnackbar();

  return useMutation({
    mutationFn: ({ rapidTests }: { rapidTests: ApiRapidTestExamination }) =>
      examinationApi.updateRapidTestExamination(procedureId, rapidTests),
    onSuccess: () => {
      snackbar.confirmation("Die Schnelltests wurden erfolgreich gespeichert.");
    },
    onError: () => {
      snackbar.error("Die Schnelltests konnten nicht gespeichert werden.");
    },
    mutationKey: proceduresQueryKey([procedureId, "rapidTests"]),
  });
}

export function useUpsertLaboratoryTest(procedureId: string) {
  const examinationApi = useExaminationApi();
  const snackbar = useSnackbar();

  return useMutation({
    mutationFn: ({
      laboratoryTests,
    }: {
      laboratoryTests: ApiLaboratoryTestExamination;
    }) =>
      examinationApi.updateLaboratoryTestExamination(
        procedureId,
        laboratoryTests,
      ),
    onSuccess: () => {
      snackbar.confirmation("Die Labortests wurden erfolgreich gespeichert.");
    },
    onError: () => {
      snackbar.error("Die Labortests konnten nicht gespeichert werden.");
    },
    mutationKey: proceduresQueryKey([procedureId, "laboratoryTests"]),
  });
}
