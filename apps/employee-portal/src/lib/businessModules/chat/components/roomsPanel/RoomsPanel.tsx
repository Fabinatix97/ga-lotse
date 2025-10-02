/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box, Stack } from "@mui/joy";
import { useMemo, useState } from "react";

import { RoomList } from "@/lib/businessModules/chat/components/roomList/RoomList";
import { RoomsPanelHeader } from "@/lib/businessModules/chat/components/roomsPanel/RoomsPanelHeader";
import { useInfoPanelContext } from "@/lib/businessModules/chat/shared/InfoPanelProvider";
import {
  ChatPanelView,
  MobileView,
} from "@/lib/businessModules/chat/shared/enums";
import { useChatRoomList } from "@/lib/businessModules/chat/shared/hooks/useChatRoomList";

interface RoomsPanelProps {
  chatPanelView: ChatPanelView;
  mobileView: MobileView;
  setChatPanelView: (viewType: ChatPanelView) => void;
  setMobileView: (viewType: MobileView) => void;
}
export function RoomsPanel({
  chatPanelView,
  mobileView,
  setChatPanelView,
  setMobileView,
}: Readonly<RoomsPanelProps>) {
  const { roomList } = useChatRoomList();
  const { closeInfoPanel, infoPanelState } = useInfoPanelContext();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRooms = useMemo(() => {
    return roomList.filter((room) =>
      room.room.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [roomList, searchQuery]);

  return (
    <Box display="contents" role="navigation" aria-label="Konversationen">
      <RoomsPanelHeader
        chatPanelView={chatPanelView}
        mobileView={mobileView}
        setChatPanelView={(viewType) => {
          setChatPanelView(viewType);
          if (infoPanelState.isOpen) {
            closeInfoPanel();
          }
        }}
        setMobileView={setMobileView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <Stack
        sx={{
          flex: 1,
          overflowY: "auto",
        }}
      >
        <RoomList
          roomList={searchQuery?.length ? filteredRooms : roomList}
          setChatPanelView={setChatPanelView}
          setMobileView={setMobileView}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </Stack>
    </Box>
  );
}
