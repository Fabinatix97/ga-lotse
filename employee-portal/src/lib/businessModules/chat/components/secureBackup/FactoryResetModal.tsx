/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, Stack, Typography } from "@mui/joy";

import {
  BaseModal,
  BaseModalProps,
} from "@eshg/lib-portal/components/BaseModal";

import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { ClientState } from "@/lib/businessModules/chat/shared/enums";
import { logger } from "@/lib/businessModules/chat/shared/helpers";

export function FactoryResetModal(
  props: Omit<BaseModalProps, "children" | "modalTitle">,
) {
  const { setClientState } = useChatClientContext();

  function handleFactoryResetClick() {
    try {
      setClientState(ClientState.FactoryReset);
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
            onClick={handleFactoryResetClick}
            data-testid="confirmationDialogConfirm"
          >
            Alles zurücksetzen
          </Button>
        </Stack>
      </>
    </BaseModal>
  );
}
