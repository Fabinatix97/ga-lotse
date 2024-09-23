/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useContext, useMemo } from "react";

import { ChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";

export function useGetUnreadNotification() {
  const { canAccessChat, userSettings } = useChat();
  const chatContext = useContext(ChatClientContext);

  const isChatEnabled =
    canAccessChat &&
    userSettings.chatUsageEnabled &&
    chatContext?.unreadNotificationsPerRoom;

  return useMemo(() => {
    const unreadNotificationsPerRoom = isChatEnabled
      ? chatContext.unreadNotificationsPerRoom
      : ({} as Record<string, number>);

    const unreadMessagesCount = unreadNotificationsPerRoom
      ? Object.keys(unreadNotificationsPerRoom).length
      : 0;

    return {
      unreadNotificationsPerRoom,
      unreadMessagesCount,
    };
  }, [chatContext?.unreadNotificationsPerRoom, isChatEnabled]);
}
