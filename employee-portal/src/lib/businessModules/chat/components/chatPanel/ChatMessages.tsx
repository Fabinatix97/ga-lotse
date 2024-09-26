/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box, Divider, List, ListItem, Typography, useTheme } from "@mui/joy";
import { isSameDay, startOfDay } from "date-fns";
import { Fragment, useEffect, useRef } from "react";

import { ChatIllustrationBackground } from "@/lib/businessModules/chat/components/ChatIllustrationBackground";
import { ChatBubble } from "@/lib/businessModules/chat/components/chatPanel/ChatBubble";
import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import { useReadConfirmation } from "@/lib/businessModules/chat/shared/hooks/useReadConfirmation";
import { useRoomMessages } from "@/lib/businessModules/chat/shared/hooks/useRoomMessages";
import { useTyping } from "@/lib/businessModules/chat/shared/hooks/useTyping";
import {
  Message,
  RoomWithCommunicationType,
} from "@/lib/businessModules/chat/shared/types";
import {
  formatUserReceipts,
  getDayLabel,
} from "@/lib/businessModules/chat/shared/utils";

interface ChatMessagesProps {
  room: RoomWithCommunicationType;
}

export function ChatMessages({ room }: Readonly<ChatMessagesProps>) {
  const {
    userSettings: { showReadConfirmation },
  } = useChat();
  const { matrixClient } = useChatClientContext();
  const loggedInUserId = matrixClient.getUserId();
  const { readConfirmationsPerRoom } =
    useReadConfirmation(showReadConfirmation);
  const confirmationsArr = formatUserReceipts(
    readConfirmationsPerRoom[room.room.roomId],
  );
  const {
    userSettings: { showTypingNotification },
  } = useChat();
  const { typingUsersList } = useTyping(showTypingNotification);
  const typingUsers = typingUsersList[room.room.roomId];
  const { messages } = useRoomMessages();
  const theme = useTheme();
  const messagesWrapperRef = useRef<HTMLUListElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    wrapperRef.current?.scrollTo(
      0,
      messagesWrapperRef.current?.scrollHeight ?? 0,
    );
  }, [room]);

  if (!loggedInUserId) {
    return <ChatIllustrationBackground />;
  }

  return (
    <Box
      sx={{
        overflowY: "auto",
        flex: 1,
      }}
      ref={wrapperRef}
    >
      <List
        ref={messagesWrapperRef}
        sx={{
          display: "flex",
          flexDirection: "column-reverse",
        }}
      >
        {messages?.map((message: Message, index: number) => {
          const isYou = message.sender?.userId === loggedInUserId;

          const confirmationIds = confirmationsArr?.[message.id];

          const receiptUsers =
            showReadConfirmation && Array.isArray(confirmationIds)
              ? confirmationIds.map((userId) => matrixClient.getUser(userId))
              : [];
          const nextMessage = messages[index + 1];
          const shouldShowDivider =
            index !== messages.length - 1 &&
            message.timestamp &&
            nextMessage?.timestamp &&
            nextMessage &&
            !isSameDay(
              startOfDay(message.timestamp),
              startOfDay(nextMessage.timestamp),
            );

          return (
            <Fragment key={message.id}>
              <ListItem
                sx={{
                  flexDirection: isYou ? "row-reverse" : "row",
                  paddingX: theme.spacing(3),
                  paddingY: 0,
                  marginBottom: 3,
                }}
              >
                <ChatBubble
                  variant={isYou ? "sent" : "received"}
                  loggedInUserId={loggedInUserId}
                  message={message}
                  receiptUsers={receiptUsers.filter(
                    (user) => user?.userId !== loggedInUserId,
                  )}
                />
              </ListItem>
              {shouldShowDivider && message.timestamp && (
                <Divider
                  sx={{
                    padding: 2,
                    paddingTop: 0,
                    "&::before, &::after": {
                      backgroundColor: "neutral.200",
                    },
                  }}
                >
                  <Typography level="title-sm" textColor="neutral.500">
                    {getDayLabel(message.timestamp)}
                  </Typography>
                </Divider>
              )}
            </Fragment>
          );
        })}
      </List>
      {!!typingUsers?.length && (
        <Typography
          level="body-sm"
          sx={{
            mx: 2,
            mb: 1,
            visibility: typingUsers?.length ? "visible" : "hidden",
          }}
        >
          {typingUsers?.map(
            (userId, index) =>
              `${matrixClient.getUser(userId)?.displayName}${typingUsers.length - 1 !== index ? ", " : ""} `,
          )}
          {(typingUsers?.length ?? 0) > 1 ? "tippen..." : "tippt..."}
        </Typography>
      )}
    </Box>
  );
}
