/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Button, Stack, Typography } from "@mui/joy";
import { ReactNode, useState } from "react";

import { BaseModal } from "@/lib/shared/components/BaseModal";

export const NO_CANCEL_LABEL = "__NO_CANCEL_LABEL__";

export interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  defaultDescriptionEnabled?: boolean;
  children?: ReactNode;
  color?: "primary" | "danger";
  confirmLabel?: string;
  onConfirm: () => Promise<void> | void;
  cancelLabel?: string;
}

export function ConfirmationDialog({
  open,
  onClose,
  title = "Änderung speichern?",
  description = "Möchten Sie die Änderung wirklich speichern?",
  defaultDescriptionEnabled = true,
  children,
  color = "primary",
  confirmLabel = "Speichern",
  onConfirm,
  cancelLabel = "Abbrechen",
}: ConfirmationDialogProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  return (
    <BaseModal modalTitle={title} color={color} open={open} onClose={onClose}>
      <>
        {defaultDescriptionEnabled && <Typography>{description}</Typography>}
        {children}
        <Stack
          direction="row"
          spacing={2}
          sx={{ marginLeft: "auto", paddingTop: 2 }}
        >
          {cancelLabel !== NO_CANCEL_LABEL && (
            <Button
              size="sm"
              variant="outlined"
              color="neutral"
              onClick={onClose}
              data-testid="confirmationDialogCancel"
            >
              {cancelLabel}
            </Button>
          )}
          <Button
            size="sm"
            color={color}
            loading={isConfirming}
            loadingPosition={"start"}
            onClick={async () => {
              setIsConfirming(true);
              await onConfirm();
              setIsConfirming(false);
              onClose();
            }}
            data-testid="confirmationDialogConfirm"
          >
            {confirmLabel}
          </Button>
        </Stack>
      </>
    </BaseModal>
  );
}
