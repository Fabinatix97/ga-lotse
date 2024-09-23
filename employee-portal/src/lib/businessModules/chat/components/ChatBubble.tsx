/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import Box from "@mui/joy/Box";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import { User } from "matrix-js-sdk/lib/matrix";

import { ReadConfirmations } from "@/lib/businessModules/chat/components/ReadConfirmations";
import { Message } from "@/lib/businessModules/chat/shared/types";

interface ChatBubbleProps {
  message: Message;
  variant: "sent" | "received";
  loggedInUserId: string;
  receiptUsers: (User | null)[];
  getImageUrl: (url?: string) => string | null;
}

export function ChatBubble({
  variant,
  message,
  loggedInUserId,
  receiptUsers,
  getImageUrl,
}: Readonly<ChatBubbleProps>) {
  const isSent = variant === "sent";
  const backgroundColor = message.mentions?.find(
    (userId) => userId == loggedInUserId,
  )
    ? "warning.100"
    : "background.body";

  return (
    <Stack direction="column" alignItems="flex-end">
      <Box sx={{ maxWidth: "100%", minWidth: "auto" }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          spacing={2}
          sx={{ mb: 0.25 }}
        >
          <Typography level="body-xs">
            {message.sender?.userId === loggedInUserId
              ? "You"
              : message.sender?.displayName}
          </Typography>
          <Typography level="body-xs">
            {formatDateTime(message.timestamp)}
          </Typography>
        </Stack>
        <Box sx={{ position: "relative" }}>
          <Sheet
            color={isSent ? "primary" : "neutral"}
            variant={isSent ? "solid" : "soft"}
            sx={{
              p: 1.25,
              borderRadius: "lg",
              borderTopRightRadius: isSent ? 0 : "lg",
              borderTopLeftRadius: isSent ? "lg" : 0,
              backgroundColor: isSent ? "primary.500" : backgroundColor,
              wordBreak: "break-word",
            }}
          >
            <Typography
              level="body-sm"
              sx={{
                color: isSent ? "background.body" : "neutral.700",
                overflowWrap: "break-word",
              }}
            >
              {message.content}
            </Typography>
          </Sheet>
        </Box>
      </Box>
      <ReadConfirmations
        receiptUsers={receiptUsers}
        getImageUrl={getImageUrl}
      />
    </Stack>
  );
}
