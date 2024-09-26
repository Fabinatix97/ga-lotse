/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { List, ListItem, ListItemButton } from "@mui/joy";

import { RoomListItem } from "@/lib/businessModules/chat/components/roomList/RoomListItem";
import { ChatPanelView } from "@/lib/businessModules/chat/shared/enums";
import { useChatSearchParams } from "@/lib/businessModules/chat/shared/hooks/useChatSearchParams";
import { RoomWithCommunicationType } from "@/lib/businessModules/chat/shared/types";

interface RoomListProps {
  roomList: RoomWithCommunicationType[];
  setChatPanelView: (viewType: ChatPanelView) => void;
}

export function RoomList({
  roomList,
  setChatPanelView,
}: Readonly<RoomListProps>) {
  const { selectedRoomId, setRoomIdParam } = useChatSearchParams();

  return (
    <List sx={{ py: 0 }}>
      {roomList.map((data) => {
        return (
          <ListItem key={data.room.roomId}>
            <ListItemButton
              onClick={() => {
                setRoomIdParam(data.room.roomId);
                setChatPanelView(ChatPanelView.ChatMessages);
              }}
              selected={selectedRoomId === data.room.roomId}
              color="neutral"
              sx={{
                paddingX: 3,
                paddingY: 2,
              }}
            >
              <RoomListItem
                room={data.room}
                communicationType={data.communicationType}
              />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}
