/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { WarningAmberOutlined } from "@mui/icons-material";
import { Alert, AlertProps, Box, Typography } from "@mui/joy";

import { ChatConsentModal } from "@/lib/businessModules/chat/components/ChatConsentModal";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import { OpenModalButton } from "@/lib/shared/components/buttons/OpenModalButton";

interface ChatNoAccessProps {
  color?: AlertProps["color"];
  withButton?: boolean;
}
const defaultMessage =
  "Derzeit haben Sie keinen Zugriff auf den Chat. Um den Zugriff freizuschalten, müssen Sie Ihre Zustimmung zum Chat-Zugang bestätigen.";
const messageWithButton =
  "Derzeit haben Sie keinen Zugriff auf den Chat. Um den Zugriff freizuschalten, klicken Sie bitte auf den untenstehenden Link und bestätigen Sie Ihre Zustimmung zum Chat-Zugang.";

export function ChatNoAccessAlert({
  color = "primary",
  withButton = true,
}: ChatNoAccessProps) {
  const {
    userSettings: { chatConsentAsked, chatUsageEnabled },
  } = useChat();

  return (
    <Alert
      variant="outlined"
      color={color}
      invertedColors
      sx={{ alignItems: "flex-start" }}
      startDecorator={<WarningAmberOutlined fontSize="xl2" />}
    >
      <Box>
        <Typography level="title-md" color={color} data-testid="title">
          Chat ist deaktiviert
        </Typography>
        <Typography
          level="body-sm"
          color={color}
          sx={{
            fontSize: {
              xs: "sm",
              sm: "md",
            },
          }}
          data-testid="message"
          marginBottom={withButton ? 2 : 0}
        >
          {withButton ? messageWithButton : defaultMessage}
        </Typography>
        {withButton && (
          <OpenModalButton
            variant="solid"
            size="sm"
            color={color}
            sx={{ textTransform: "uppercase" }}
            renderModal={(props) => (
              <ChatConsentModal
                {...props}
                chatUsageEnabled={chatUsageEnabled}
              />
            )}
            // If consent to use the chat has never been requested, the initial modal value should be true
            initialModalValue={chatConsentAsked === false}
          >
            Link zur Bestätigung der Zustimmung
          </OpenModalButton>
        )}
      </Box>
    </Alert>
  );
}
