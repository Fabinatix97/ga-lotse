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
      snackbar.confirmation("Die Schnelltests wurden erfolgreich gespeichert.");
    },
    onError: () => {
      snackbar.error("Die Schnelltests konnten nicht gespeichert werden.");
    },
    mutationKey: stiProtectionProceduresApiQueryKey(["rapidTests"]),
  });
}

export function useUpsertLaboratoryTest() {
  const examinationApi = useExaminationApi();
  const snackbar = useSnackbar();

  return useMutation({
    mutationFn: ({
      id,
      laboratoryTests,
    }: {
      id: string;
      laboratoryTests: ApiLaboratoryTestExamination;
    }) => examinationApi.updateLaboratoryTestExamination(id, laboratoryTests),
    onSuccess: () => {
      snackbar.confirmation("Die Labortests wurden erfolgreich gespeichert.");
    },
    onError: () => {
      snackbar.error("Die Labortests konnten nicht gespeichert werden.");
    },
    mutationKey: stiProtectionProceduresApiQueryKey(["laboratoryTests"]),
  });
}
