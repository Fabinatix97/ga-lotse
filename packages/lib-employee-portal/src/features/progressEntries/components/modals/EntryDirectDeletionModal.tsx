/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { OverlayBoundary } from "../../../../components/boundaries/OverlayBoundary";
import { ConfirmationDialog } from "../../../../components/confirmationDialog/ConfirmationDialog";
import { useDeleteProgressEntry } from "../../api/mutations/progressEntry";
import { useProgressEntriesContext } from "../../contexts/progressEntries";
import { EntryDeletionModalProps } from "../../types/common";

export function EntryDirectDeletionModal(props: EntryDeletionModalProps) {
  return (
    <OverlayBoundary>
      <EntryDirectDeletionModalContent {...props} />
    </OverlayBoundary>
  );
}

function EntryDirectDeletionModalContent(props: EntryDeletionModalProps) {
  const progressEntriesContext = useProgressEntriesContext();
  const { progressEntryApi } = progressEntriesContext.config;
  const { entryIdForDeletion } = progressEntriesContext.state;
  const { closeEntryDeletionModal } = progressEntriesContext.action;
  const deleteProgressEntry = useDeleteProgressEntry(progressEntryApi);
  return (
    <ConfirmationDialog
      open={entryIdForDeletion !== null}
      title="Verlaufseintrag löschen?"
      description="Diese Aktion kann nicht rückgängig gemacht werden."
      color="danger"
      confirmLabel="Ja, löschen"
      cancelLabel="Abbrechen"
      onClose={closeEntryDeletionModal}
      onConfirm={() => {
        if (entryIdForDeletion !== null)
          deleteProgressEntry.mutate(entryIdForDeletion, {
            onSuccess: props.onSuccessfulDeletion,
          });
      }}
    />
  );
}
