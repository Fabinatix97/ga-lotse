/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { Typography } from "@mui/joy";
import { useContext } from "react";

import { BaseModal } from "@/lib/shared/components/BaseModal";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { ProgressEntriesContext } from "@/lib/shared/components/procedures/progress-entries/ProgressEntriesContext";
import {
  DeletionRequestForm,
  DeletionRequestValues,
} from "@/lib/shared/components/procedures/progress-entries/forms/DeletionRequestForm";
import { EntryDeletionModalProps } from "@/lib/shared/components/procedures/progress-entries/types";

export function EntryDeletionRequestModal(_props: EntryDeletionModalProps) {
  return (
    <OverlayBoundary>
      <EntryDeletionRequestModalContent />
    </OverlayBoundary>
  );
}

export function EntryDeletionRequestModalContent() {
  const progressEntriesContext = useContext(ProgressEntriesContext);
  const { useRequestProgressEntryDeletion } = progressEntriesContext.config;
  const { entryIdForDeletion } = progressEntriesContext.state;
  const { closeEntryDeletionModal } = progressEntriesContext.action;

  const requestProgressEntryDeletion = useRequestProgressEntryDeletion();

  async function handleSubmit(values: DeletionRequestValues) {
    if (entryIdForDeletion !== null)
      await requestProgressEntryDeletion
        .mutateAsync(
          {
            entryId: entryIdForDeletion,
            createApprovalRequest: values,
          },
          { onSuccess: handleClose },
        )
        .catch();
  }

  function handleClose() {
    closeEntryDeletionModal();
  }

  return (
    <BaseModal
      modalTitle="Löschung beantragen?"
      open={entryIdForDeletion !== null}
      onClose={handleClose}
      color="danger"
    >
      <Typography textColor="text.secondary">
        Der gesamte Verlaufseintrag inklusive Datei wird gelöscht. Diese Aktion
        kann nicht rückgängig gemacht werden.
      </Typography>
      <DeletionRequestForm onSubmit={handleSubmit} onCancel={handleClose} />
    </BaseModal>
  );
}
