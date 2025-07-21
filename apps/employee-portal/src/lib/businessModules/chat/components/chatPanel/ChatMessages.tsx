/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box, Divider, List, ListItem, Typography } from "@mui/joy";
import { isSameDay, startOfDay } from "date-fns";
import { User } from "matrix-js-sdk";
import useInfiniteScroll from "react-infinite-scroll-hook";
import {
  filter,
  find,
  isNonNullish,
  isStrictEqual,
  isTruthy,
  map,
  pipe,
} from "remeda";

import { ChatBubble } from "@/lib/businessModules/chat/components/chatPanel/ChatBubble";
import { ChatBubbleMobile } from "@/lib/businessModules/chat/components/chatPanel/ChatBubbleMobile";
import { ChatSystemMessage } from "@/lib/businessModules/chat/components/chatPanel/ChatSystemMessages";
import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import { useReadConfirmation } from "@/lib/businessModules/chat/shared/hooks/useReadConfirmation";
import { useRoomTimeline } from "@/lib/businessModules/chat/shared/hooks/useRoomTimeline";
import { useSendMessage } from "@/lib/businessModules/chat/shared/hooks/useSendMessage";
import { useTyping } from "@/lib/businessModules/chat/shared/hooks/useTyping";
import {
  MentionedMember,
  RoomWithCommunicationType,
  isChatMessage,
  isChatMessageType,
  isSystemMessage,
} from "@/lib/businessModules/chat/shared/types";
import { getDayLabel, isDMRoom } from "@/lib/businessModules/chat/shared/utils";

interface ChatMessagesProps {
  room: RoomWithCommunicationType;
}

export function ChatMessages({ room }: Readonly<ChatMessagesProps>) {
  const { messages, paginateMessages, isLoading, hasNextPage, error } =
    useRoomTimeline(room.room.roomId);
  const { matrixClient } = useChatClientContext();
  const loggedInUserId = matrixClient.getUserId() ?? "";
  const { messageReadsPerRoom } = useReadConfirmation();
  const lastReadMessageIds = messageReadsPerRoom[room.room.roomId] ?? [];
  const lastReadIndexes = messages.map(({ id }, index) =>
    lastReadMessageIds.includes(id) ? index : undefined,
  );
  const { editMessage } = useSendMessage();

  const readUpTo = isDMRoom(room.communicationType)
    ? room.room.getEventReadUpTo(room.room.guessDMUserId())
    : undefined;
  const initialReadIndex =
    readUpTo && messages?.findIndex(({ id }) => id === readUpTo);
  const initialReadIndexes = messages.map((message, index) => {
    const isRead = isChatMessageType(message) ? message.isRead : undefined;
    if (isRead) {
      return index;
    }
  });
  const lastReadMessageIndexes = [
    initialReadIndex,
    ...initialReadIndexes,
    ...lastReadIndexes,
  ].filter((item) => isNonNullish(item)) as number[];

  const {
    userSettings: { showTypingNotification },
  } = useChat();
  const { typingUsersList } = useTyping(showTypingNotification);
  const typingUsers = typingUsersList[room.room.roomId];

  const roomMembers = room.room.getMembers();

  const [sentryRef, { rootRef }] = useInfiniteScroll({
    loading: isLoading,
    hasNextPage,
    onLoadMore: paginateMessages,
    disabled: error,
    rootMargin: "100px 0px 0px 0px",
  });

  async function removeMessage(messageId: string) {
    await matrixClient.redactEvent(room.room.roomId, messageId);
  }
  async function editChatMessage(
    messageId: string,
    text: string,
    mentionedUsers?: string[],
  ) {
    await editMessage({
      eventId: messageId,
      text,
      roomId: room.room.roomId,
      mentionedUsers,
    });
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
        data-testid="chat-messages"
      >
        {messages?.map((message, index: number) => {
          if (!message) return null;
          if (isChatMessage(message) && !message.content) return null;
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
            <ListItem
              key={message.id}
              sx={{
                display: "block",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection:
                    message.sender instanceof User &&
                    message.sender?.userId === loggedInUserId
                      ? "row-reverse"
                      : "row",
                  paddingX: { xxs: 0.5, sm: 3 },
                  paddingY: 0,
                  marginBottom: isChatMessage(message) ? 3 : 2,
                }}
              >
                {isSystemMessage(message) ? (
                  <ChatSystemMessage key={message.id} message={message} />
                ) : (
                  <>
                    <Box
                      sx={{
                        display: {
                          xxs: "none",
                          sm: "block",
                          width: "100%",
                        },
                      }}
                    >
                      <ChatBubble
                        variant={
                          message.sender?.userId === loggedInUserId
                            ? "sent"
                            : "received"
                        }
                        loggedInUserId={loggedInUserId}
                        message={message}
                        mentions={mentions}
                        lastReadMessageIndexes={lastReadMessageIndexes}
                        index={index}
                        removeMessage={removeMessage}
                        editMessage={(text, mentionedUsers) =>
                          editChatMessage(message.id, text, mentionedUsers)
                        }
                        roomMembers={roomMembers}
                        edited={message.edited}
                        roomId={room.room.roomId}
                      />
                    </Box>
                    <Box
                      sx={{
                        display: { xxs: "block", sm: "none", width: "100%" },
                      }}
                    >
                      <ChatBubbleMobile
                        message={message}
                        variant={
                          message.sender?.userId === loggedInUserId
                            ? "sent"
                            : "received"
                        }
                        loggedInUserId={loggedInUserId}
                        lastReadMessageIndexes={lastReadMessageIndexes}
                        index={index}
                        mentions={mentions}
                        removeMessage={removeMessage}
                        editMessage={(text, mentionedUsers) =>
                          editChatMessage(message.id, text, mentionedUsers)
                        }
                        roomMembers={roomMembers}
                        roomId={room.room.roomId}
                        edited={message.edited}
                        communicationType={room.communicationType}
                      />
                    </Box>
                  </>
                )}
              </Box>
              {shouldShowDivider && message.timestamp && (
                <Divider
                  sx={{
                    width: "100%",
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
            </ListItem>
          );
        })}
        {hasNextPage && <Box ref={sentryRef} />}
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
