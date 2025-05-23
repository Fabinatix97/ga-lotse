/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { Typography } from "@mui/joy";

import { BaseModal } from "@eshg/lib-portal";

import { useRequestFileDeletion } from "../../api/mutations/file";
import { useProgressEntriesContext } from "../../contexts/progressEntries";
import {
  DeletionRequestForm,
  DeletionRequestValues,
} from "../forms/DeletionRequestForm";

export function FileDeletionRequestModal() {
  const progressEntriesContext = useProgressEntriesContext();
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
      color="danger"
      onClose={handleClose}
    >
      <Typography textColor="text.secondary">
        Durch Löschung der Datei bleibt der Verlaufseintrag bestehen.
      </Typography>
      <DeletionRequestForm onSubmit={handleSubmit} onCancel={handleClose} />
    </BaseModal>
  );
}
