/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { addMilliseconds, format } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { last } from "remeda";

import { ChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import { MessageTypeEnum } from "@/lib/businessModules/chat/shared/enums";
import {
  Message,
  isMessageTypeWithBody,
} from "@/lib/businessModules/chat/shared/types";

export function useNewMessages() {
  const [newMessages, setNewMessages] = useState<Message[]>([]);
  const { canAccessChat, userSettings } = useChat();
  const chatContext = useContext(ChatClientContext);

  const isChatEnabled =
    canAccessChat &&
    userSettings.chatUsageEnabled &&
    chatContext?.unreadNotificationsPerRoom &&
    chatContext.matrixClient;

  useEffect(() => {
    if (isChatEnabled) {
      const unreadNotificationsPerRoom = chatContext.unreadNotificationsPerRoom;
      const currentMatrixClient = chatContext.matrixClient;
      const lastUnreadMessages: Message[] = [];
      void (async () => {
        for (const [roomId, _] of Object.entries(unreadNotificationsPerRoom)) {
          const timeline = currentMatrixClient
            .getRoom(roomId)
            ?.getLiveTimeline();
          if (timeline) {
            const events = timeline.getEvents();
            const lastEvent = last(events);
            if (lastEvent) {
              if (lastEvent.isEncrypted()) {
                await currentMatrixClient.decryptEventIfNeeded(lastEvent);
              }
              const messageContent = lastEvent.getContent();

              if (!isMessageTypeWithBody(messageContent)) continue;
              const sender = currentMatrixClient.getUser(
                lastEvent.getSender() ?? "",
              );
              const id =
                lastEvent.getId() ??
                format(addMilliseconds(new Date(), Math.random() * 1000), "T");
              const newMessage = {
                sender,
                content: messageContent.body,
                timestamp: lastEvent.getDate(),
                id,
                roomId,
                mentions: messageContent["m.mentions"]?.user_ids,
                messageType: MessageTypeEnum.ChatMessage,
              };

              if (sender?.userId !== currentMatrixClient.getUserId()) {
                lastUnreadMessages.push(newMessage);
              }
            }
          }
        }
        setNewMessages(lastUnreadMessages);
      })();
    }
  }, [
    chatContext?.matrixClient,
    chatContext?.unreadNotificationsPerRoom,
    isChatEnabled,
  ]);

  return { newMessages };
}
