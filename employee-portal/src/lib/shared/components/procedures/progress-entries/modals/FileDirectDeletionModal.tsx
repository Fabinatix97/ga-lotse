/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useContext } from "react";

import { ConfirmationDialog, OverlayBoundary } from "@eshg/lib-employee-portal";

import { ProgressEntriesContext } from "@/lib/shared/components/procedures/progress-entries/ProgressEntriesContext";
import { useDeleteFile } from "@/lib/shared/components/procedures/progress-entries/mutations/fileApi";

export function FileDirectDeletionModal() {
  return (
    <OverlayBoundary>
      <FileDirectDeletionModalContent />
    </OverlayBoundary>
  );
}

function FileDirectDeletionModalContent() {
  const progressEntriesContext = useContext(ProgressEntriesContext);
  const { fileApi } = progressEntriesContext.config;
  const { fileIdForDeletion } = progressEntriesContext.state;
  const { closeFileDeletionModal } = progressEntriesContext.action;
  const deleteFile = useDeleteFile(fileApi);
  return (
    <ConfirmationDialog
      open={fileIdForDeletion !== null}
      title="Datei löschen?"
      description="Diese Aktion kann nicht rückgängig gemacht werden."
      color="danger"
      confirmLabel="Ja, löschen"
      cancelLabel="Abbrechen"
      onClose={closeFileDeletionModal}
      onConfirm={() => {
        if (fileIdForDeletion !== null) deleteFile.mutate(fileIdForDeletion);
      }}
    />
  );
}
