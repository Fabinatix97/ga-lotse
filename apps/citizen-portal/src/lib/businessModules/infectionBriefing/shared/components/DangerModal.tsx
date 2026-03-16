/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, Stack, Typography, VariantProp } from "@mui/joy";
import { DefaultColorPalette } from "@mui/joy/styles/types";

import { BaseModal } from "@eshg/lib-portal";

interface InfoModalProps {
  cancelButtonText: string | undefined;
  confirmButtonText: string | undefined;
  color?: DefaultColorPalette;
  modalTitle: string;
  modalBody?: string | undefined;
  open: boolean;
  onClick: () => void;
  onClose: () => void;
  onConfirm: () => void;
  variant?: VariantProp;
}

export function DangerModal({
  cancelButtonText,
  confirmButtonText,
  color,
  modalTitle,
  modalBody,
  open,
  onClick,
  onClose,
  onConfirm,
}: InfoModalProps) {
  return (
    <BaseModal
      modalTitle={modalTitle}
      open={open}
      color={color}
      onClose={() => onClose()}
    >
      <Typography>{modalBody}</Typography>
      <Stack direction="row" justifyContent="end" gap={2}>
        <Button variant="outlined" color={color} onClick={() => onClick()}>
          {cancelButtonText}
        </Button>
        <Button color={color} onClick={onConfirm}>
          {confirmButtonText}
        </Button>
      </Stack>
    </BaseModal>
  );
}
