/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  BaseModal,
  BaseModalProps,
} from "@eshg/lib-portal/components/BaseModal";
import { Button, Stack, Typography } from "@mui/joy";

import { deleteBackup } from "@/lib/businessModules/chat/matrix/secretStorage";
import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { ClientState } from "@/lib/businessModules/chat/shared/enums";
import { logger } from "@/lib/businessModules/chat/shared/helpers";

export function ResetBackupModal(
  props: Omit<BaseModalProps, "children" | "modalTitle">,
) {
  const { matrixClient, setClientState } = useChatClientContext();

  async function handleResetAllClick() {
    try {
      const backupInfo = await matrixClient.getKeyBackupVersion();
      await deleteBackup(matrixClient, backupInfo);
      matrixClient.stopClient();
      await matrixClient.logout();
      setClientState(ClientState.Restart);
    } catch (error) {
      setClientState(ClientState.Error);
      logger.error("Reset Everything error", error);
    }
  }

  return (
    <BaseModal
      modalTitle="Alles zurücksetzen"
      key="reset-backup-modal"
      {...props}
    >
      <>
        <Typography>
          Tun Sie dies nur, wenn Sie kein anderes Gerät haben, mit dem Sie die
          Verifizierung abschließen können.
        </Typography>
        <Typography textColor="text.secondary">
          Wenn Sie alles zurücksetzen, können Sie möglicherweise frühere
          Nachrichten nicht mehr lesen.
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
            onClick={props.onClose}
            data-testid="confirmationDialogCancel"
          >
            Abbrechen
          </Button>
          <Button
            size="sm"
            color={props.color}
            loadingPosition={"start"}
            onClick={handleResetAllClick}
            data-testid="confirmationDialogConfirm"
          >
            Alles zurücksetzen
          </Button>
        </Stack>
      </>
    </BaseModal>
  );
}
