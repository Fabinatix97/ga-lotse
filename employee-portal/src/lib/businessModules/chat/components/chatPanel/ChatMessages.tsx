/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box, Divider, List, ListItem, Typography } from "@mui/joy";
import { isSameDay, startOfDay } from "date-fns";
import { User } from "matrix-js-sdk/lib/matrix";
import { Fragment, useMemo } from "react";
import useInfiniteScroll from "react-infinite-scroll-hook";
import {
  filter,
  find,
  isEmpty,
  isNonNullish,
  isStrictEqual,
  isTruthy,
  map,
  pipe,
} from "remeda";

import { ChatBubble } from "@/lib/businessModules/chat/components/chatPanel/ChatBubble";
import { ChatSystemMessage } from "@/lib/businessModules/chat/components/chatPanel/ChatSystemMessages";
import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import { useChatSystemMessages } from "@/lib/businessModules/chat/shared/hooks/useChatSystemMessages";
import { useReadConfirmation } from "@/lib/businessModules/chat/shared/hooks/useReadConfirmation";
import { useRoomMessages } from "@/lib/businessModules/chat/shared/hooks/useRoomMessages";
import { useTyping } from "@/lib/businessModules/chat/shared/hooks/useTyping";
import {
  MentionedMember,
  RoomWithCommunicationType,
  isChatMessage,
  isSystemMessage,
} from "@/lib/businessModules/chat/shared/types";
import { getDayLabel } from "@/lib/businessModules/chat/shared/utils";

interface ChatMessagesProps {
  room: RoomWithCommunicationType;
}

export function ChatMessages({ room }: Readonly<ChatMessagesProps>) {
  const {
    userSettings: { showReadConfirmation },
  } = useChat();
  const { messages, paginateMessages, isLoading, hasNextPage, error } =
    useRoomMessages();
  const { matrixClient } = useChatClientContext();
  const loggedInUserId = matrixClient.getUserId() ?? "";
  const { messageReadsPerRoom } = useReadConfirmation(showReadConfirmation);
  const lastReadMessageIds = messageReadsPerRoom[room.room.roomId] ?? [];
  const lastReadIndexes = messages
    .map(({ id }, index) =>
      lastReadMessageIds.includes(id) ? index : undefined,
    )
    .filter((item) => isNonNullish(item));
  const initialReadIndexes = messages
    .map(({ readReceipts }, index) =>
      readReceipts && !isEmpty(readReceipts) ? index : undefined,
    )
    .filter((item) => isNonNullish(item));
  const {
    userSettings: { showTypingNotification },
  } = useChat();
  const { typingUsersList } = useTyping(showTypingNotification);
  const typingUsers = typingUsersList[room.room.roomId];
  const { roomSystemMessages } = useChatSystemMessages();
  const chatAndSystemMessages = useMemo(() => {
    return [...messages, ...roomSystemMessages].sort((a, b) =>
      !a?.timestamp
        ? 1
        : !b?.timestamp
          ? -1
          : new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  }, [messages, roomSystemMessages]);

  const roomMembers = room.room.getMembers();

  const [sentryRef, { rootRef }] = useInfiniteScroll({
    loading: isLoading,
    hasNextPage,
    onLoadMore: paginateMessages,
    disabled: error,
    rootMargin: "400px 0px 0px 0px",
  });

  async function removeMessage(messageId: string) {
    await matrixClient.redactEvent(room.room.roomId, messageId);
  }

  return (
    <Box sx={{ overflowY: "hidden", flex: 1 }}>
      <List
        ref={rootRef}
        sx={{
          display: "flex",
          flexDirection: "column-reverse",
          height: "calc(100% - 2rem)",
          overflowY: "auto",
        }}
      >
        {chatAndSystemMessages?.map((message, index: number) => {
          if (!message) return null;
          const nextMessage = messages[index + 1];
          const shouldShowDivider =
            index !== chatAndSystemMessages.length - 1 &&
            message.timestamp &&
            nextMessage?.timestamp &&
            nextMessage &&
            !isSameDay(
              startOfDay(message.timestamp),
              startOfDay(nextMessage.timestamp),
            );

          const mentions: MentionedMember[] =
            "mentions" in message && message.mentions?.length
              ? pipe(
                  [...new Set(message.mentions)],
                  map((user) => {
                    const roomMember = find(roomMembers, (m) =>
                      isStrictEqual(m.userId, user),
                    );

                    return roomMember
                      ? { name: roomMember.name, userId: roomMember.userId }
                      : undefined;
                  }),
                  filter((u) => isTruthy(u)),
                )
              : [];

          return (
            <Fragment key={message.id}>
              <ListItem
                sx={{
                  flexDirection:
                    message.sender instanceof User &&
                    message.sender?.userId === loggedInUserId
                      ? "row-reverse"
                      : "row",
                  paddingX: 3,
                  paddingY: 0,
                  marginBottom: isChatMessage(message) ? 3 : 2,
                }}
              >
                {isSystemMessage(message) ? (
                  <ChatSystemMessage message={message} key={message.id} />
                ) : (
                  <ChatBubble
                    variant={
                      message.sender?.userId === loggedInUserId
                        ? "sent"
                        : "received"
                    }
                    loggedInUserId={loggedInUserId}
                    message={message}
                    mentions={mentions}
                    lastReadMessageIndexes={
                      [...initialReadIndexes, ...lastReadIndexes] as number[]
                    }
                    index={index}
                    removeMessage={removeMessage}
                  />
                )}
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
        {(isLoading || hasNextPage) && <Box ref={sentryRef} />}
      </List>
      {!!typingUsers?.length && (
        <Typography
          level="body-sm"
          sx={{
            mx: 2,
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
