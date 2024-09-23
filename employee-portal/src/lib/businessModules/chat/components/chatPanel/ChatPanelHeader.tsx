/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import MoreVertIcon from "@mui/icons-material/MoreVert";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import { IconButton, Stack, styled } from "@mui/joy";

import { ChatColumnHeaderWrapper } from "@/lib/businessModules/chat/components/ChatColumnHeaderWrapper";
import { ChatHeader } from "@/lib/businessModules/chat/components/chatPanel/ChatHeader";
import { ChatPanelProps } from "@/lib/businessModules/chat/components/chatPanel/ChatPanel";
import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { logger } from "@/lib/businessModules/chat/shared/helpers";
import { useChatUtils } from "@/lib/businessModules/chat/shared/hooks/useChatUtils";
import { RoomUserPresence } from "@/lib/businessModules/chat/shared/types";
import { getRoomNameAndCommunicationType } from "@/lib/businessModules/chat/shared/utils";

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  borderColor: theme.palette.primary.outlinedBorder,
}));

export function ChatPanelHeader({
  roomId,
  toggleChatSettingsView,
}: ChatPanelProps) {
  const { matrixClient, usersPresence } = useChatClientContext();
  const { getRoomAvatar } = useChatUtils();

  const room = matrixClient.getRoom(roomId);

  if (!room) {
    return <ChatColumnHeaderWrapper />;
  }

  const roomWithType = getRoomNameAndCommunicationType(room);
  const avatarUrl = getRoomAvatar(roomWithType);

  const roomUsersPresence: RoomUserPresence[] = room
    .getMembers()
    .filter((member) => member.userId !== matrixClient.getUserId())
    .map((m) => ({
      userId: m.userId,
      name: m.name,
      presence: usersPresence[m.userId],
    }));

  function handleNotificationClick() {
    logger.debug("toggle notification");
  }

  function handleRoomPinClick() {
    logger.debug("toggle pin");
  }

  function handleRoomSettingsClick() {
    toggleChatSettingsView();
  }

  return (
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
          id={roomWithType.room.roomId}
          roomName={roomWithType.room.name}
          communicationType={roomWithType.communicationType}
          avatarUrl={avatarUrl}
          usersPresence={roomUsersPresence}
        />
        <Stack
          direction="row"
          spacing={1}
          sx={{
            alignItems: "center",
          }}
        >
          <StyledIconButton
            variant="outlined"
            aria-label="toggle notification"
            onClick={handleNotificationClick}
          >
            <NotificationsNoneOutlinedIcon color="primary" />
          </StyledIconButton>
          <StyledIconButton
            variant="outlined"
            aria-label="toggle room pin"
            onClick={handleRoomPinClick}
          >
            <PushPinOutlinedIcon color="primary" />
          </StyledIconButton>
          <StyledIconButton
            variant="outlined"
            aria-label="toggle notification"
            onClick={handleRoomSettingsClick}
          >
            <MoreVertIcon color="primary" />
          </StyledIconButton>
        </Stack>
      </Stack>
    </ChatColumnHeaderWrapper>
  );
}
