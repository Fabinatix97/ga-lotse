/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useContext } from "react";

import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { EmployeePortalConfirmationDialog } from "@/lib/shared/components/confirmationDialog/EmployeePortalConfirmationDialog";
import { ProgressEntriesContext } from "@/lib/shared/components/procedures/progress-entries/ProgressEntriesContext";
import { useDeleteFile } from "@/lib/shared/components/procedures/progress-entries/mutations/fileApi";

export function FileDirectDeletionModal() {
  return (
    <OverlayBoundary>
      <FileDirectDeletionModalContent />
    </OverlayBoundary>
  );
}

export function FileDirectDeletionModalContent() {
  const progressEntriesContext = useContext(ProgressEntriesContext);
  const { fileApi } = progressEntriesContext.config;
  const { fileIdForDeletion } = progressEntriesContext.state;
  const { closeFileDeletionModal } = progressEntriesContext.action;
  const deleteFile = useDeleteFile(fileApi);
  return (
    <EmployeePortalConfirmationDialog
      open={fileIdForDeletion !== null}
      onClose={closeFileDeletionModal}
      onConfirm={() => {
        if (fileIdForDeletion !== null) deleteFile.mutate(fileIdForDeletion);
      }}
      title="Datei löschen?"
      description="Diese Aktion kann nicht rückgängig gemacht werden."
      color="danger"
      confirmLabel="Ja, löschen"
      cancelLabel="Abbrechen"
    />
  );
}
