/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
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
import { useChatSearchParams } from "@/lib/businessModules/chat/shared/hooks/useChatSearchParams";
import { useRoomInfo } from "@/lib/businessModules/chat/shared/hooks/useRoomInfo";
import { isDMRoom, leaveRoom } from "@/lib/businessModules/chat/shared/utils";

export interface ChatPanelHeaderProps {
  roomId: string;
  toggleChatSettingsView: () => void;
}

export function ChatPanelHeader({
  roomId,
  toggleChatSettingsView,
}: Readonly<ChatPanelHeaderProps>) {
  const roomInfo = useRoomInfo(roomId);
  const { clearChatParams } = useChatSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  if (!roomInfo) {
    return <ChatColumnHeaderWrapper />;
  }

  function handleRoomSettingsClick() {
    toggleChatSettingsView();
  }

  function handleLeaveRoomClick() {
    setIsOpen(false);
    clearChatParams();
    void leaveRoom(roomInfo.matrixClient, roomId);
  }

  const roomSettingsItem = isDMRoom(roomInfo.communicationType) ? (
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
          <ChatHeader {...roomInfo} />
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
                <MenuItem onClick={handleRoomSettingsClick}>
                  {roomSettingsItem}
                </MenuItem>
                <MenuItem onClick={() => setIsOpen(true)}>
                  <ListItemDecorator>
                    <LogoutOutlinedIcon />
                  </ListItemDecorator>
                  {isDMRoom(roomInfo.communicationType)
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
