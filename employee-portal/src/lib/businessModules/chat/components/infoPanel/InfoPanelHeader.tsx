/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import CloseIcon from "@mui/icons-material/Close";
import { IconButton, Stack, Typography } from "@mui/joy";

import { ChatAvatar } from "@/lib/businessModules/chat/components/ChatAvatar";
import { ChatColumnHeaderWrapper } from "@/lib/businessModules/chat/components/ChatColumnHeaderWrapper";
import { RoomInfo } from "@/lib/businessModules/chat/shared/hooks/useRoomInfo";
import { getDepartmentNameFromUserId } from "@/lib/businessModules/chat/shared/utils";

interface InfoPanelHeaderProps extends Partial<RoomInfo> {
  userId?: string;
  displayName?: string;
  avatarUrl?: string;
  close: () => void;
  type?: "roomInfo" | "memberInfo";
}

export function InfoPanelHeader({
  room,
  userId,
  displayName,
  communicationType,
  dmRoomMember,
  avatarUrl,
  getAvatarUrl,
  close,
  type = "roomInfo",
}: InfoPanelHeaderProps) {
  const name = room?.name ?? displayName;
  const currentUserId =
    type === "memberInfo" ? userId : dmRoomMember?.member.userId;

  function getAvatar() {
    if (type === "memberInfo" && avatarUrl) return avatarUrl;
    if (type === "roomInfo" && getAvatarUrl) return getAvatarUrl();
    return null;
  }

  return (
    <ChatColumnHeaderWrapper>
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: "center",
        }}
      >
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
            name={name}
            communicationType={communicationType}
            avatarUrl={getAvatar()}
            size="lg"
            userId={currentUserId}
          />
          <Stack sx={{ flex: 1, overflow: "hidden" }}>
            <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
              <Typography noWrap level="title-md" sx={{ minWidth: "5ch" }}>
                {name}
              </Typography>
            </Stack>

            <Typography noWrap sx={{ minWidth: "5ch" }}>
              {getDepartmentNameFromUserId(currentUserId)?.username}
            </Typography>
          </Stack>
        </Stack>
        <IconButton
          variant="outlined"
          aria-label="close sidebar"
          onClick={close}
          sx={{
            borderColor: "primary.outlinedBorder",
          }}
        >
          <CloseIcon color="primary" />
        </IconButton>
      </Stack>
    </ChatColumnHeaderWrapper>
  );
}
