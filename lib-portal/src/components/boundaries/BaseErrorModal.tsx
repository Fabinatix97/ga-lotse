/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { useState } from "react";

import { ErrorAlert } from "../../errorHandling/ErrorAlert";
import { WithRequired } from "../../types/utility";
import { BaseModal } from "../BaseModal";

export interface ErrorModalProps {
  title?: string;
  error: unknown;
  digest?: string;
  onReset: () => void;
  onClose?: () => void;
}

type BaseErrorModalProps = WithRequired<ErrorModalProps, "title">;

export function BaseErrorModal(props: BaseErrorModalProps) {
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
    <BaseModal modalTitle={props.title} open={open} onClose={handleClose}>
      <ErrorAlert
        error={props.error}
        digest={props.digest}
        onReset={handleReset}
      />
    </BaseModal>
  );
}
