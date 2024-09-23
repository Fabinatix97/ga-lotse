/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useContext } from "react";

import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { ConfirmationDialog } from "@/lib/shared/components/confirmationDialog/ConfirmationDialog";
import { ProgressEntriesContext } from "@/lib/shared/components/procedures/progress-entries/ProgressEntriesContext";

export function FileDirectDeletionModal() {
  return (
    <OverlayBoundary>
      <FileDirectDeletionModalContent />
    </OverlayBoundary>
  );
}

export function FileDirectDeletionModalContent() {
  const progressEntriesContext = useContext(ProgressEntriesContext);
  const { useDeleteFile } = progressEntriesContext.config;
  const { fileIdForDeletion } = progressEntriesContext.state;
  const { closeFileDeletionModal } = progressEntriesContext.action;
  const deleteFile = useDeleteFile();
  return (
    <ConfirmationDialog
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
