/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { BaseModal } from "@eshg/lib-portal/components/BaseModal";
import { MutationBundle } from "@eshg/lib-portal/types/query";
import { Button, Stack, Typography } from "@mui/joy";
import { ReactNode, useState } from "react";

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
}

export function ConfirmationDialog({
  open,
  onClose,
  title = "Änderung speichern?",
  description = "Möchten Sie die Änderung wirklich speichern?",
  children,
  color = "primary",
  confirmLabel = "Speichern",
  onConfirm,
  onConfirmMutation,
  denyLabel,
  onDeny,
  onCancel,
  cancelLabel = "Abbrechen",
  hideDescription = false,
  hideCancelButton = false,
}: ConfirmationDialogProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDenying, setIsDenying] = useState(false);
  const mutation = useHandledMutation(
    onConfirmMutation?.mutationOptions ?? {
      mutationFn: () => Promise.resolve(),
    },
  );

  function handleCancel(): void {
    onCancel?.();
    onClose();
  }

  return (
    <BaseModal
      modalTitle={title}
      color={color}
      open={open}
      onClose={handleCancel}
    >
      <>
        {!hideDescription && <Typography>{description}</Typography>}
        {children}
        <Stack
          direction="row"
          spacing={2}
          sx={{ marginLeft: "auto", paddingTop: 2 }}
        >
          {!hideCancelButton && (
            <Button
              size="sm"
              variant="outlined"
              color="neutral"
              onClick={handleCancel}
            >
              {cancelLabel}
            </Button>
          )}
          {onDeny !== undefined && (
            <Button
              variant="outlined"
              size="sm"
              color="danger"
              loading={isDenying}
              loadingPosition={"start"}
              onClick={async () => {
                setIsDenying(true);
                await onDeny();
                setIsDenying(false);
                onClose();
              }}
            >
              {denyLabel}
            </Button>
          )}
          <Button
            size="sm"
            color={color}
            loading={isConfirming}
            loadingPosition={"start"}
            onClick={async () => {
              setIsConfirming(true);
              await mutation.mutateAsync(
                onConfirmMutation?.variableSupplier?.(),
                {
                  onError: () => setIsConfirming(false),
                },
              );
              await onConfirm();
              setIsConfirming(false);
              onClose();
            }}
          >
            {confirmLabel}
          </Button>
        </Stack>
      </>
    </BaseModal>
  );
}
