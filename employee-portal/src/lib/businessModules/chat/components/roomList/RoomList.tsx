/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { List, ListItem, ListItemButton } from "@mui/joy";
import { useMemo } from "react";

import { RoomListItem } from "@/lib/businessModules/chat/components/roomList/RoomListItem";
import { useInfoPanelContext } from "@/lib/businessModules/chat/shared/InfoPanelProvider";
import { useNotificationContext } from "@/lib/businessModules/chat/shared/NotificationProvider";
import {
  ChatPanelView,
  InfoPanelView,
} from "@/lib/businessModules/chat/shared/enums";
import { useChatSearchParams } from "@/lib/businessModules/chat/shared/hooks/useChatSearchParams";
import { useReadConfirmation } from "@/lib/businessModules/chat/shared/hooks/useReadConfirmation";
import { RoomData } from "@/lib/businessModules/chat/shared/types";

interface RoomListProps {
  roomList: RoomData[];
  setChatPanelView: (viewType: ChatPanelView) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function RoomList({
  roomList,
  setChatPanelView,
  searchQuery,
  setSearchQuery,
}: Readonly<RoomListProps>) {
  const { infoPanelState, setInfoPanelView } = useInfoPanelContext();
  const { selectedRoomId, setRoomIdParam } = useChatSearchParams();
  const { messageReadsPerRoom } = useReadConfirmation();
  const { unreadNotificationsPerRoom } = useNotificationContext();
  const sortedChats = useMemo(() => {
    //todo: here?
    return roomList.toSorted((roomA, roomB) => {
      const timestampA = roomA.latestMessage?.timestamp?.getTime() ?? 0;
      const timestampB = roomB.latestMessage?.timestamp?.getTime() ?? 0;
      return timestampB - timestampA;
    });
  }, [roomList]);

  return (
    <List sx={{ py: 0 }}>
      {sortedChats?.map((data) => {
        return (
          <ListItem key={data.room.roomId}>
            <ListItemButton
              onClick={() => {
                setRoomIdParam(data.room.roomId);
                setChatPanelView(ChatPanelView.ChatMessages);
                setSearchQuery("");
                if (infoPanelState.isOpen) {
                  setInfoPanelView(InfoPanelView.RoomInfo, data.room.roomId);
                }
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
                messageReads={messageReadsPerRoom[data.room.roomId] ?? []}
                unreadNotifications={
                  unreadNotificationsPerRoom[data.room.roomId]
                }
                communicationType={data.communicationType}
                latestMessage={data.latestMessage}
                searchQuery={searchQuery}
              />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}
