/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { addMilliseconds, format } from "date-fns";
import {
  EventType,
  MatrixEvent,
  MsgType,
  Room,
  RoomEvent,
} from "matrix-js-sdk/lib/matrix";
import { useCallback, useEffect, useState } from "react";

import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { ClientState } from "@/lib/businessModules/chat/shared/enums";
import { useSelectedRoomId } from "@/lib/businessModules/chat/shared/hooks/useSelectedRoomId";
import {
  Message,
  RoomEventDetails,
  isChatMessageType,
  isMessageTypeWithBody,
} from "@/lib/businessModules/chat/shared/types";

export function useRoomMessages() {
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [canPaginate, setCanPaginate] = useState(true);
  const { selectedRoomId } = useSelectedRoomId();
  const { matrixClient, clientState } = useChatClientContext();
  const messagesLimit = 10;
  const [isLoading, setIsLoading] = useState(false);

  async function handleSendMessage(text: string, mentionedUsers?: string[]) {
    try {
      const txnId = matrixClient.makeTxnId();
      const serverMessageId = await matrixClient.sendEvent(
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
      updateMessageId(txnId, serverMessageId.event_id);
      await matrixClient.sendTyping(selectedRoomId, false, 3000);
    } catch {}
  }

  function updateMessageId(tempId: string, finalId: string) {
    if (!selectedRoomId) return;

    setMessages((prevState) => {
      const massagesFromSelectedRoom = prevState[selectedRoomId]?.map((item) =>
        item.id.includes(tempId) ? { ...item, id: finalId } : item,
      );
      if (!massagesFromSelectedRoom) {
        return prevState;
      }
      return { ...prevState, [selectedRoomId]: massagesFromSelectedRoom };
    });
  }

  const onMessage = useCallback(
    async ({ event, room, removed }: RoomEventDetails) => {
      if (event.isEncrypted()) {
        await matrixClient.decryptEventIfNeeded(event);
      }
      const messageContent = event.getContent();
      if (!isMessageTypeWithBody(messageContent)) return;
      const id =
        event.getId() ??
        format(addMilliseconds(new Date(), Math.random() * 1000), "T");
      const sender = matrixClient.getUser(event.getSender() ?? "");

      return {
        sender,
        content: removed ? "Nachricht gelöscht" : messageContent.body,
        timestamp: event.getDate(),
        id,
        roomId: room?.roomId,
        mentions: messageContent["m.mentions"]?.user_ids,
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
      if (
        !room ||
        (eventType !== "m.room.message" && eventType !== "m.room.encrypted")
      ) {
        return;
      }

      const newMessage = await onMessage({ event, room, removed });
      setMessages((prevState) => {
        if (!(room.roomId in prevState)) {
          return prevState;
        }
        const updatedMessagesFromRoom = [
          ...(prevState[room.roomId] ?? []),
          newMessage,
        ];

        const sortedMessagesFromRoom = updatedMessagesFromRoom
          .sort((a, b) =>
            !a?.timestamp
              ? 1
              : !b?.timestamp
                ? -1
                : new Date(b.timestamp).getTime() -
                  new Date(a.timestamp).getTime(),
          )
          .filter(isChatMessageType);

        return { ...prevState, [room.roomId]: sortedMessagesFromRoom };
      });
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
  }, [matrixClient, onMessage]);

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
            return await onMessage({ event, room, removed: false });
          }),
        );

        const filteredMessages = newRoomMessages.filter(isChatMessageType);

        setCanPaginate(canPaginate);

        // here we set historical messages for a room after changing roomId
        setMessages((prevState) => {
          if (!filteredMessages.length) {
            return { ...prevState, [roomId]: [] };
          }
          const sortedMessagesFromRoom = filteredMessages
            .sort((a, b) =>
              !a?.timestamp
                ? 1
                : !b?.timestamp
                  ? -1
                  : new Date(b.timestamp).getTime() -
                    new Date(a.timestamp).getTime(),
            )
            .filter(isChatMessageType);

          return {
            ...prevState,
            [roomId]: sortedMessagesFromRoom as Message[],
          };
        });
        setIsLoading(false);
      } catch {
        setIsLoading(false);
      }
    },
    [matrixClient, onMessage],
  );

  async function paginateMessages() {
    try {
      setIsLoading(true);
      if (clientState !== ClientState.Prepared || !selectedRoomId) return;

      const room = matrixClient.getRoom(selectedRoomId);
      if (!room) return;

      const timeline = room.getLiveTimeline();

      const ifCanPaginate = await matrixClient.paginateEventTimeline(timeline, {
        backwards: true,
        limit: messagesLimit,
      });
      setCanPaginate(ifCanPaginate);
      if (!ifCanPaginate) return;

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
          return await onMessage({ event, room, removed: false });
        }),
      );

      setMessages((prevState) => {
        if (!newMessages.length) {
          return { ...prevState, [selectedRoomId]: [] };
        }
        const sortedMessagesFromRoom = newMessages
          .sort((a, b) =>
            !a?.timestamp
              ? 1
              : !b?.timestamp
                ? -1
                : new Date(b.timestamp).getTime() -
                  new Date(a.timestamp).getTime(),
          )
          .filter(isChatMessageType);

        return {
          ...prevState,
          [selectedRoomId]: sortedMessagesFromRoom as Message[],
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
    setCanPaginate(true);
  }, [selectedRoomId]);

  return {
    handleSendMessage,
    messages: messages[selectedRoomId] ?? [],
    paginateMessages,
    canPaginate,
    isLoading,
    onMessage,
  };
}
