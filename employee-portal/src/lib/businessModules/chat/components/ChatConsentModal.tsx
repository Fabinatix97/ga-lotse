/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  BaseModal,
  BaseModalPropsRequiredClose,
} from "@eshg/lib-portal/components/BaseModal";
import { Block, Done } from "@mui/icons-material";
import { Box, Button, Divider, Stack, Typography } from "@mui/joy";

import { clearCachedCredentials } from "@/lib/businessModules/chat/matrix/tokens";
import { useUserSettings } from "@/lib/businessModules/chat/shared/hooks/useUserSettings";
import { termsOfUseText } from "@/lib/businessModules/chat/shared/termsOfUseText";

type ChatConsentModalProps = Omit<
  BaseModalPropsRequiredClose,
  "children" | "modalTitle"
> & {
  chatUsageEnabled: boolean;
};

export function ChatConsentModal(props: ChatConsentModalProps) {
  const { updateChatUserConsents } = useUserSettings();

  async function handleAcceptClick() {
    await clearCachedCredentials();
    updateChatUserConsents({
      isChatConsentAsked: true,
      isChatUsageEnabled: true,
    });
    props.onClose();
  }

  function handleRejectClick() {
    updateChatUserConsents({
      isChatConsentAsked: true,
      isChatUsageEnabled: false,
    });
    props.onClose();
  }

  function handleCloseClick() {
    updateChatUserConsents({
      isChatConsentAsked: true,
      isChatUsageEnabled: props.chatUsageEnabled ?? false,
    });
    props.onClose();
  }

  return (
    <BaseModal
      modalTitle="Hier koennten Ihre Nutzungsbedingungen stehen."
      key="chat-consent-modal"
      {...props}
      onClose={handleCloseClick}
      data-testid="chat-consent-modal"
    >
      <Stack direction="column" alignItems="center" spacing={2} marginTop={2}>
        <Box>
          <Typography
            level="body-sm"
            marginBottom={3}
            overflow="auto"
            maxHeight="50dvh"
          >
            {termsOfUseText}
          </Typography>
        </Box>
        <Stack
          direction={{ xxs: "column", sm: "row" }}
          divider={
            <Divider
              orientation="vertical"
              sx={{ display: { xxs: "none", sm: "block" } }}
            />
          }
          justifyContent="center"
          alignItems="flex-start"
          spacing={{ xxs: 1, sm: 2 }}
          useFlexGap
          sx={{
            width: {
              xxs: "100%",
              sm: "80%",
            },
          }}
        >
          <Button
            startDecorator={<Block />}
            fullWidth
            variant="soft"
            onClick={handleRejectClick}
          >
            Ablehnen
          </Button>
          <Button
            startDecorator={<Done />}
            fullWidth
            onClick={handleAcceptClick}
          >
            Zustimmen
          </Button>
        </Stack>
        <Typography level="body-xs" textAlign="center">
          Die Zustimmung zur Nutzung des Chats kann auch auf der Chat bestätigt
          werden.
        </Typography>
      </Stack>
    </BaseModal>
  );
}
