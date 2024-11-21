/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { DialogTitle, Modal, ModalClose, ModalDialog } from "@mui/joy";
import { DefaultColorPalette, SxProps } from "@mui/joy/styles/types";
import { ReactNode } from "react";
import { isDefined } from "remeda";

import { AlertSlot, useResetAlertContext } from "../errorHandling/AlertContext";

export interface BaseModalProps {
  children: ReactNode;
  color?: DefaultColorPalette;
  modalTitle?: string;
  open: boolean;
  onClose: () => void;
  sx?: SxProps;
}

export function BaseModal({
  children,
  color = "primary",
  modalTitle,
  open,
  onClose,
  sx,
}: BaseModalProps) {
  const resetAlertContext = useResetAlertContext();

  function handleClose() {
    if (onClose !== undefined) {
      onClose();
    }
    resetAlertContext();
  }

  return (
    <>
      <Modal
        aria-labelledby="modal-title"
        open={open}
        color={color}
        onClose={handleClose}
      >
        <ModalDialog sx={{ width: { xxs: 328, sm: 688 }, gap: 2, ...sx }}>
          {isDefined(modalTitle) && (
            <DialogTitle color={color}>{modalTitle}</DialogTitle>
          )}
          <AlertSlot />
          <ModalClose
            variant="outlined"
            aria-label="Schließen"
            color="primary"
            sx={{
              margin: 1,
            }}
          />
          {children}
        </ModalDialog>
      </Modal>
    </>
  );
}
