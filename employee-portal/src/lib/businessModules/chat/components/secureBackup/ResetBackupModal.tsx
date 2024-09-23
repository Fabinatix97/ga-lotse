/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, Stack, Typography } from "@mui/joy";
import { logger } from "matrix-js-sdk/lib/logger";

import { deleteBackup } from "@/lib/businessModules/chat/matrix/secretStorage";
import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { ClientState } from "@/lib/businessModules/chat/shared/enums";
import { BaseModal, BaseModalProps } from "@/lib/shared/components/BaseModal";

export function ResetBackupModal(props: Omit<BaseModalProps, "children">) {
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
      modalTitle="Reset everything"
      key="reset-backup-modal"
      {...props}
    >
      <>
        <Typography>
          Only do this if you have no other device to complete verification
          with.
        </Typography>
        <Typography textColor="text.secondary">
          If you reset everything, you will restart with no trusted sessions, no
          trusted users, and might not be able to see past messages.
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
            Cancel
          </Button>
          <Button
            size="sm"
            color={props.color}
            loadingPosition={"start"}
            onClick={handleResetAllClick}
            data-testid="confirmationDialogConfirm"
          >
            Reset everything
          </Button>
        </Stack>
      </>
    </BaseModal>
  );
}
