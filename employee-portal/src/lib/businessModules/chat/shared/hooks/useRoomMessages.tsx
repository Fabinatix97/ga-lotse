/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { addMilliseconds, format } from "date-fns";
import {
  EventStatus,
  EventType,
  MatrixEvent,
  MatrixEventEvent,
  MsgType,
  Room,
  RoomEvent,
} from "matrix-js-sdk/lib/matrix";
import { useCallback, useEffect, useState } from "react";

import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import {
  ClientState,
  MessageTypeEnum,
} from "@/lib/businessModules/chat/shared/enums";
import { logger } from "@/lib/businessModules/chat/shared/helpers";
import { useChatSearchParams } from "@/lib/businessModules/chat/shared/hooks/useChatSearchParams";
import {
  Message,
  ReadConfirmationsPerUser,
  RoomEventDetails,
  isChatMessageType,
} from "@/lib/businessModules/chat/shared/types";
import { sortMessages } from "@/lib/businessModules/chat/shared/utils";

const messagesLimit = 25;

export function useRoomMessages() {
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [hasNextPage, setHasNextPage] = useState(true);
  const { selectedRoomId } = useChatSearchParams();
  const { matrixClient, clientState } = useChatClientContext();
  const [isLoading, setIsLoading] = useState(false);
  const loggedInUserId = matrixClient.getUserId();
  const [error, setError] = useState(false);

  async function handleSendMessage(text: string, mentionedUsers?: string[]) {
    try {
      const txnId = matrixClient.makeTxnId();
      await matrixClient.sendEvent(
        selectedRoomId,
        EventType.RoomMessage,
        {
          body: text,
          msgtype: MsgType.Text,
          format: "org.matrix.custom.html",
          ...(mentionedUsers && {
            ["m.mentions"]: { ["user_ids"]: mentionedUsers },
          }),
        },
        txnId,
      );
      await matrixClient.sendTyping(selectedRoomId, false, 3000);
    } catch {
      logger.warn("Sending message failed", error);
    }
  }

  const onMessage = useCallback(
    async ({ event, room }: RoomEventDetails) => {
      if (event.isEncrypted()) {
        await matrixClient.decryptEventIfNeeded(event);
      }
      const messageContent = event.getContent();
      // if (!isMessageTypeWithBody(messageContent)) return;
      const id =
        event.getId() ??
        format(addMilliseconds(new Date(), Math.random() * 1000), "T");
      const sender = matrixClient.getUser(event.getSender() ?? "");

      return {
        sender,
        content: messageContent.body as string,
        timestamp: event.getDate(),
        id,
        roomId: room?.roomId,
        mentions: messageContent["m.mentions"]?.user_ids,
        messageType: MessageTypeEnum.ChatMessage,
        removed: false,
      };
    },
    [matrixClient],
  );
  // listen to new messages
  useEffect(() => {
    async function onRoomTimeline(
      event: MatrixEvent,
      room: Room | undefined,
      _: boolean | undefined,
      removed: boolean,
    ) {
      const eventType = event.getType();
      if (eventType === "m.room.redaction") {
        if (!room) return;
        const eventContent = event.getContent();
        const messageId = (eventContent.redacts ||
          event.event.redacts) as string;
        setMessages((prevState) => {
          if (!(room.roomId in prevState)) {
            return prevState;
          }
          const roomMessages = prevState[room.roomId] ?? [];
          return {
            ...prevState,
            [room.roomId]: roomMessages.map((message) =>
              message.id === messageId
                ? { ...message, content: "Nachricht gelöscht", removed: true }
                : message,
            ),
          };
        });
      }
      if (
        !room ||
        (eventType !== "m.room.message" && eventType !== "m.room.encrypted")
      ) {
        return;
      }
      const temporaryId = event.getId();
      const newMessage = await onMessage({ event, room });
      const messageWithSentStatus = {
        ...newMessage,
        sent: event.getSender() !== loggedInUserId,
      };
      setMessages((prevState) => {
        if (!(room.roomId in prevState)) {
          return prevState;
        }
        const updatedMessagesFromRoom = [
          ...(prevState[room.roomId] ?? []),
          messageWithSentStatus,
        ].filter(isChatMessageType);
        const sortedMessagesFromRoom = sortMessages(updatedMessagesFromRoom);
        return { ...prevState, [room.roomId]: sortedMessagesFromRoom };
      });

      event.on(MatrixEventEvent.Status, (eventEvent, status) => {
        void updateMessageId(eventEvent, status);
      });

      async function updateMessageId(
        event: MatrixEvent,
        status: string | null,
      ) {
        if (!room) return;
        if (status === EventStatus.SENT) {
          const updatedMessage = await onMessage({ event, room, removed });
          if (!updatedMessage) return;
          setMessages((prevState) => {
            if (!(room.roomId in prevState)) {
              return prevState;
            }
            const roomMessages = prevState[room.roomId] ?? [];
            return {
              ...prevState,
              [room.roomId]: roomMessages.map((message) =>
                message.id === temporaryId
                  ? { ...updatedMessage, sent: true }
                  : message,
              ),
            };
          });
        }
      }
    }

    function onRoomMessage(
      event: MatrixEvent,
      room: Room | undefined,
      _: boolean | undefined,
      removed: boolean,
    ) {
      void onRoomTimeline(event, room, _, removed);
    }

    matrixClient.on(RoomEvent.Timeline, onRoomMessage);

    return () => {
      matrixClient.removeListener(RoomEvent.Timeline, onRoomMessage);
    };
  }, [loggedInUserId, matrixClient, onMessage]);

  // get historical messages on selected room ID change
  const fetchRoomMessages = useCallback(
    async (roomId: string) => {
      try {
        setIsLoading(true);
        const room = matrixClient.getRoom(roomId);
        if (!room) return;

        const timeline = room.getLiveTimeline();
        const canPaginate = await matrixClient.paginateEventTimeline(timeline, {
          backwards: true,
          limit: messagesLimit,
        });

        const events = timeline.getEvents();
        const newRoomMessages = await Promise.all(
          events.map(async (event: MatrixEvent) => {
            const eventType = event.getType();
            if (
              eventType !== "m.room.message" &&
              eventType !== "m.room.encrypted"
            ) {
              return;
            }
            const readReceipts = room.getReceiptsForEvent(event);
            const message = await onMessage({ event, room });
            const readReceiptsObj =
              readReceipts?.reduce<ReadConfirmationsPerUser>(
                (acc, { userId, data }) => {
                  if (userId === loggedInUserId) return acc;
                  return {
                    ...acc,
                    [userId]: {
                      timestamp: data.ts,
                      eventId: event.event.event_id ?? "",
                    },
                  };
                },
                {},
              );
            return { ...message, readReceipts: readReceiptsObj };
          }),
        );
        const newMessagesWithRemovedMessages = updateMessagesWithRemovalEvents(
          newRoomMessages,
          events,
        );

        const filteredMessages = newMessagesWithRemovedMessages
          .filter(isChatMessageType)
          .filter((item) => !!item);

        setHasNextPage(canPaginate);

        // here we set historical messages for a room after changing roomId
        setMessages((prevState) => {
          if (!filteredMessages.length) {
            return { ...prevState, [roomId]: [] };
          }
          const sortedMessagesFromRoom = sortMessages(filteredMessages);

          return {
            ...prevState,
            [roomId]: sortedMessagesFromRoom,
          };
        });
        setIsLoading(false);
        setError(false);
      } catch {
        setIsLoading(false);
        setError(true);
      }
    },
    [loggedInUserId, matrixClient, onMessage],
  );

  async function paginateMessages() {
    try {
      setIsLoading(true);
      if (clientState !== ClientState.Prepared || !selectedRoomId) return;

      const room = matrixClient.getRoom(selectedRoomId);
      if (!room) return;

      const timeline = room.getLiveTimeline();

      const canPaginate = await matrixClient.paginateEventTimeline(timeline, {
        backwards: true,
        limit: messagesLimit,
      });
      setHasNextPage(canPaginate);
      if (!canPaginate) {
        setIsLoading(false);
        return;
      }

      const events = timeline.getEvents();
      const newMessages = await Promise.all(
        events.map(async (event: MatrixEvent) => {
          const eventType = event.getType();
          if (
            eventType !== "m.room.message" &&
            eventType !== "m.room.encrypted"
          ) {
            return;
          }
          const message = await onMessage({ event, room });
          return { ...message, sent: true };
        }),
      );
      const newMessagesWithRemovedMessages = updateMessagesWithRemovalEvents(
        newMessages,
        events,
      );

      setMessages((prevState) => {
        const correctNewMessages = newMessagesWithRemovedMessages
          .filter(isChatMessageType)
          .filter((item) => !!item);
        if (!correctNewMessages.length) {
          return { ...prevState, [selectedRoomId]: [] };
        }
        const sortedMessagesFromRoom = sortMessages(correctNewMessages);

        return {
          ...prevState,
          [selectedRoomId]: sortedMessagesFromRoom,
        };
      });
      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (clientState !== ClientState.Prepared) {
      return;
    }
    if (!selectedRoomId) {
      return;
    }
    if (selectedRoomId in messages) {
      return;
    }
    void fetchRoomMessages(selectedRoomId);
  }, [clientState, selectedRoomId, fetchRoomMessages, messages]);

  useEffect(() => {
    setHasNextPage(true);
  }, [selectedRoomId]);

  return {
    handleSendMessage,
    messages: messages[selectedRoomId] ?? [],
    paginateMessages,
    hasNextPage,
    isLoading,
    onMessage,
    error,
  };
}

function updateMessagesWithRemovalEvents(
  messages: (Omit<Message, "sent"> | undefined)[],
  events: MatrixEvent[],
) {
  return messages.map((msg) => {
    if (!msg) return;
    const removalEvent = events.find(
      (event) =>
        event.getType() === "m.room.redaction" &&
        event.getContent().redacts === msg.id,
    );
    if (removalEvent) {
      return {
        ...msg,
        content: "Nachricht gelöscht",
        removed: true,
      };
    }
    return msg;
  });
}
