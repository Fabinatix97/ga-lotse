/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ContentCopyOutlined } from "@mui/icons-material";
import {
  Button,
  IconButton,
  List,
  ListItem,
  Stack,
  Typography,
} from "@mui/joy";
import { useEffect, useState } from "react";

import { BaseModal, BaseModalPropsRequiredClose } from "@eshg/lib-portal";

import { useCopy } from "@/lib/shared/hooks/useCopy";

export type RecoveryKeyModal = Omit<
  BaseModalPropsRequiredClose,
  "children" | "modalTitle" | "onClose"
> & {
  handleDoneClick: () => void;
  recoveryKey: string;
};

export function RecoveryKeyModal({
  handleDoneClick,
  recoveryKey,
  ...props
}: RecoveryKeyModal) {
  const copy = useCopy();
  const [secondsLeft, setSecondsLeft] = useState(10);
  const [isCloseButtonDisabled, setCloseButtonDisabled] = useState(true);

  async function handleCopyRecoveryKey() {
    await copy(recoveryKey);
    setCloseButtonDisabled(false);
    setSecondsLeft(0);
  }

  useEffect(() => {
    if (!props.open) return;

    if (secondsLeft > 0) {
      const timer = setInterval(() => {
        setSecondsLeft((prev) => {
          const nowSecondsLeft = prev - 1;
          if (nowSecondsLeft === 0) {
            setCloseButtonDisabled(false);
          }
          return nowSecondsLeft;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [secondsLeft, props.open]);

  return (
    <BaseModal
      {...props}
      modalTitle="Wiederherstellungsschlüssel"
      onClose={undefined}
    >
      <List marker="disc" sx={{ pl: 3 }}>
        <ListItem color="danger">
          Bitte notieren Sie sich den Wiederherstellungsschlüssel und bewahren
          Sie ihn an einem sicheren Ort auf! Er kann kein weiteres mal angezeigt
          werden!
        </ListItem>
        <ListItem color="danger">
          Das Chatmodul unterstützt kein Passwort Reset!
        </ListItem>
        <ListItem color="danger">
          Einzig dieser Wiederherstellungsschlüssel ermöglicht es Ihnen das
          Chatmodul weiterhin zu nutzen, wenn Sie Ihr Passwort vergessen haben!
        </ListItem>
      </List>
      <Stack direction="row" spacing={2} sx={{ marginRight: "auto" }}>
        <IconButton
          aria-label="Wiederherstellungschlüssel kopieren"
          variant="outlined"
          color="primary"
          data-testid="copy-button"
          onClick={async () => await handleCopyRecoveryKey()}
        >
          <ContentCopyOutlined size="sm" />
        </IconButton>
        <Typography level="body-sm">{recoveryKey}</Typography>
      </Stack>
      <Stack direction="row" spacing={2} sx={{ marginLeft: "auto" }}>
        <Button
          disabled={isCloseButtonDisabled}
          size="sm"
          variant="outlined"
          color="neutral"
          data-testid="done-button"
          onClick={handleDoneClick}
        >
          {isCloseButtonDisabled ? `Warten ${secondsLeft} ...` : "Fertig"}
        </Button>
      </Stack>
    </BaseModal>
  );
}
