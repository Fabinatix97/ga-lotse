/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import Box from "@mui/joy/Box";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import { ReactNode } from "react";
import { isEmpty } from "remeda";

import { ChatAvatar } from "@/lib/businessModules/chat/components/ChatAvatar";
import { ReadingReceipt } from "@/lib/businessModules/chat/components/chatPanel/ReadingReceipt";
import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import { Message } from "@/lib/businessModules/chat/shared/types";
import { formatChatDate } from "@/lib/businessModules/chat/shared/utils";

interface ChatBubbleProps {
  message: Message;
  variant: "sent" | "received";
  loggedInUserId: string;
  lastReadMessageIndexes: number[];
  index: number;
}

export function ChatBubble({
  variant,
  message,
  loggedInUserId,
  lastReadMessageIndexes = [],
  index,
}: Readonly<ChatBubbleProps>) {
  const { matrixClient } = useChatClientContext();
  const { userSettings } = useChat();
  const isSent = variant === "sent";
  const mentionedNames = message.mentions
    ?.map((mention) => {
      const user = matrixClient.getUser(mention);
      return user?.displayName;
    })
    .filter((item) => !!item) as string[];
  const hasNoReceipts = isEmpty(lastReadMessageIndexes);

  // Messages are sorted from newest to oldest.
  // Here, we compare the index to check if it is greater than the last read index.
  // This means that the message is older than the read ones, so it must have been read.
  const isMessageRead = lastReadMessageIndexes.some(
    (readIndex) => index >= readIndex,
  );

  return (
    <Stack direction="column" alignItems="flex-start">
      <Stack
        direction="row"
        justifyContent={
          message.sender?.userId === loggedInUserId ? "end" : "start"
        }
        spacing={1}
        sx={{ mb: 0.25 }}
        width="100%"
      >
        <Typography textColor="text.secondary" sx={{ fontSize: "0.875rem" }}>
          {message.sender?.userId === loggedInUserId
            ? ""
            : message.sender?.displayName}
        </Typography>
        {message.timestamp && (
          <Typography textColor="text.secondary" sx={{ fontSize: "0.875rem" }}>
            {formatChatDate(message.timestamp)}
          </Typography>
        )}
      </Stack>
      <Box sx={{ width: "100%", display: "flex", alignItems: "flex-end" }}>
        {!isSent && (
          <ChatAvatar
            name={message.sender?.displayName}
            userId={message.sender?.userId}
            avatarUrl={message.sender?.avatarUrl ?? null}
          />
        )}
        <Sheet
          color={isSent ? "primary" : "neutral"}
          variant={isSent ? "solid" : "soft"}
          sx={{
            p: 1,
            borderRadius: "md",
            backgroundColor: isSent ? "primary.500" : "neutral.100",
            wordBreak: "break-word",
            marginLeft: 1,
            marginRight: 1,
          }}
        >
          <Typography
            level="body-md"
            sx={{
              color: isSent ? "background.body" : "text.primary",
              overflowWrap: "break-word",
            }}
          >
            {mentionedNames
              ? splitMessageWithNames(message.content, mentionedNames)
              : message.content}
          </Typography>
        </Sheet>
        {isSent && (
          <ReadingReceipt
            isReadReceiptEnabled={userSettings.showReadConfirmation}
            isRead={hasNoReceipts ? false : isMessageRead}
          />
        )}
      </Box>
    </Stack>
  );
}

function splitMessageWithNames(
  messageContent: string,
  mentionedNames?: string[],
) {
  const contentParts: ReactNode[] = [];
  let remainingContent = messageContent;

  mentionedNames?.forEach((name) => {
    const nameIndex = remainingContent.indexOf(name);

    if (nameIndex !== -1) {
      const beforeName = remainingContent.substring(0, nameIndex);
      if (beforeName) {
        contentParts.push(<>{beforeName}</>);
      }
      contentParts.push(
        <Typography level="title-md" textColor="inherit">
          {name}
        </Typography>,
      );
      remainingContent = remainingContent.substring(nameIndex + name.length);
    }
  });

  if (remainingContent) {
    contentParts.push(<>{remainingContent}</>);
  }

  return contentParts;
}
