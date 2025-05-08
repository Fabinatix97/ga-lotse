/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, List, ListItem, Stack, Typography } from "@mui/joy";

import {
  BaseModal,
  BaseModalPropsRequiredClose,
} from "@eshg/lib-portal/components/BaseModal";

type DeactivateModalProps = Omit<
  BaseModalPropsRequiredClose,
  "children" | "modalTitle"
> & {
  onConfirm: () => void;
};

export function DeactivateModal(props: DeactivateModalProps) {
  function handleConfirmClick() {
    props.onConfirm();
  }

  function handleCancelClick() {
    props.onClose();
  }

  return (
    <BaseModal
      {...props}
      key="chat-account-deactivation-modal"
      modalTitle="Chat Account Deaktivieren"
      onClose={handleCancelClick}
    >
      <>
        <Typography color="danger">WARNUNG!</Typography>
        <List marker="disc" sx={{ pl: 3 }}>
          <ListItem color="danger">
            IHR CHATACCOUNT WIRD DAUERHAFT DEAKTIVIERT!
          </ListItem>
          <ListItem color="danger">
            SIE WERDEN KEINEN ZUGRIFF MEHR AUF DAS CHATMODUL HABEN!
          </ListItem>
          <ListItem color="danger">
            SIE WERDEN KEINE CHATNACHRICHTEN MEHR LESEN KÖNNEN!
          </ListItem>
        </List>
        <Typography textColor="text.secondary">
          Wenn Sie Ihren Account deaktivieren, ist keine weitere Nutzung des
          Chatmoduls möglich. Eine Reaktivierung ist nicht möglich. Sie können
          weder Nachrichten senden noch empfangen und haben keinen Zugriff mehr
          auf Ihre bestehende Kommunikation. Für Ihre Chatpartner bleiben Ihre
          gesendeten Nachrichten erhalten. Wenn Sie dies verhindern möchten,
          nutzen Sie die Funktion, einzelne Nachrichten zu löschen, bevor Sie
          Ihren Account deaktivieren.
        </Typography>
        <Stack
          direction="row"
          spacing={2}
          sx={{ marginLeft: "auto", paddingTop: 2 }}
        >
          <Button
            size="sm"
            variant="outlined"
            color="neutral"
            data-testid="deactivate-cancel"
            onClick={handleCancelClick}
          >
            Abbrechen
          </Button>
          <Button
            size="sm"
            color="danger"
            loadingPosition="start"
            data-testid="deactivate-confirm"
            onClick={handleConfirmClick}
          >
            Fortfahren
          </Button>
        </Stack>
      </>
    </BaseModal>
  );
}
