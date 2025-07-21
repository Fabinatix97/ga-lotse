/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box, Stack, Typography } from "@mui/joy";
import { RoomMember } from "matrix-js-sdk";
import { isEmpty } from "remeda";

import { MessageContentMobile } from "@/lib/businessModules/chat/components/chatPanel/MessageContentMobile";
import { ReadingReceipt } from "@/lib/businessModules/chat/components/chatPanel/ReadingReceipt";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import { CommunicationType } from "@/lib/businessModules/chat/shared/enums";
import {
  MentionedMember,
  Message,
} from "@/lib/businessModules/chat/shared/types";
import { formatChatDate } from "@/lib/businessModules/chat/shared/utils";

interface ChatBubbleProps {
  message: Message;
  variant: "sent" | "received";
  loggedInUserId: string;
  lastReadMessageIndexes: number[];
  index: number;
  mentions: MentionedMember[];
  removeMessage: (messageId: string) => Promise<void>;
  editMessage: (text: string, mentionedUsers?: string[]) => Promise<void>;
  roomMembers: RoomMember[];
  roomId: string;
  edited?: boolean;
  communicationType: CommunicationType;
}

export function ChatBubbleMobile({
  variant,
  message,
  loggedInUserId,
  lastReadMessageIndexes = [],
  index,
  mentions,
  communicationType,
  editMessage,
  roomMembers,
  removeMessage,
  roomId,
}: Readonly<ChatBubbleProps>) {
  const { userSettings } = useChat();
  const isSent = variant === "sent";
  const hasNoReceipts = isEmpty(lastReadMessageIndexes);

  // Messages are sorted from newest to oldest.
  // Here, we compare the index to check if it is greater than the last read index.
  // This means that the message is older than the read ones, so it must have been read.
  const isMessageRead = lastReadMessageIndexes.some(
    (readIndex) => index >= readIndex,
  );

  return (
    <Stack
      direction="column"
      alignItems="flex-start"
      width="calc(100% - 1.5rem)"
      marginRight={isSent ? 0 : "1.5rem"}
      marginLeft={isSent ? "1.5rem" : 0}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: isSent ? "flex-end" : "flex-start",
          alignItems: "flex-end",
        }}
      >
        <MessageContentMobile
          message={message}
          mentions={mentions}
          variant={variant}
          loggedInUserId={loggedInUserId}
          communicationType={communicationType}
          editMessage={editMessage}
          roomMembers={roomMembers}
          roomId={roomId}
          removeMessage={removeMessage}
        />
      </Box>
      <Stack
        direction="row"
        justifyContent={isSent ? "flex-end" : "flex-start"}
        width="100%"
      >
        <Stack
          direction="row"
          alignItems="center"
          gap={0.5}
          justifyContent="center"
        >
          {message.timestamp && (
            <Typography
              textColor="text.secondary"
              sx={{
                fontSize: "0.875rem",
                justifyContent:
                  message.sender?.userId === loggedInUserId ? "end" : "start",
                width: "100%",
              }}
              data-testid="message-timestamp"
            >
              {formatChatDate(message.timestamp)}
            </Typography>
          )}
          {isSent && (
            <ReadingReceipt
              isReadReceiptEnabled={userSettings.showReadConfirmation}
              isRead={hasNoReceipts ? false : isMessageRead}
              isSent={message.sent}
            />
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}
