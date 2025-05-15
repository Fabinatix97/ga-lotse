/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Button, Stack } from "@mui/joy";
import { Fragment, useState } from "react";

import { useHandledMutation } from "@eshg/lib-portal/api/useHandledMutation";
import { DioalogButtonBarProps } from "@eshg/lib-portal/components/confirmationDialog/BaseConfirmationDialogButtonBar";
import { useIsMobile } from "@eshg/lib-portal/hooks/theme";

export function CitizenConfirmationButtonBar({
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
}: DioalogButtonBarProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDenying, setIsDenying] = useState(false);
  const mutation = useHandledMutation(
    onConfirmMutation?.mutationOptions ?? {
      mutationFn: () => Promise.resolve(),
    },
  );

  const isMobile = useIsMobile();

  function renderButtons(isMobile: boolean) {
    const buttons = [
      !hideCancelButton && (
        <Button
          key="cancel"
          size="sm"
          variant="outlined"
          color="danger"
          onClick={handleCancel}
        >
          {cancelLabel}
        </Button>
      ),
      onDeny !== undefined && (
        <Button
          key="deny"
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
      ),
      <Button
        key="confirm"
        size="sm"
        color={color}
        loading={isConfirming}
        loadingPosition="start"
        onClick={async () => {
          setIsConfirming(true);
          await mutation.mutateAsync(onConfirmMutation?.variableSupplier?.(), {
            onError: () => setIsConfirming(false),
          });
          await onConfirm();
          setIsConfirming(false);
          onClose();
        }}
      >
        {confirmLabel}
      </Button>,
    ];

    return isMobile ? (
      <Stack direction="column" spacing={2} width="100%">
        {buttons.toReversed()}
      </Stack>
    ) : (
      <Stack
        direction="row"
        spacing={2}
        sx={{ marginLeft: "auto", paddingTop: 1 }}
      >
        {buttons}
      </Stack>
    );
  }

  return <Fragment>{renderButtons(isMobile)}</Fragment>;
}
