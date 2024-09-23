/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import NotificationsOffOutlinedIcon from "@mui/icons-material/NotificationsOffOutlined";
import {
  Box,
  ListItem,
  ListItemButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/joy";
import { useCallback, useEffect, useState } from "react";

import { ChatAvatar } from "@/lib/businessModules/chat/components/ChatAvatar";
import { ReceiptStatus } from "@/lib/businessModules/chat/components/roomList/ReceiptStatus";
import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { CommunicationType } from "@/lib/businessModules/chat/shared/enums";
import {
  Presence,
  RoomLastMessage,
} from "@/lib/businessModules/chat/shared/types";
import {
  convertMessageTimestamp,
  getRoomLastMessage,
} from "@/lib/businessModules/chat/shared/utils";

export interface RoomListItemProps {
  id: string;
  roomName: string;
  selectedRoomId: string | undefined;
  handleSelectRoom: () => void;
  communicationType?: CommunicationType;
  avatarUrl?: string;
  presence?: Presence;
}

export function RoomListItem(props: RoomListItemProps) {
  const theme = useTheme();
  const selected = props.selectedRoomId === props.id;

  return (
    <ListItem>
      <ListItemButton
        onClick={props.handleSelectRoom}
        selected={selected}
        color="neutral"
        sx={{
          paddingX: theme.spacing(3),
          paddingY: theme.spacing(2),
        }}
      >
        <RoomItem {...props} />
      </ListItemButton>
    </ListItem>
  );
}

export function RoomItem({
  id,
  roomName,
  communicationType = CommunicationType.DirectMessage,
  avatarUrl,
  presence,
}: RoomListItemProps) {
  const theme = useTheme();
  const { matrixClient, unreadNotificationsPerRoom } = useChatClientContext();
  const [lastMessage, setLastMessage] = useState<RoomLastMessage>();

  const parsedDate = convertMessageTimestamp(lastMessage?.timestamp);
  const unreadNotifications = unreadNotificationsPerRoom[id];

  // TO DO - finish notification feature
  const disableNotifications = false;

  const updateRoomLastMessage = useCallback(async () => {
    const lastMessage = await getRoomLastMessage(matrixClient, id);
    setLastMessage(lastMessage);
  }, [id, matrixClient]);

  useEffect(() => {
    void updateRoomLastMessage();
  }, [updateRoomLastMessage, unreadNotifications]);

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{ alignItems: "center", width: "100%" }}
    >
      <ChatAvatar
        name={roomName}
        communicationType={communicationType}
        presence={presence}
        avatarUrl={avatarUrl}
      />
      <Stack sx={{ flex: 1, overflow: "hidden" }}>
        <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
          <Typography noWrap level="title-md">
            {roomName}
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
        <Typography noWrap>{lastMessage?.content}</Typography>
      </Stack>
      <Stack
        sx={{
          alignItems: "flex-end",
          maxWidth: "4rem",
        }}
      >
        <Typography
          level="body-md"
          textColor="text.secondary"
          noWrap
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "4rem",
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
