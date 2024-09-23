/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { List } from "@mui/joy";

import { RoomListItem } from "@/lib/businessModules/chat/components/roomList/RoomListItem";
import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { useChatUtils } from "@/lib/businessModules/chat/shared/hooks/useChatUtils";
import { useSelectedRoomId } from "@/lib/businessModules/chat/shared/hooks/useSelectedRoomId";
import { RoomWithCommunicationType } from "@/lib/businessModules/chat/shared/types";
import { getDirectMessageMember } from "@/lib/businessModules/chat/shared/utils";

interface RoomListProps {
  roomList: RoomWithCommunicationType[];
}

export function RoomList({ roomList }: RoomListProps) {
  const { usersPresence } = useChatClientContext();
  const { getRoomAvatar } = useChatUtils();
  const { setSelectedRoomId, selectedRoomId } = useSelectedRoomId();

  return (
    <List sx={{ py: 0 }}>
      {roomList.map((data) => {
        const userId = getDirectMessageMember(data)?.userId;
        const userPresence = userId ? usersPresence[userId] : undefined;
        const avatarUrl = getRoomAvatar(data);

        return (
          <RoomListItem
            key={data.room.roomId}
            id={data.room.roomId}
            roomName={data.room.name}
            presence={userPresence}
            communicationType={data.communicationType}
            avatarUrl={avatarUrl}
            selectedRoomId={selectedRoomId}
            handleSelectRoom={() => {
              setSelectedRoomId(data.room.roomId);
            }}
          />
        );
      })}
    </List>
  );
}
