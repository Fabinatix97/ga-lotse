/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { Typography } from "@mui/joy";

import { BaseModal } from "@eshg/lib-portal";

import { OverlayBoundary } from "../../../../components/boundaries/OverlayBoundary";
import { useRequestProgressEntryDeletion } from "../../api/mutations/progressEntry";
import { useProgressEntriesContext } from "../../contexts/progressEntries";
import { EntryDeletionModalProps } from "../../types/common";
import {
  DeletionRequestForm,
  DeletionRequestValues,
} from "../forms/DeletionRequestForm";

export function EntryDeletionRequestModal(_props: EntryDeletionModalProps) {
  return (
    <OverlayBoundary>
      <EntryDeletionRequestModalContent />
    </OverlayBoundary>
  );
}

function EntryDeletionRequestModalContent() {
  const progressEntriesContext = useProgressEntriesContext();
  const { progressEntryApi } = progressEntriesContext.config;
  const { entryIdForDeletion } = progressEntriesContext.state;
  const { closeEntryDeletionModal } = progressEntriesContext.action;

  const requestProgressEntryDeletion =
    useRequestProgressEntryDeletion(progressEntryApi);

  async function handleSubmit(values: DeletionRequestValues) {
    if (entryIdForDeletion !== null)
      await requestProgressEntryDeletion.mutateAsync(
        {
          entryId: entryIdForDeletion,
          createApprovalRequest: values,
        },
        { onSuccess: handleClose },
      );
  }

  function handleClose() {
    closeEntryDeletionModal();
  }

  return (
    <BaseModal
      modalTitle="Löschung beantragen?"
      open={entryIdForDeletion !== null}
      color="danger"
      onClose={handleClose}
    >
      <Typography textColor="text.secondary">
        Der gesamte Verlaufseintrag inklusive Datei wird gelöscht. Diese Aktion
        kann nicht rückgängig gemacht werden.
      </Typography>
      <DeletionRequestForm onSubmit={handleSubmit} onCancel={handleClose} />
    </BaseModal>
  );
}
