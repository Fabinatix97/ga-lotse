/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DownloadInvitationsRequest } from "@eshg/employee-portal-api/schoolEntry";
import { useFileDownload } from "@eshg/lib-portal/api/files/download";
import { useState } from "react";
import { doNothing } from "remeda";

import { useSchoolEntryApi } from "@/lib/businessModules/schoolEntry/api/clients";
import { Procedure } from "@/lib/businessModules/schoolEntry/api/models/Procedure";
import { DownloadNotPossibleDialogProps } from "@/lib/businessModules/schoolEntry/features/procedures/proceduresTable/bulkDownloadInvitations/DownloadNotPossibleDialog";

import { PartialDownloadDialogProps } from "./PartialDownloadDialog";

export interface UseBulkDownloadInvitationsResult {
  startDownload: (
    procedures: Procedure[],
    selectedProcedureIds: string[],
  ) => Promise<void>;
  isPending: boolean;
  downloadNotPossibleDialogProps: DownloadNotPossibleDialogProps;
  partialDownloadDialogProps: Omit<PartialDownloadDialogProps, "isPending">;
}

export function useBulkDownloadInvitations(): UseBulkDownloadInvitationsResult {
  const schoolEntryApi = useSchoolEntryApi();
  const [downloadNotPossibleDialogOpen, setDownloadNotPossibleDialogOpen] =
    useState(false);
  const { download, isPending } = useFileDownload(
    (request: DownloadInvitationsRequest) =>
      schoolEntryApi.downloadInvitationsRaw(request),
  );

  const EMPTY_PARTIAL_DOWNLOAD_STATE: Omit<
    PartialDownloadDialogProps,
    "isPending"
  > = {
    open: false,
    total: 0,
    invitationsToDownload: 0,
    onConfirm: async () => new Promise(doNothing),
    onClose: () => setPartialDownloadDialogState(EMPTY_PARTIAL_DOWNLOAD_STATE),
  };
  const [partialDownloadDialogState, setPartialDownloadDialogState] = useState<
    Omit<PartialDownloadDialogProps, "isPending">
  >(EMPTY_PARTIAL_DOWNLOAD_STATE);

  async function startDownload(
    procedures: Procedure[],
    selectedProcedureIds: string[],
  ) {
    const selectedProcedures = procedures.filter((procedure) =>
      selectedProcedureIds.includes(procedure.id),
    );

    function procedureHasAppointment(procedure: Procedure) {
      return procedure.appointmentStart !== undefined;
    }

    const noProcedureHasAppointment = !selectedProcedures.some(
      procedureHasAppointment,
    );
    const allProceduresHaveAppointment = selectedProcedures.every(
      procedureHasAppointment,
    );
    if (noProcedureHasAppointment) {
      setDownloadNotPossibleDialogOpen(true);
    } else if (allProceduresHaveAppointment) {
      await download({
        apiDownloadInvitationsBulkRequest: {
          procedureIds: selectedProcedureIds,
        },
      });
    } else {
      setPartialDownloadDialogState((prev) => ({
        ...prev,
        open: true,
        total: selectedProcedures.length,
        invitationsToDownload: selectedProcedures.filter(
          procedureHasAppointment,
        ).length,
        onConfirm: async () => {
          await download({
            apiDownloadInvitationsBulkRequest: {
              procedureIds: selectedProcedures
                .filter(procedureHasAppointment)
                .map((procedure) => procedure.id),
            },
          });
          setPartialDownloadDialogState(EMPTY_PARTIAL_DOWNLOAD_STATE);
        },
      }));
    }
  }

  return {
    startDownload,
    isPending,
    downloadNotPossibleDialogProps: {
      open: downloadNotPossibleDialogOpen,
      onClose: () => setDownloadNotPossibleDialogOpen(false),
    },
    partialDownloadDialogProps: partialDownloadDialogState,
  };
}
