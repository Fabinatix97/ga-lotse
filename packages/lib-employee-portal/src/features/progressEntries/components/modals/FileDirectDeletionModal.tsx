/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { OverlayBoundary } from "../../../../components/boundaries/OverlayBoundary";
import { ConfirmationDialog } from "../../../../components/confirmationDialog/ConfirmationDialog";
import { useDeleteFile } from "../../api/mutations/file";
import { useProgressEntriesContext } from "../../contexts/progressEntries";

export function FileDirectDeletionModal() {
  return (
    <OverlayBoundary>
      <FileDirectDeletionModalContent />
    </OverlayBoundary>
  );
}

function FileDirectDeletionModalContent() {
  const progressEntriesContext = useProgressEntriesContext();
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
