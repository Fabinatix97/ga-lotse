/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Modal,
  ModalDialog,
} from "@mui/joy";
import { useCallback, useRef, useState } from "react";

import { useTranslation } from "@/lib/i18n/client";

function ConfirmationDialog({
  content,
  onClose,
}: Readonly<{
  content: string;
  onClose: (result: boolean) => void;
}>) {
  const { t } = useTranslation();

  return (
    <Modal open={true} onClose={() => onClose(false)}>
      <ModalDialog variant="outlined" role="alertdialog">
        <DialogTitle>
          {/*<WarningRoundedIcon />*/}
          {t("confirmationDialog.title")}
        </DialogTitle>
        <Divider />
        <DialogContent>{t(content)}</DialogContent>
        <DialogActions>
          <Button
            data-testid="confirm.yes"
            variant="solid"
            color="danger"
            onClick={() => onClose(true)}
          >
            {t("confirmationDialog.yes")}
          </Button>
          <Button
            data-testid="confirm.no"
            variant="plain"
            color="neutral"
            onClick={() => onClose(false)}
          >
            {t("confirmationDialog.no")}
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
}

export function useConfirmationDialog(content: string) {
  const [open, setOpen] = useState(false);
  const resolveRef = useRef<(value: boolean | PromiseLike<boolean>) => void>();

  const getConfirmation = useCallback(async (): Promise<boolean> => {
    setOpen(true);
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
    });
  }, []);

  const handleClose = useCallback((result: boolean) => {
    setOpen(false);
    if (resolveRef.current) {
      resolveRef.current(result);
    }
  }, []);

  return {
    confirmationDialog: open && (
      <ConfirmationDialog content={content} onClose={handleClose} />
    ),
    getConfirmation,
  };
}
