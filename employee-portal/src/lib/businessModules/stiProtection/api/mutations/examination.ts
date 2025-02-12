/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { MutationPassThrough } from "@eshg/lib-portal/types/query";
import {
  ApiLaboratoryTestExamination,
  ApiRapidTestExamination,
} from "@eshg/sti-protection-api";
import { MutationOptions, useMutation } from "@tanstack/react-query";

import { useExaminationApi } from "@/lib/businessModules/stiProtection/api/clients";
import { proceduresQueryKey } from "@/lib/businessModules/stiProtection/api/queries/apiQueryKeys";

interface UpsertRapidTestParams {
  rapidTests: ApiRapidTestExamination;
}

export function useUpsertRapidTestOptions({
  procedureId,
  passThrough,
}: {
  procedureId: string;
  passThrough?: MutationPassThrough<UpsertRapidTestParams, void>;
}): MutationOptions<void, Error, UpsertRapidTestParams> {
  const examinationApi = useExaminationApi();
  const snackbar = useSnackbar();

  return {
    mutationFn: ({ rapidTests }: UpsertRapidTestParams) =>
      examinationApi.updateRapidTestExamination(procedureId, rapidTests),
    mutationKey: proceduresQueryKey([procedureId, "rapidTests"]),
    ...(passThrough ?? {
      onSuccess: () => {
        snackbar.confirmation(
          "Die Schnelltests wurden erfolgreich gespeichert.",
        );
      },
      onError: () => {
        snackbar.error("Die Schnelltests konnten nicht gespeichert werden.");
      },
    }),
  };
}

export function useUpsertRapidTests({
  procedureId,
  passThrough,
}: {
  procedureId: string;
  passThrough?: MutationPassThrough<UpsertRapidTestParams, void>;
}) {
  const options = useUpsertRapidTestOptions({ procedureId, passThrough });

  return useMutation(options);
}

interface UpsertLaboratoryTestParams {
  laboratoryTests: ApiLaboratoryTestExamination;
}

export function useUpsertLaboratoryTestOptions({
  procedureId,
  passThrough,
}: {
  procedureId: string;
  passThrough?: MutationPassThrough<UpsertLaboratoryTestParams, void>;
}): MutationOptions<void, Error, UpsertLaboratoryTestParams> {
  const examinationApi = useExaminationApi();
  const snackbar = useSnackbar();

  return {
    mutationFn: ({ laboratoryTests }: UpsertLaboratoryTestParams) =>
      examinationApi.updateLaboratoryTestExamination(
        procedureId,
        laboratoryTests,
      ),
    mutationKey: proceduresQueryKey([procedureId, "laboratoryTests"]),
    ...(passThrough ?? {
      onSuccess: () => {
        snackbar.confirmation("Die Labortests wurden erfolgreich gespeichert.");
      },
      onError: () => {
        snackbar.error("Die Labortests konnten nicht gespeichert werden.");
      },
    }),
  };
}

export function useUpsertLaboratoryTest({
  procedureId,
  passThrough,
}: {
  procedureId: string;
  passThrough?: MutationPassThrough<UpsertLaboratoryTestParams, void>;
}) {
  const options = useUpsertLaboratoryTestOptions({ procedureId, passThrough });

  return useMutation(options);
}
