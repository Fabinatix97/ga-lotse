/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
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
import { LeaveChatConfirmation } from "@/lib/businessModules/chat/components/LeaveChatConfirmation";
import { ChatHeader } from "@/lib/businessModules/chat/components/chatPanel/ChatHeader";
import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { useInfoPanelContext } from "@/lib/businessModules/chat/shared/InfoPanelProvider";
import { chatSearchParamNames } from "@/lib/businessModules/chat/shared/constants";
import {
  InfoPanelView,
  MobileView,
} from "@/lib/businessModules/chat/shared/enums";
import { useChatSearchParams } from "@/lib/businessModules/chat/shared/hooks/useChatSearchParams";
import { useRoomInfo } from "@/lib/businessModules/chat/shared/hooks/useRoomInfo";
import { useRoomMembers } from "@/lib/businessModules/chat/shared/hooks/useRoomMembers";
import { useRoomStateEventUpdate } from "@/lib/businessModules/chat/shared/hooks/useRoomStateEventUpdate";
import {
  clearSearchParams,
  isDMRoom,
  isGroupRoom,
  leaveRoom,
} from "@/lib/businessModules/chat/shared/utils";

interface ChatPanelHeaderProps {
  roomId: string;
  setMobileView: (viewType: MobileView) => void;
}

export function ChatPanelHeader({
  roomId,
  setMobileView,
}: Readonly<ChatPanelHeaderProps>) {
  const { matrixClient } = useChatClientContext();
  const { closeInfoPanel, setInfoPanelView } = useInfoPanelContext();
  const {
    getAvatarUrl,
    communicationType,
    getDMRoomMember,
    room,
    checkIfAdmin,
  } = useRoomInfo(roomId);
  const { joinedAndInvitedMembersWithoutMe } = useRoomMembers(roomId);
  useRoomStateEventUpdate(roomId);
  const [isOpen, setIsOpen] = useState(false);
  const { setRoomIdParam } = useChatSearchParams();

  function handleRoomInfoClick() {
    setInfoPanelView(InfoPanelView.RoomInfo, roomId);
    setMobileView(MobileView.Settings);
  }

  function handleLeaveRoomClick() {
    setIsOpen(false);
    clearSearchParams(chatSearchParamNames.userId, chatSearchParamNames.roomId);
    closeInfoPanel();
    void leaveRoom(matrixClient, roomId);
    setMobileView(MobileView.ChatMessages);
  }

  function handleSettingOnMobileClick() {
    setInfoPanelView(InfoPanelView.MobileView, roomId);
    setMobileView(MobileView.Settings);
  }

  const roomSettingsItem = isDMRoom(communicationType) ? (
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
          <IconButton
            sx={{
              display: { xxs: "flex", sm: "none" },
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
            onClick={() => {
              setRoomIdParam("");
              setMobileView(MobileView.RoomList);
            }}
          >
            <ArrowBackIosIcon color="primary" sx={{ width: "3.25rem" }} />
          </IconButton>
          <ChatHeader
            avatarUrl={getAvatarUrl()}
            communicationType={communicationType}
            roomId={roomId}
            roomMembers={joinedAndInvitedMembersWithoutMe}
            dmRoomMemberUserId={getDMRoomMember()?.userId}
            roomName={room?.name}
          />
          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: "center",
              display: { xxs: "none", sm: "block" },
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
                {checkIfAdmin() && isGroupRoom(communicationType) && (
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
                {isGroupRoom(communicationType) && (
                  <MenuItem onClick={() => setIsOpen(true)}>
                    <ListItemDecorator>
                      <LogoutOutlinedIcon />
                    </ListItemDecorator>
                    Gruppe verlassen
                  </MenuItem>
                )}
              </Menu>
            </Dropdown>
          </Stack>
          <IconButton
            variant="outlined"
            color="primary"
            sx={{ display: { xxs: "flex", sm: "none" } }}
            aria-label="open room settings"
            onClick={handleSettingOnMobileClick}
          >
            <InfoOutlinedIcon />
          </IconButton>
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
