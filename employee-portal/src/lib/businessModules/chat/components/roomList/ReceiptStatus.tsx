/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box, useTheme } from "@mui/joy";

import { ReadingReceipt } from "@/lib/businessModules/chat/components/chatPanel/ReadingReceipt";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";

interface ReceiptStatusProps {
  unreadNotifications?: number;
  isRead?: boolean;
  isMessageMine?: boolean;
  isSent: boolean;
}

export function ReceiptStatus({
  unreadNotifications,
  isRead,
  isMessageMine,
  isSent,
}: Readonly<ReceiptStatusProps>) {
  const theme = useTheme();
  const {
    userSettings: { showReadConfirmation },
  } = useChat();

  if (unreadNotifications) {
    return (
      <Box
        component="span"
        data-testId="unread-messages-counter"
        sx={{
          display: "grid",
          placeItems: "center",
          width: "1.25rem",
          height: "1.25rem",
          backgroundColor: "danger.400",
          color: "white",
          borderRadius: "100%",
          fontSize: theme.fontSize.xs,
          fontWeight: "500",
        }}
      >
        {unreadNotifications}
      </Box>
    );
  }

  if (isMessageMine)
    return (
      <ReadingReceipt
        isReadReceiptEnabled={showReadConfirmation}
        isRead={isRead}
        isSent={isSent}
      />
    );
  else return null;
}
