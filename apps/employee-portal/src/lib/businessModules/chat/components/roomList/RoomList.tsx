/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { List, ListItem, ListItemButton } from "@mui/joy";
import { useMemo } from "react";

import { LiveAnnouncer } from "@eshg/lib-portal";

import { RoomListItem } from "@/lib/businessModules/chat/components/roomList/RoomListItem";
import { useInfoPanelContext } from "@/lib/businessModules/chat/shared/InfoPanelProvider";
import { useUnreadNotificationsPerRoom } from "@/lib/businessModules/chat/shared/UnreadNotificationsPerRoomProvider";
import {
  ChatPanelView,
  InfoPanelView,
  MobileView,
} from "@/lib/businessModules/chat/shared/enums";
import { useChatSearchParams } from "@/lib/businessModules/chat/shared/hooks/useChatSearchParams";
import { useReadConfirmation } from "@/lib/businessModules/chat/shared/hooks/useReadConfirmation";
import { RoomData } from "@/lib/businessModules/chat/shared/types";

interface RoomListProps {
  roomList: RoomData[];
  setChatPanelView: (viewType: ChatPanelView) => void;
  setMobileView: (viewType: MobileView) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function RoomList({
  roomList,
  setChatPanelView,
  setMobileView,
  searchQuery,
  setSearchQuery,
}: Readonly<RoomListProps>) {
  const { infoPanelState, setInfoPanelView } = useInfoPanelContext();
  const { selectedRoomId, setRoomIdParam } = useChatSearchParams();
  const { messageReadsPerRoom } = useReadConfirmation();
  const unreadNotificationsPerRoom = useUnreadNotificationsPerRoom();
  const sortedChats = useMemo(() => {
    return roomList.toSorted((roomA, roomB) => {
      const timestampA = roomA.latestMessage?.timestamp?.getTime() ?? 0;
      const timestampB = roomB.latestMessage?.timestamp?.getTime() ?? 0;
      return timestampB - timestampA;
    });
  }, [roomList]);

  return (
    <>
      <LiveAnnouncer
        active={sortedChats.length === 0}
        message="Keine Chats vorhanden"
      />
      <LiveAnnouncer
        active={sortedChats.length > 0}
        message={`${sortedChats.length} Chats vorhanden`}
      />
      <List sx={{ py: 0 }} data-testid="chat-room-list">
        {sortedChats?.map((data) => {
          return (
            <ListItem key={data.room.roomId}>
              <ListItemButton
                selected={selectedRoomId === data.room.roomId}
                aria-pressed={selectedRoomId === data.room.roomId}
                color="neutral"
                sx={{
                  paddingX: 3,
                  paddingY: 2,
                }}
                aria-label={`Chat mit ${data.room.name} öffnen`}
                onClick={() => {
                  setRoomIdParam(data.room.roomId);
                  setChatPanelView(ChatPanelView.ChatMessages);
                  setMobileView(MobileView.ChatMessages);
                  setSearchQuery("");
                  if (infoPanelState.isOpen) {
                    setInfoPanelView(InfoPanelView.RoomInfo, data.room.roomId);
                  }
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
    </>
  );
}
