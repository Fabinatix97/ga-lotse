/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, Stack } from "@mui/joy";

import { BaseModal, BaseModalPropsRequiredClose } from "@eshg/lib-portal";

export type DoubleConfirmModal = Omit<
  BaseModalPropsRequiredClose,
  "children" | "modalTitle"
> & {
  onConfirm: () => void;
  onCancel: () => void;
};

export function DoubleConfirmModal(props: DoubleConfirmModal) {
  function handleConfirmClick() {
    props.onConfirm();
  }

  function handleCancelClick() {
    props.onCancel();
  }

  function handleCloseClick() {
    props.onClose();
  }

  return (
    <BaseModal
      {...props}
      modalTitle="Sind Sie sicher? (Eine Reaktivierung ist nicht möglich!)"
      onClose={handleCloseClick}
    >
      <Stack direction="row" spacing={2} sx={{ marginLeft: "auto" }}>
        <Button
          size="sm"
          variant="outlined"
          color="neutral"
          data-testid="deactivate-cancel"
          onClick={handleCancelClick}
        >
          Nein
        </Button>
        <Button
          size="sm"
          color="danger"
          loadingPosition="start"
          data-testid="deactivate-confirm"
          onClick={handleConfirmClick}
        >
          Ja
        </Button>
      </Stack>
    </BaseModal>
  );
}
