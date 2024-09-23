/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useAlertContext } from "@eshg/lib-portal/errorHandling/AlertContext";
import { DialogTitle, Modal, ModalClose, ModalDialog, Stack } from "@mui/joy";
import { DefaultColorPalette, SxProps } from "@mui/joy/styles/types";
import { ReactNode } from "react";
import { isDefined } from "remeda";

export interface InfoModalProps {
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
  const alertContext = useAlertContext();

  function handleClose() {
    if (onClose !== undefined) {
      onClose();
    }
    if (alertContext !== null) {
      alertContext.setAlert(null);
    }
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
          direction={"row"}
          alignItems="center"
          justifyContent={"space-between"}
        >
          {isDefined(modalTitle) && (
            <DialogTitle color={color} level={"h4"} component={"h4"}>
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
