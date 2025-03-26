/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { OverlayBoundary } from "@eshg/lib-employee-portal";
import { useContext } from "react";

import { EmployeePortalConfirmationDialog } from "@/lib/shared/components/confirmationDialog/EmployeePortalConfirmationDialog";
import { ProgressEntriesContext } from "@/lib/shared/components/procedures/progress-entries/ProgressEntriesContext";
import { useDeleteProgressEntry } from "@/lib/shared/components/procedures/progress-entries/mutations/progressEntryApi";
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
  const { progressEntryApi } = progressEntriesContext.config;
  const { entryIdForDeletion } = progressEntriesContext.state;
  const { closeEntryDeletionModal } = progressEntriesContext.action;
  const deleteProgressEntry = useDeleteProgressEntry(progressEntryApi);
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
