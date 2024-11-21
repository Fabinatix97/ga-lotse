/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { BaseModal } from "@eshg/lib-portal/components/BaseModal";
import { ErrorAlert } from "@eshg/lib-portal/errorHandling/ErrorAlert";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { useState } from "react";

interface ErrorModalProps {
  title?: string;
  error: unknown;
  digest?: string;
  onReset: () => void;
  onClose?: () => void;
}

export function ErrorModal(props: ErrorModalProps) {
  const { reset } = useQueryErrorResetBoundary();
  const [open, setOpen] = useState(true);

  function handleReset() {
    reset();
    props.onReset();
  }

  function handleClose() {
    setOpen(false);
    props.onClose?.();
  }

  return (
    <BaseModal
      modalTitle={props.title ?? "Fehler beim Laden"}
      open={open}
      onClose={handleClose}
    >
      <ErrorAlert
        error={props.error}
        digest={props.digest}
        onReset={handleReset}
      />
    </BaseModal>
  );
}
