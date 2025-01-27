/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { BaseModal } from "@eshg/lib-portal/components/BaseModal";
import { Typography } from "@mui/joy";
import { useContext } from "react";

import { ProgressEntriesContext } from "@/lib/shared/components/procedures/progress-entries/ProgressEntriesContext";
import {
  DeletionRequestForm,
  DeletionRequestValues,
} from "@/lib/shared/components/procedures/progress-entries/forms/DeletionRequestForm";
import { useRequestFileDeletion } from "@/lib/shared/components/procedures/progress-entries/mutations/fileApi";

export function FileDeletionRequestModal() {
  const progressEntriesContext = useContext(ProgressEntriesContext);
  const { fileApi } = progressEntriesContext.config;
  const { fileIdForDeletion } = progressEntriesContext.state;
  const { closeFileDeletionModal } = progressEntriesContext.action;
  const requestFileDeletion = useRequestFileDeletion(fileApi);

  async function handleSubmit(values: DeletionRequestValues) {
    if (fileIdForDeletion !== null)
      await requestFileDeletion.mutateAsync(
        { fileId: fileIdForDeletion, createApprovalRequest: values },
        { onSuccess: handleClose },
      );
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
