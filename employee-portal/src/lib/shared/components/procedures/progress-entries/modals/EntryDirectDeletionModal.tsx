/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useContext } from "react";

import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { EmployeePortalConfirmationDialog } from "@/lib/shared/components/confirmationDialog/EmployeePortalConfirmationDialog";
import { ProgressEntriesContext } from "@/lib/shared/components/procedures/progress-entries/ProgressEntriesContext";
import { EntryDeletionModalProps } from "@/lib/shared/components/procedures/progress-entries/types";

export function EntryDirectDeletionModal(props: EntryDeletionModalProps) {
  return (
    <OverlayBoundary>
      <EntryDirectDeletionModalContent {...props} />
    </OverlayBoundary>
  );
}

export function EntryDirectDeletionModalContent(
  props: EntryDeletionModalProps,
) {
  const progressEntriesContext = useContext(ProgressEntriesContext);
  const { useDeleteProgressEntry } = progressEntriesContext.config;
  const { entryIdForDeletion } = progressEntriesContext.state;
  const { closeEntryDeletionModal } = progressEntriesContext.action;
  const deleteProgressEntry = useDeleteProgressEntry();
  return (
    <EmployeePortalConfirmationDialog
      open={entryIdForDeletion !== null}
      onClose={closeEntryDeletionModal}
      onConfirm={() => {
        if (entryIdForDeletion !== null)
          deleteProgressEntry.mutate(entryIdForDeletion, {
            onSuccess: props.onSuccessfulDeletion,
          });
      }}
      title="Verlaufseintrag löschen?"
      description="Diese Aktion kann nicht rückgängig gemacht werden."
      color="danger"
      confirmLabel="Ja, löschen"
      cancelLabel="Abbrechen"
    />
  );
}
