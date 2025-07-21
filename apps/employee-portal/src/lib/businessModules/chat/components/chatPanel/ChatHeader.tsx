/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box, Stack, Typography } from "@mui/joy";

import { ChatAvatar } from "@/lib/businessModules/chat/components/ChatAvatar";
import { UserList } from "@/lib/businessModules/chat/components/chatPanel/UserList";
import { CommunicationType } from "@/lib/businessModules/chat/shared/enums";
import { ChatRoomMember } from "@/lib/businessModules/chat/shared/types";
import { isGroupRoom } from "@/lib/businessModules/chat/shared/utils";

interface ChatHeaderProps {
  avatarUrl: string | null;
  communicationType?: CommunicationType;
  roomId: string;
  roomName?: string;
  dmRoomMemberUserId?: string;
  roomMembers: ChatRoomMember[];
}

export function ChatHeader({
  avatarUrl,
  communicationType,
  roomId,
  roomMembers,
  dmRoomMemberUserId,
  roomName,
}: Readonly<ChatHeaderProps>) {
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        alignItems: "center",
        width: "100%",
        minWidth: 0,
      }}
    >
      <Box sx={{ display: { xxs: "none", sm: "block" } }}>
        <ChatAvatar
          name={roomName}
          communicationType={communicationType}
          avatarUrl={avatarUrl}
          size="lg"
          userId={dmRoomMemberUserId}
          disablePresence
        />
      </Box>
      <Stack sx={{ flex: 1, overflow: "hidden" }}>
        <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
          <Typography
            noWrap
            level="h3"
            sx={{ minWidth: "5ch", textOverflow: "ellipsis" }}
          >
            {roomName}
          </Typography>
        </Stack>
        <UserList
          key={roomId}
          users={roomMembers}
          isGroupRoom={isGroupRoom(communicationType)}
        />
      </Stack>
    </Stack>
  );
}
