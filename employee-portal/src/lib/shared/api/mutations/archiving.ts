/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { formatList } from "@eshg/lib-employee-portal";
import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { ApiArchivingRelevance, ArchivingApi } from "@eshg/lib-procedures-api";

type UseBulkUpdateProceduresArchivingRelevanceResult = ReturnType<
  typeof useBulkUpdateProceduresArchivingRelevanceTemplate
>;
export type UseBulkUpdateProceduresArchivingRelevance =
  () => UseBulkUpdateProceduresArchivingRelevanceResult;

export function useBulkUpdateProceduresArchivingRelevanceTemplate(
  useArchivingApi: () => Pick<
    ArchivingApi,
    "bulkUpdateProceduresArchivingRelevance"
  >,
) {
  const snackbar = useSnackbar();
  const archiving = useArchivingApi();

  return useHandledMutation({
    mutationFn: async ({
      procedureIds,
      archivingRelevance,
    }: {
      procedureIds: string[];
      archivingRelevance: ApiArchivingRelevance;
    }) =>
      archiving.bulkUpdateProceduresArchivingRelevance({
        procedures: new Set(procedureIds),
        archivingRelevance,
      }),
    onSuccess: (data) => {
      const { updatedProcedures, failedProcedures, archivingRelevance } = data;
      const updatedProceduresCount = Array.from(updatedProcedures).length;
      const failedProceduresCount = Array.from(failedProcedures).length;
      const text = buildSnackbarText(
        archivingRelevance === ApiArchivingRelevance.Relevant
          ? "archiviert"
          : "gelöscht",
        updatedProceduresCount,
        failedProceduresCount,
      );
      if (failedProceduresCount > 0) {
        snackbar.error(text);
      } else {
        snackbar.confirmation(text);
      }
    },
  });
}

function buildSnackbarText(
  verb: string,
  updatedProceduresCount: number,
  failedProceduresCount: number,
) {
  const successfulUpdatesText =
    updatedProceduresCount === 1
      ? `1 Vorgang wurde ${verb}.`
      : `${updatedProceduresCount} Vorgänge wurden ${verb}.`;

  if (failedProceduresCount === 0) {
    return successfulUpdatesText;
  }

  const failedUpdatesText =
    failedProceduresCount === 1
      ? `1 ausgewählter Vorgang konnte nicht ${verb} werden.`
      : `${failedProceduresCount} ausgewählte Vorgänge konnten nicht ${verb} werden.`;

  return formatList([successfulUpdatesText, failedUpdatesText], " ");
}

type UseExportRelevantProceduresResult = ReturnType<
  typeof useExportRelevantProceduresTemplate
>;
export type UseExportRelevantProcedures =
  () => UseExportRelevantProceduresResult;

export function useExportRelevantProceduresTemplate(
  useArchivingApi: () => Pick<ArchivingApi, "exportRelevantProceduresRaw">,
) {
  const snackbar = useSnackbar();
  const archiving = useArchivingApi();

  return useHandledMutation({
    mutationFn: async ({ procedureIds }: { procedureIds: string[] }) =>
      archiving.exportRelevantProceduresRaw({
        apiExportArchivingRelevantProceduresRequest: {
          procedures: new Set(procedureIds),
        },
      }),
    onSuccess: () => {
      snackbar.confirmation("Vorgänge wurden exportiert.");
    },
  });
}
