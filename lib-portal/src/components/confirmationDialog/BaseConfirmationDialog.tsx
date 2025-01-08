/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { Typography } from "@mui/joy";
import { ReactNode } from "react";

import { MutationBundle } from "../../types/query";
import { WithRequired } from "../../types/utility";
import { BaseModal } from "../BaseModal";

import {
  BaseConfirmationDialogButtonBar,
  DioalogButtonBarProps,
} from "./BaseConfirmationDialogButtonBar";

export interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: ReactNode;
  color?: "primary" | "danger";
  confirmLabel?: string;
  onConfirm: () => Promise<void> | void;
  onConfirmMutation?: MutationBundle;
  denyLabel?: string;
  onDeny?: () => Promise<void> | void;
  onCancel?: () => void;
  cancelLabel?: string;
  hideDescription?: boolean;
  hideCancelButton?: boolean;
  buttonBarComponent?: (props: DioalogButtonBarProps) => ReactNode;
}

export type BaseConfirmationDialogProps = WithRequired<
  ConfirmationDialogProps,
  "title" | "description" | "confirmLabel" | "cancelLabel"
>;

export function BaseConfirmationDialog({
  open,
  title,
  color = "primary",
  description,
  children,
  onCancel,
  hideDescription = false,
  buttonBarComponent,
  ...props
}: BaseConfirmationDialogProps) {
  const ButtonBarComponent =
    buttonBarComponent ?? BaseConfirmationDialogButtonBar;

  function handleCancel(): void {
    onCancel?.();
    props.onClose();
  }

  return (
    <BaseModal
      modalTitle={title}
      color={color}
      open={open}
      onClose={handleCancel}
    >
      {!hideDescription && <Typography>{description}</Typography>}
      {children}
      <ButtonBarComponent
        {...props}
        color={color}
        handleCancel={handleCancel}
      />
    </BaseModal>
  );
}
