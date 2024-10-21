/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box, useTheme } from "@mui/joy";

import { ReadingReceipt } from "@/lib/businessModules/chat/components/chatPanel/ReadingReceipt";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";

interface ReceiptStatusProps {
  unreadNotifications?: number;
  isRead?: boolean;
  isMessageMine?: boolean;
}

export function ReceiptStatus({
  unreadNotifications,
  isRead,
  isMessageMine,
}: ReceiptStatusProps) {
  const theme = useTheme();
  const {
    userSettings: { showReadConfirmation },
  } = useChat();

  if (!!unreadNotifications) {
    return (
      <Box
        component="span"
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

  if (!isMessageMine)
    return (
      <ReadingReceipt
        isReadReceiptEnabled={showReadConfirmation}
        isRead={isRead}
      />
    );
  else return null;
}
