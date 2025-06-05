/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DialogTitle, Modal, ModalClose, ModalDialog, Stack } from "@mui/joy";
import { DefaultColorPalette, SxProps } from "@mui/joy/styles/types";
import { ReactNode } from "react";
import { isDefined } from "remeda";

import { useResetAlertContext } from "@eshg/lib-portal";

interface InfoModalProps {
  children: ReactNode;
  color?: DefaultColorPalette;
  modalTitle?: string;
  open: boolean;
  onClose: () => void;
  sx?: SxProps;
}

export function InfoModal({
  children,
  color = "primary",
  modalTitle,
  open,
  onClose,
  sx,
}: InfoModalProps) {
  const resetAlertContext = useResetAlertContext();

  function handleClose() {
    if (onClose !== undefined) {
      onClose();
    }
    resetAlertContext();
  }

  return (
    <Modal
      aria-labelledby="modal-title"
      open={open}
      color={color}
      onClose={handleClose}
    >
      <ModalDialog
        sx={{ width: 328, gap: 2, padding: "24px 16px 24px 16px", ...sx }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          {isDefined(modalTitle) && (
            <DialogTitle color={color} level="h3" component="h1">
              {modalTitle}
            </DialogTitle>
          )}
          <ModalClose
            variant="outlined"
            aria-label="Schließen"
            color="primary"
            sx={{
              "--ModalClose-inset": 0,
              position: "relative",
            }}
          />
        </Stack>

        {children}
      </ModalDialog>
    </Modal>
  );
}
