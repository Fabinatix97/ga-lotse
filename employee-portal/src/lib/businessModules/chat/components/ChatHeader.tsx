/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import NotificationsOffOutlinedIcon from "@mui/icons-material/NotificationsOffOutlined";
import { Stack, Typography, useTheme } from "@mui/joy";

import { ChatAvatar } from "@/lib/businessModules/chat/components/ChatAvatar";
import { OnlineStatus } from "@/lib/businessModules/chat/components/OnlineStatus";
import { CommunicationType } from "@/lib/businessModules/chat/shared/enums";
import { RoomInfo } from "@/lib/businessModules/chat/shared/hooks/useRoomInfo";
import { getDepartmentNameFromUserId } from "@/lib/businessModules/chat/shared/utils";

export interface ChatHeaderProps extends RoomInfo {
  variant?: "default" | "settings";
}

export function ChatHeader({
  roomAvatarUrl,
  communicationType,
  dmRoomMember,
  room,
  roomMembers,
  variant = "default",
}: ChatHeaderProps) {
  const theme = useTheme();
  const isSettings = variant === "settings";

  // TO DO - finish mute feature
  const muteIndicator = false;

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
      <ChatAvatar
        name={room?.name}
        communicationType={communicationType}
        avatarUrl={roomAvatarUrl}
        size="lg"
        userId={dmRoomMember?.member.userId}
        disablePresence={!isSettings}
      />
      <Stack sx={{ flex: 1, overflow: "hidden" }}>
        <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
          <Typography
            noWrap
            level={variant === "settings" ? "title-md" : "h3"}
            sx={{ minWidth: "5ch" }}
          >
            {room?.name}
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
        {variant === "default" && (
          <Stack direction="row" spacing={2}>
            {roomMembers?.map((item) => (
              <OnlineStatus
                key={item.member.userId}
                userId={item.member.userId}
                name={roomMembers.length > 1 ? item.member.name : undefined}
              />
            ))}
          </Stack>
        )}
        {variant === "settings" &&
          communicationType === CommunicationType.DirectMessage && (
            <Typography noWrap sx={{ minWidth: "5ch" }}>
              {
                getDepartmentNameFromUserId(dmRoomMember?.member.userId)
                  ?.username
              }
            </Typography>
          )}
      </Stack>
    </Stack>
  );
}
