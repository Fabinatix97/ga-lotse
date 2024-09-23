/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { Typography } from "@mui/joy";
import { useContext } from "react";

import { BaseModal } from "@/lib/shared/components/BaseModal";
import { ProgressEntriesContext } from "@/lib/shared/components/procedures/progress-entries/ProgressEntriesContext";
import {
  DeletionRequestForm,
  DeletionRequestValues,
} from "@/lib/shared/components/procedures/progress-entries/forms/DeletionRequestForm";

export function FileDeletionRequestModal() {
  const progressEntriesContext = useContext(ProgressEntriesContext);
  const { useRequestFileDeletion } = progressEntriesContext.config;
  const { fileIdForDeletion } = progressEntriesContext.state;
  const { closeFileDeletionModal } = progressEntriesContext.action;
  const requestFileDeletion = useRequestFileDeletion();

  async function handleSubmit(values: DeletionRequestValues) {
    if (fileIdForDeletion !== null)
      await requestFileDeletion
        .mutateAsync(
          { fileId: fileIdForDeletion, createApprovalRequest: values },
          { onSuccess: handleClose },
        )
        .catch();
  }

  function handleClose() {
    closeFileDeletionModal();
  }

  return (
    <BaseModal
      modalTitle="Datei Löschung beantragen?"
      open={fileIdForDeletion !== null}
      onClose={handleClose}
      color="danger"
    >
      <Typography textColor="text.secondary">
        Durch Löschung der Datei bleibt der Verlaufseintrag bestehen.
      </Typography>
      <DeletionRequestForm onSubmit={handleSubmit} onCancel={handleClose} />
    </BaseModal>
  );
}
