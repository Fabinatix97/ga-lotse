/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import NotificationsOffOutlinedIcon from "@mui/icons-material/NotificationsOffOutlined";
import { Box, Stack, Typography, useTheme } from "@mui/joy";
import { Room } from "matrix-js-sdk";
import { useMemo } from "react";
import { isEmpty } from "remeda";

import { ChatAvatar } from "@/lib/businessModules/chat/components/ChatAvatar";
import { HighlightedText } from "@/lib/businessModules/chat/components/roomList/HighlightedText";
import { ReceiptStatus } from "@/lib/businessModules/chat/components/roomList/ReceiptStatus";
import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { CommunicationType } from "@/lib/businessModules/chat/shared/enums";
import { useReadConfirmation } from "@/lib/businessModules/chat/shared/hooks/useReadConfirmation";
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
  const { messageReadsPerRoom } = useReadConfirmation(true);

  // TO DO - finish notification feature
  const disableNotifications = false;

  const dmMember = useMemo(
    () => (isDMRoom(communicationType) ? room.getAvatarFallbackMember() : null),
    [communicationType, room],
  );

  const avatarUrl = dmMember
    ? getMemberAvatarUrl(matrixClient, dmMember)
    : getRoomAvatarUrl(matrixClient, room);

  const isLatestMessageRead = messageReadsPerRoom[room.roomId]?.some(
    (id) => id === latestMessage?.id,
  );

  const latestMessageRead =
    latestMessage?.readReceipts && !isEmpty(latestMessage?.readReceipts);

  const isMessageMine =
    latestMessage?.sender?.userId === matrixClient.getUserId();

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
          <ReceiptStatus
            unreadNotifications={unreadNotifications}
            isRead={isLatestMessageRead ?? latestMessageRead}
            isMessageMine={isMessageMine}
            isSent={latestMessage?.sent ?? false}
          />
        </Box>
      </Stack>
    </Stack>
  );
}
