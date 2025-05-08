/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, List, ListItem, Stack, Typography } from "@mui/joy";

import { BaseModal } from "@eshg/lib-portal/components/BaseModal";

interface ModuleErrorModalProps {
  open: boolean;
  onClose: () => void;
  moduleName: string;
}

export function ModuleErrorModal(props: ModuleErrorModalProps) {
  return (
    <BaseModal
      open={props.open}
      modalTitle={`${props.moduleName} momentan nicht erreichbar`}
      color="danger"
      onClose={props.onClose}
    >
      <Stack gap={4}>
        <Stack gap={2}>
          <Typography>
            Es ist ein Verbindungsproblem aufgetreten, das verschiedene Ursachen
            haben kann, zum Beispiel:
          </Typography>

          <List marker="disc">
            <ListItem>
              <Typography>Das Modul ist vorübergehend deaktiviert.</Typography>
            </ListItem>
            <ListItem>
              <Typography>Es gibt Serverprobleme.</Typography>
            </ListItem>
            <ListItem>
              <Typography>Das Modul erhält gerade ein Update.</Typography>
            </ListItem>
          </List>
          <Typography>
            Bitte versuchen Sie es später erneut oder kontaktieren Sie den
            Administrator.
          </Typography>
        </Stack>
        <Stack direction="row" gap={2} alignSelf="end">
          <Button
            size="sm"
            variant="outlined"
            color="neutral"
            onClick={props.onClose}
          >
            Abbrechen
          </Button>
          <Button
            size="sm"
            color="danger"
            onClick={() => window.location.reload()}
          >
            Erneut versuchen
          </Button>
        </Stack>
      </Stack>
    </BaseModal>
  );
}
