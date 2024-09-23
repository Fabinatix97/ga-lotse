/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";

import { chatColumnHeaderHeight } from "@/lib/businessModules/chat/components/ChatColumnHeaderWrapper";
import { RoomList } from "@/lib/businessModules/chat/components/roomList/RoomList";
import { RoomsPanelHeader } from "@/lib/businessModules/chat/components/roomsPanel/RoomsPanelHeader";
import { useChatRoomList } from "@/lib/businessModules/chat/shared/hooks/useChatRoomList";

export function RoomsPanel() {
  const { roomList } = useChatRoomList();

  return (
    <>
      {/* TODO - rooms filtering */}
      <RoomsPanelHeader />
      <Stack
        sx={{
          height: `calc(100% - ${chatColumnHeaderHeight})`,
          overflowY: "auto",
        }}
      >
        <RoomList roomList={roomList} />
      </Stack>
    </>
  );
}
