/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { Button, Stack } from "@mui/joy";
import { useState } from "react";
import { isDefined } from "remeda";

import { useHandledMutation } from "../../api/useHandledMutation";

import { ConfirmationDialogProps } from "./BaseConfirmationDialog";

export type DialogButtonBarProps = Pick<
  ConfirmationDialogProps,
  | "onClose"
  | "color"
  | "confirmLabel"
  | "onConfirm"
  | "onConfirmMutation"
  | "denyLabel"
  | "onDeny"
  | "onCancel"
  | "cancelLabel"
  | "hideCancelButton"
> & { handleCancel: () => Promise<void> | void };

export function BaseConfirmationDialogButtonBar({
  onClose,
  color = "primary",
  confirmLabel,
  onConfirm,
  onConfirmMutation,
  denyLabel,
  onDeny,
  cancelLabel,
  hideCancelButton = false,
  handleCancel,
}: DialogButtonBarProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDenying, setIsDenying] = useState(false);
  const mutation = useHandledMutation(
    onConfirmMutation?.mutationOptions ?? {
      mutationFn: () => {
        throw new Error(
          "Called empty mutation, which might interfere with query cache invalidation",
        );
      },
    },
  );

  return (
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
          loadingPosition="start"
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
        loadingPosition="start"
        onClick={async () => {
          setIsConfirming(true);
          if (isDefined(onConfirmMutation?.mutationOptions)) {
            await mutation.mutateAsync(
              onConfirmMutation?.variableSupplier?.(),
              {
                onError: () => setIsConfirming(false),
              },
            );
          }
          await onConfirm();
          setIsConfirming(false);
          onClose();
        }}
      >
        {confirmLabel}
      </Button>
    </Stack>
  );
}
