/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import NotificationsOffOutlinedIcon from "@mui/icons-material/NotificationsOffOutlined";
import { Stack, Typography, useTheme } from "@mui/joy";

import { ChatAvatar } from "@/lib/businessModules/chat/components/ChatAvatar";
import { OnlineStatus } from "@/lib/businessModules/chat/components/OnlineStatus";
import { CommunicationType } from "@/lib/businessModules/chat/shared/enums";
import { RoomUserPresence } from "@/lib/businessModules/chat/shared/types";

export interface ChatHeaderProps {
  id: string;
  roomName: string;
  communicationType?: CommunicationType;
  avatarUrl?: string;
  usersPresence?: RoomUserPresence[];
}

export function ChatHeader({
  roomName,
  communicationType = CommunicationType.DirectMessage,
  avatarUrl,
  usersPresence,
}: ChatHeaderProps) {
  const theme = useTheme();

  // TO DO - finish mute feature
  const muteIndicator = false;

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{ alignItems: "center", width: "100%" }}
    >
      <ChatAvatar
        name={roomName}
        communicationType={communicationType}
        avatarUrl={avatarUrl}
        size="lg"
      />
      <Stack sx={{ flex: 1, overflow: "hidden" }}>
        <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
          <Typography noWrap level="h3">
            {roomName}
          </Typography>
          {muteIndicator && (
            <NotificationsOffOutlinedIcon
              sx={{
                width: "1.125rem",
                height: "1.125rem",
                color: theme.palette.neutral.outlinedDisabledColor,
              }}
            />
          )}
        </Stack>
        <Stack direction="row" spacing={2}>
          {usersPresence?.map((item) => (
            <OnlineStatus
              key={item.userId}
              presence={item.presence}
              name={usersPresence.length > 1 ? item.name : undefined}
            />
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
}
