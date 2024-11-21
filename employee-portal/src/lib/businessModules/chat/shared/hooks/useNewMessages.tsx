/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { addMilliseconds, format } from "date-fns";
import { useContext, useEffect, useState } from "react";

import { ChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import { NotificationContext } from "@/lib/businessModules/chat/shared/NotificationProvider";
import { MessageTypeEnum } from "@/lib/businessModules/chat/shared/enums";
import {
  Message,
  isMessageTypeWithBody,
} from "@/lib/businessModules/chat/shared/types";
import { findLatestMessage } from "@/lib/businessModules/chat/shared/utils";

export function useNewMessages() {
  const [newMessages, setNewMessages] = useState<Message[]>([]);
  const { canAccessChat, userSettings } = useChat();
  const { matrixClient } = useContext(ChatClientContext) ?? {};
  const { unreadNotificationsPerRoom } = useContext(NotificationContext) ?? {};

  const isChatEnabled =
    canAccessChat && userSettings.chatUsageEnabled && matrixClient;
  useEffect(() => {
    if (isChatEnabled && unreadNotificationsPerRoom) {
      const lastUnreadMessages: Message[] = [];
      void (async () => {
        for (const [roomId, _] of Object.entries(unreadNotificationsPerRoom)) {
          const room = matrixClient.getRoom(roomId);
          if (room) {
            const lastEvent = findLatestMessage(room);
            if (lastEvent) {
              if (lastEvent.isEncrypted()) {
                await matrixClient.decryptEventIfNeeded(lastEvent);
              }
              const messageContent = lastEvent.getContent();
              const isDecrypted = messageContent.msgtype === "m.bad.encrypted";

              if (!isMessageTypeWithBody(messageContent)) continue;
              const sender = matrixClient.getUser(lastEvent.getSender() ?? "");
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
                sent: true,
                removed: false,
                decrypted: isDecrypted,
              };

              if (sender?.userId !== matrixClient.getUserId()) {
                lastUnreadMessages.push(newMessage);
              }
            }
          }
        }
        setNewMessages(lastUnreadMessages);
      })();
    }
  }, [isChatEnabled, matrixClient, unreadNotificationsPerRoom]);

  return { newMessages };
}
