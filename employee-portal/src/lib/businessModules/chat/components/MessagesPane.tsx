/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { List, Stack, Typography } from "@mui/joy";
import { useEffect, useRef } from "react";

import { MessageInput } from "@/lib/businessModules/chat/components/MessageInput";
import { MessagesList } from "@/lib/businessModules/chat/components/MessagesList";
import { MessagesPaneHeader } from "@/lib/businessModules/chat/components/MessagesPaneHeader";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import { useChatRoomList } from "@/lib/businessModules/chat/shared/hooks/useChatRoomList";
import { useChatUtils } from "@/lib/businessModules/chat/shared/hooks/useChatUtils";
import { useRoomMessages } from "@/lib/businessModules/chat/shared/hooks/useRoomMessages";
import { useSelectedRoomId } from "@/lib/businessModules/chat/shared/hooks/useSelectedRoomId";
import { useTyping } from "@/lib/businessModules/chat/shared/hooks/useTyping";
import { getDirectMessageMember } from "@/lib/businessModules/chat/shared/utils";

export function MessagesPane() {
  const {
    userSettings: { showTypingNotification },
  } = useChat();
  const { typingUsersList, handleUserTyping } = useTyping(
    showTypingNotification,
  );
  const { roomList } = useChatRoomList();
  const { getRoomAvatar, getImageUrl, getUser } = useChatUtils();
  const { selectedRoomId } = useSelectedRoomId();
  const {
    messages,
    handleSendMessage,
    paginateMessages,
    isLoading,
    canPaginate,
  } = useRoomMessages();
  const selectedRoom = roomList.find(
    (roomItem) => roomItem.room.roomId === selectedRoomId,
  );
  const typingUsers = typingUsersList[selectedRoomId];
  const messagesWrapperRef = useRef<HTMLUListElement>(null);
  const offset = 5;

  useEffect(() => {
    const container = messagesWrapperRef.current;
    if (container === null) {
      return;
    }
    async function handleScroll() {
      if (!container) {
        return;
      }
      if (
        Math.abs(container.scrollTop) + container.offsetHeight >=
          container.scrollHeight - offset &&
        !isLoading
      ) {
        const previousScrollHeight = container.scrollHeight;
        const previousScrollTop = container.scrollTop;

        await paginateMessages();

        const newScrollHeight = container.scrollHeight;
        container.scrollTop =
          previousScrollTop + (newScrollHeight - previousScrollHeight - offset);
      }
    }
    function onScroll() {
      void handleScroll();
    }
    container.addEventListener("scroll", onScroll);

    // Cleanup event listener on component unmount
    return () => {
      container.removeEventListener("scroll", onScroll);
    };
  }, [canPaginate, isLoading, paginateMessages]);

  if (!selectedRoomId || !selectedRoom) {
    return null;
  }

  return (
    <Stack
      sx={{
        height: "100%",
        backgroundColor: "background.level1",
      }}
    >
      <MessagesPaneHeader
        name={selectedRoom.room.name}
        avatarUrl={getRoomAvatar(selectedRoom)}
        userId={getDirectMessageMember(selectedRoom)?.userId}
        communicationType={selectedRoom.communicationType}
        roomMembers={selectedRoom.room.getJoinedMembers()}
        key={`${selectedRoom.room.roomId}-header`}
        getImageUrl={getImageUrl}
      />
      <List
        sx={{
          display: "flex",
          flex: 1,
          px: 2,
          py: 3,
          overflowY: "scroll",
          flexDirection: "column-reverse",
        }}
        ref={messagesWrapperRef}
      >
        <MessagesList selectedRoomId={selectedRoomId} messages={messages} />
      </List>
      <Typography
        level="body-sm"
        sx={{
          mx: 2,
          mb: 1,
          visibility: typingUsersList[selectedRoom.room.roomId]?.length
            ? "visible"
            : "hidden",
        }}
      >
        {typingUsers?.map(
          (userId, index) =>
            `${getUser(userId)?.displayName}${typingUsers.length - 1 !== index ? ", " : ""} `,
        )}
        {(typingUsers?.length ?? 0) > 1 ? "schreiben..." : "schreibt..."}
      </Typography>
      <MessageInput
        key={`${selectedRoom.room.roomId}-input`}
        onSubmit={handleSendMessage}
        handleUserTyping={handleUserTyping}
        selectedRoomId={selectedRoom.room.roomId}
        roomMembers={selectedRoom.room.getMembers()}
      />
    </Stack>
  );
}
