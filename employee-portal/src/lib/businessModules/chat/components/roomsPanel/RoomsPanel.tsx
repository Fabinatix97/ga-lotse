/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack } from "@mui/joy";

import { RoomList } from "@/lib/businessModules/chat/components/roomList/RoomList";
import { RoomsPanelHeader } from "@/lib/businessModules/chat/components/roomsPanel/RoomsPanelHeader";
import { ChatPanelView } from "@/lib/businessModules/chat/shared/enums";
import { useChatRoomList } from "@/lib/businessModules/chat/shared/hooks/useChatRoomList";

interface RoomsPanelProps {
  setChatPanelView: (viewType: ChatPanelView) => void;
  isOpenChatSettings: boolean;
  toggleChatSettingsView(): void;
}
export function RoomsPanel({
  setChatPanelView,
  isOpenChatSettings,
  toggleChatSettingsView,
}: Readonly<RoomsPanelProps>) {
  const { roomList } = useChatRoomList();

  return (
    <>
      {/* TODO - rooms filtering */}
      <RoomsPanelHeader
        setChatPanelView={(viewType) => {
          setChatPanelView(viewType);
          if (isOpenChatSettings) {
            toggleChatSettingsView();
          }
        }}
      />
      <Stack
        sx={{
          flex: 1,
          overflowY: "auto",
        }}
      >
        <RoomList roomList={roomList} setChatPanelView={setChatPanelView} />
      </Stack>
    </>
  );
}
