/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  CircularProgress,
  DialogTitle,
  Modal,
  ModalDialog,
  Stack,
  Typography,
} from "@mui/joy";
import { PropsWithChildren, useId } from "react";

export function OfflinePasswordDialog({
  children,
  waiting,
  title = "Offline Passwort",
  description,
}: PropsWithChildren<{
  waiting: boolean;
  title?: string;
  description?: string;
}>) {
  const dialogId = useId();
  const titleId = `${dialogId}-title`;
  const descriptionId = `${dialogId}-description`;

  return (
    <Modal open={true}>
      <ModalDialog
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        sx={{
          width: { xxs: "calc(100vw - 3rem)", sm: 530 },
          gap: 3,
          overflowY: "scroll",
        }}
      >
        <Stack gap={1}>
          <DialogTitle id={titleId}>{title}</DialogTitle>
          {description && (
            <Typography
              id={descriptionId}
              textColor="text.secondary"
              level="body-sm"
            >
              {description}
            </Typography>
          )}
        </Stack>
        {waiting ? <CenteredCircularProgress /> : children}
      </ModalDialog>
    </Modal>
  );
}

function CenteredCircularProgress() {
  return (
    <Stack alignItems="center" justifyContent="center" sx={{ height: "100%" }}>
      <CircularProgress aria-label="Verarbeitung" />
    </Stack>
  );
}
