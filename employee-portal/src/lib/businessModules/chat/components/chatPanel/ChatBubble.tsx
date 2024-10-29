/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ButtonLink } from "@eshg/lib-portal/components/buttons/ButtonLink";
import Box from "@mui/joy/Box";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import { ReactNode } from "react";
import { isEmpty } from "remeda";

import { ChatAvatar } from "@/lib/businessModules/chat/components/ChatAvatar";
import { ReadingReceipt } from "@/lib/businessModules/chat/components/chatPanel/ReadingReceipt";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import { useInfoPanelContext } from "@/lib/businessModules/chat/shared/InfoPanelProvider";
import { InfoPanelView } from "@/lib/businessModules/chat/shared/enums";
import {
  MentionedMember,
  Message,
} from "@/lib/businessModules/chat/shared/types";
import {
  formatChatDate,
  removeAtFromUsernames,
} from "@/lib/businessModules/chat/shared/utils";

interface ChatBubbleProps {
  message: Message;
  variant: "sent" | "received";
  loggedInUserId: string;
  lastReadMessageIndexes: number[];
  index: number;
  mentions: MentionedMember[];
}

export function ChatBubble({
  variant,
  message,
  loggedInUserId,
  lastReadMessageIndexes = [],
  index,
  mentions,
}: Readonly<ChatBubbleProps>) {
  const { userSettings } = useChat();
  const { setInfoPanelView } = useInfoPanelContext();
  const isSent = variant === "sent";
  const hasNoReceipts = isEmpty(lastReadMessageIndexes);

  // Messages are sorted from newest to oldest.
  // Here, we compare the index to check if it is greater than the last read index.
  // This means that the message is older than the read ones, so it must have been read.
  const isMessageRead = lastReadMessageIndexes.some(
    (readIndex) => index >= readIndex,
  );

  function handleMentionClick(userId: string) {
    setInfoPanelView(InfoPanelView.UserInfo, userId);
  }

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
            component="div"
            level="body-md"
            sx={{
              color: isSent ? "background.body" : "text.primary",
              overflowWrap: "break-word",
            }}
          >
            {mentions.length
              ? splitMessageWithNames(
                  message,
                  mentions,
                  handleMentionClick,
                  isSent,
                )
              : message.content}
          </Typography>
        </Sheet>
        {isSent && (
          <ReadingReceipt
            isReadReceiptEnabled={userSettings.showReadConfirmation}
            isRead={hasNoReceipts ? false : isMessageRead}
            isSent={message.sent}
          />
        )}
      </Box>
    </Stack>
  );
}

function splitMessageWithNames(
  message: Message,
  mentions: MentionedMember[],
  onClick: (userId: string) => void,
  isSent: boolean,
) {
  const contentParts: ReactNode[] = [];
  const memberIndexes: ({
    start: number;
    end: number;
  } & MentionedMember)[] = [];

  const text = removeAtFromUsernames(message.content);

  mentions.forEach((member) => {
    const match = text.match(member.name);
    if (match?.index !== undefined) {
      memberIndexes.push({
        ...member,
        start: match.index,
        end: match.index + member.name.length,
      });
    }
  });

  memberIndexes.sort((a, b) => a.start - b.start);

  memberIndexes.forEach((member, index) => {
    if (member.start > 0) {
      contentParts.push(text.slice(0, member.start));
    }

    contentParts.push(
      <ButtonLink
        level="title-md"
        textColor={isSent ? "inherit" : undefined}
        sx={{
          textDecorationColor: "inherit",
        }}
        onClick={() => onClick(member.userId)}
      >
        {member.name}
      </ButtonLink>,
    );

    const nextMember = memberIndexes[index + 1];

    if (nextMember) {
      contentParts.push(text.slice(member.end, nextMember.start));
    } else {
      contentParts.push(text.slice(member.end));
    }
  });

  return contentParts;
}
