/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import NotificationsOffOutlinedIcon from "@mui/icons-material/NotificationsOffOutlined";
import { Box, Stack, Typography, useTheme } from "@mui/joy";
import { Room } from "matrix-js-sdk";
import { useMemo } from "react";

import { ChatAvatar } from "@/lib/businessModules/chat/components/ChatAvatar";
import { HighlightedText } from "@/lib/businessModules/chat/components/roomList/HighlightedText";
import { ReceiptStatus } from "@/lib/businessModules/chat/components/roomList/ReceiptStatus";
import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { CommunicationType } from "@/lib/businessModules/chat/shared/enums";
import { Message } from "@/lib/businessModules/chat/shared/types";
import {
  formatChatDate,
  getMemberAvatarUrl,
  getRoomAvatarUrl,
  isDMRoom,
} from "@/lib/businessModules/chat/shared/utils";

export interface RoomListItemProps {
  room: Room;
  communicationType?: CommunicationType;
  latestMessage?: Message;
  searchQuery?: string;
}

export function RoomListItem({
  room,
  communicationType = CommunicationType.DirectMessage,
  latestMessage,
  searchQuery,
}: Readonly<RoomListItemProps>) {
  const theme = useTheme();
  const { matrixClient, unreadNotificationsPerRoom } = useChatClientContext();

  const parsedDate = formatChatDate(latestMessage?.timestamp);
  const unreadNotifications = unreadNotificationsPerRoom[room.roomId];

  // TO DO - finish notification feature
  const disableNotifications = false;

  const dmMember = useMemo(
    () => (isDMRoom(communicationType) ? room.getAvatarFallbackMember() : null),
    [communicationType, room],
  );

  const avatarUrl = useMemo(
    () =>
      dmMember
        ? getMemberAvatarUrl(matrixClient, dmMember)
        : getRoomAvatarUrl(matrixClient, room),
    [dmMember, matrixClient, room],
  );

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{ alignItems: "center", width: "100%" }}
    >
      <ChatAvatar
        name={room.name}
        userId={dmMember?.userId}
        communicationType={communicationType}
        avatarUrl={avatarUrl}
      />
      <Stack sx={{ flex: 1, overflow: "hidden" }}>
        <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
          <Typography noWrap level="title-md" sx={{ minWidth: "4ch" }}>
            <HighlightedText searchQuery={searchQuery} text={room.name} />
          </Typography>
          {disableNotifications && (
            <NotificationsOffOutlinedIcon
              sx={{
                width: "1.125rem",
                height: "1.125rem",
                color: theme.palette.neutral.outlinedDisabledColor,
              }}
            />
          )}
        </Stack>
        <Typography noWrap>
          <HighlightedText
            searchQuery={searchQuery}
            text={latestMessage?.content}
          />
        </Typography>
      </Stack>
      <Stack
        sx={{
          alignItems: "flex-end",
        }}
      >
        <Typography
          level="body-md"
          textColor="text.secondary"
          noWrap
          sx={{
            maxWidth: "5ch",
          }}
        >
          {parsedDate}
        </Typography>
        <Box
          sx={{
            width: "1.5rem",
            height: "1.5rem",
            display: "grid",
            placeItems: "center end",
          }}
        >
          <ReceiptStatus unreadNotifications={unreadNotifications} />
        </Box>
      </Stack>
    </Stack>
  );
}
