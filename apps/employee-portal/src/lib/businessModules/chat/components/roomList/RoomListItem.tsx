/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Box, Stack, Typography } from "@mui/joy";
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
  getDirectMessageRoomMember,
  getMemberAvatarUrl,
  getRoomAvatarUrl,
  isDMRoom,
} from "@/lib/businessModules/chat/shared/utils";

interface RoomListItemProps {
  room: Room;
  messageReads: string[];
  unreadNotifications?: number;
  communicationType?: CommunicationType;
  latestMessage?: Message;
  searchQuery?: string;
}

export function RoomListItem({
  room,
  communicationType = CommunicationType.DirectMessage,
  latestMessage,
  searchQuery,
  messageReads,
  unreadNotifications,
}: Readonly<RoomListItemProps>) {
  const { matrixClient } = useChatClientContext();
  const loggedInUserId = matrixClient.getUserId();
  const parsedDate = formatChatDate(latestMessage?.timestamp);

  const dmMember = useMemo(
    () =>
      isDMRoom(communicationType) ? getDirectMessageRoomMember(room) : null,
    [communicationType, room],
  );

  const avatarUrl = dmMember
    ? getMemberAvatarUrl(matrixClient, dmMember)
    : getRoomAvatarUrl(matrixClient, room);

  const isLatestMessageRead = messageReads.some(
    (id) => id === latestMessage?.id,
  );

  const isMessageMine = latestMessage?.sender?.userId === loggedInUserId;

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
        </Stack>
        {latestMessage?.decrypted ? (
          <Stack direction="row" gap={0.5} alignItems="center">
            <LockOutlinedIcon />
            <Typography noWrap>Entschlüsselung fehlgeschlagen</Typography>
          </Stack>
        ) : (
          <Typography noWrap>
            <HighlightedText
              searchQuery={searchQuery}
              text={latestMessage?.content}
            />
          </Typography>
        )}
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
            isRead={isLatestMessageRead || latestMessage?.isRead}
            isMessageMine={isMessageMine}
            isSent={latestMessage?.sent ?? false}
          />
        </Box>
      </Stack>
    </Stack>
  );
}
