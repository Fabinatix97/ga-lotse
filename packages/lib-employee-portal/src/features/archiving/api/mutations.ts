/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useHandledMutation, useSnackbar } from "@eshg/lib-portal";
import {
  ApiArchivingRelevance,
  ArchivingApiInterface,
} from "@eshg/lib-procedures-api";

import { formatList } from "../../../utils/formatters";

export function useBulkUpdateProceduresArchivingRelevance(
  archivingApi: ArchivingApiInterface,
) {
  const snackbar = useSnackbar();

  return useHandledMutation({
    mutationFn: async ({
      procedureIds,
      archivingRelevance,
    }: {
      procedureIds: string[];
      archivingRelevance: ApiArchivingRelevance;
    }) =>
      archivingApi.bulkUpdateProceduresArchivingRelevance({
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

export function useExportRelevantProcedures(
  archivingApi: ArchivingApiInterface,
) {
  const snackbar = useSnackbar();

  return useHandledMutation({
    mutationFn: async ({ procedureIds }: { procedureIds: string[] }) =>
      archivingApi.exportRelevantProceduresRaw({
        apiExportArchivingRelevantProceduresRequest: {
          procedures: new Set(procedureIds),
        },
      }),
    onSuccess: () => {
      snackbar.confirmation("Vorgänge wurden exportiert.");
    },
  });
}
