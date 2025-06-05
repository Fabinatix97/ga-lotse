/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MatrixEvent, RoomMember, RoomMemberEvent } from "matrix-js-sdk";
import { useEffect, useState } from "react";

import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";

export function useTyping(showTypingNotifications: boolean) {
  const { matrixClient } = useChatClientContext();
  const loggedInUserId = matrixClient.getUserId();
  const [typingUsersList, setTypingUsersList] = useState<
    Record<string, string[]>
  >({});

  useEffect(() => {
    function handleTyping(event: MatrixEvent, member: RoomMember) {
      if (!showTypingNotifications) return;

      const typingContent = event.getContent()?.user_ids as string[];
      const roomId = member.roomId;

      const typingContentWithoutLoggedInUser = Array.isArray(typingContent)
        ? typingContent.filter((userId) => {
            return userId !== loggedInUserId;
          })
        : [];

      if (!roomId) return;

      setTypingUsersList((prevState) => ({
        ...prevState,
        [roomId]: typingContentWithoutLoggedInUser,
      }));
    }
    matrixClient.on(RoomMemberEvent.Typing, handleTyping);

    return () => {
      matrixClient.removeListener(RoomMemberEvent.Typing, handleTyping);
    };
  }, [loggedInUserId, matrixClient, showTypingNotifications]);

  async function handleUserTyping(roomId: string, isTyping: boolean) {
    if (!showTypingNotifications) return;

    await matrixClient.sendTyping(roomId, isTyping, 3000);
  }
  return { typingUsersList, handleUserTyping };
}
