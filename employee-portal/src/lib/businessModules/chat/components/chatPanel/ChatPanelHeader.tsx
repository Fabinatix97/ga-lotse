/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import {
  Dropdown,
  IconButton,
  ListItemDecorator,
  Menu,
  MenuButton,
  MenuItem,
  Stack,
} from "@mui/joy";
import { useState } from "react";

import { ChatColumnHeaderWrapper } from "@/lib/businessModules/chat/components/ChatColumnHeaderWrapper";
import { ChatHeader } from "@/lib/businessModules/chat/components/ChatHeader";
import { LeaveChatConfirmation } from "@/lib/businessModules/chat/components/LeaveChatConfirmation";
import { useInfoPanelContext } from "@/lib/businessModules/chat/shared/InfoPanelProvider";
import { InfoPanelView } from "@/lib/businessModules/chat/shared/enums";
import { useChatSearchParams } from "@/lib/businessModules/chat/shared/hooks/useChatSearchParams";
import { useRoomInfo } from "@/lib/businessModules/chat/shared/hooks/useRoomInfo";
import { RoomWithCommunicationType } from "@/lib/businessModules/chat/shared/types";
import {
  isDMRoom,
  isGroupRoom,
  leaveRoom,
} from "@/lib/businessModules/chat/shared/utils";

export interface ChatPanelHeaderProps {
  roomId: string;
  room: RoomWithCommunicationType;
}

export function ChatPanelHeader({
  roomId,
  room,
}: Readonly<ChatPanelHeaderProps>) {
  const { closeInfoPanel, setInfoPanelView } = useInfoPanelContext();
  const roomInfo = useRoomInfo(roomId);
  const { clearChatParams } = useChatSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  function handleRoomInfoClick() {
    setInfoPanelView(InfoPanelView.RoomInfo, roomId);
  }

  function handleLeaveRoomClick() {
    setIsOpen(false);
    clearChatParams();
    closeInfoPanel();
    void leaveRoom(roomInfo.matrixClient, roomId);
  }

  const roomSettingsItem = isDMRoom(room.communicationType) ? (
    <>
      <ListItemDecorator>
        <PersonOutlinedIcon />
      </ListItemDecorator>
      Kontakt anzeigen
    </>
  ) : (
    <>
      <ListItemDecorator>
        <GroupOutlinedIcon />
      </ListItemDecorator>
      Mitglieder anzeigen
    </>
  );

  return (
    <>
      <ChatColumnHeaderWrapper>
        <Stack
          direction="row"
          spacing={2}
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            height: "100%",
          }}
        >
          <ChatHeader
            communicationType={room.communicationType}
            room={room.room}
          />
          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: "center",
            }}
          >
            <Dropdown>
              <MenuButton
                slots={{ root: IconButton }}
                slotProps={{ root: { variant: "outlined", color: "primary" } }}
                aria-label="open room options"
              >
                <MoreVertIcon color="primary" />
              </MenuButton>
              <Menu placement="bottom-end">
                <MenuItem onClick={handleRoomInfoClick}>
                  {roomSettingsItem}
                </MenuItem>
                {/*Display settings button only for admin and only if it's group chat*/}
                {roomInfo.isAdmin && isGroupRoom(room.communicationType) && (
                  <MenuItem
                    onClick={() =>
                      setInfoPanelView(InfoPanelView.AdminSettings, roomId)
                    }
                  >
                    <ListItemDecorator>
                      <SettingsOutlinedIcon />
                    </ListItemDecorator>
                    Einstellungen
                  </MenuItem>
                )}
                <MenuItem onClick={() => setIsOpen(true)}>
                  <ListItemDecorator>
                    <LogoutOutlinedIcon />
                  </ListItemDecorator>
                  {isDMRoom(room.communicationType)
                    ? "Verlassen"
                    : "Gruppe verlassen"}
                </MenuItem>
              </Menu>
            </Dropdown>
          </Stack>
        </Stack>
      </ChatColumnHeaderWrapper>
      <LeaveChatConfirmation
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleLeaveRoomClick}
      />
    </>
  );
}
