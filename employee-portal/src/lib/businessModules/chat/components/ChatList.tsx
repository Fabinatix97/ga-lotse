/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Button, List, Stack } from "@mui/joy";

import { ChatListItem } from "@/lib/businessModules/chat/components/ChatListItem";
import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import { useChatUtils } from "@/lib/businessModules/chat/shared/hooks/useChatUtils";
import { useSelectedRoomId } from "@/lib/businessModules/chat/shared/hooks/useSelectedRoomId";
import { RoomWithCommunicationType } from "@/lib/businessModules/chat/shared/types";
import { getDirectMessageMember } from "@/lib/businessModules/chat/shared/utils";

interface ChatList {
  handleAddChat: () => void;
  buttonLabel: string;
  roomList: RoomWithCommunicationType[];
  handleInvite?: (roomId: string) => Promise<void>;
  handleSettings?: (roomId: string) => void;
}

export function ChatList({
  handleAddChat,
  buttonLabel,
  roomList,
  handleInvite,
  handleSettings,
}: Readonly<ChatList>) {
  const {
    userSettings: { sharePresence },
  } = useChat();
  const { matrixClient, unreadNotificationsPerRoom, usersPresence } =
    useChatClientContext();
  const { leaveRoom, getRoomAvatar } = useChatUtils();
  const { setSelectedRoomId, selectedRoomId } = useSelectedRoomId();

  const loggedInUserId = matrixClient.getUserId();

  return (
    <>
      <Button
        onClick={handleAddChat}
        endDecorator={<AddCircleOutlineIcon />}
        variant="plain"
        color="primary"
        fullWidth
        sx={{
          display: "flex",
          justifyContent: "space-between",
          borderRadius: 0,
          marginY: 1,
          "&:hover": { backgroundColor: "transparent" },
        }}
      >
        {buttonLabel}
      </Button>
      <Stack
        sx={{
          overflowY: "auto",
          padding: 0,
          borderRadius: 0,
          maxWidth: { sm: "18rem", md: "24rem", lg: "26rem" },
        }}
      >
        <List sx={{ py: 0 }}>
          {roomList.map((room) => {
            const userId = getDirectMessageMember(room)?.userId;
            const presenceStatus =
              sharePresence && userId ? usersPresence[userId] : undefined;
            const chatAdmin = room.room.getCreator();

            return (
              <ChatListItem
                key={room.room.roomId}
                id={room.room.roomId}
                roomName={room.room.name}
                communicationType={room.communicationType}
                leaveRoom={leaveRoom}
                setSelectedRoomId={setSelectedRoomId}
                selectedRoomId={selectedRoomId}
                avatarUrl={getRoomAvatar(room)}
                presence={presenceStatus}
                handleInvite={handleInvite}
                unreadNotifications={
                  unreadNotificationsPerRoom[room.room.roomId] ?? 0
                }
                isChatAdmin={chatAdmin === loggedInUserId}
                handleSettings={handleSettings}
              />
            );
          })}
        </List>
      </Stack>
    </>
  );
}
