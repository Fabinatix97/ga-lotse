/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ScopedAlert,
  useAlertContext,
} from "@eshg/lib-portal/errorHandling/AlertContext";
import { DialogTitle, Modal, ModalClose, ModalDialog } from "@mui/joy";
import { DefaultColorPalette, SxProps } from "@mui/joy/styles/types";
import { ReactNode } from "react";
import { isDefined } from "remeda";

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
          <ScopedAlert />
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
