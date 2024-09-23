/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import {
  Avatar,
  Box,
  Divider,
  Dropdown,
  IconButton,
  ListItem,
  ListItemButton,
  Menu,
  MenuButton,
  MenuItem,
  Typography,
} from "@mui/joy";

import { BadgeAvatar } from "@/lib/businessModules/chat/components/BadgeAvatar";
import { ChatListItemAvatar } from "@/lib/businessModules/chat/components/ChatListItemAvatar";
import { CommunicationType } from "@/lib/businessModules/chat/shared/enums";
import { Presence } from "@/lib/businessModules/chat/shared/types";

export interface ChatListItemProps {
  id: string;
  roomName: string;
  selectedRoomId: string | undefined;
  setSelectedRoomId: (roomId: string) => void;
  leaveRoom: (roomId: string) => Promise<void>;
  communicationType: CommunicationType;
  avatarUrl: string | undefined;
  presence?: Presence;
  handleInvite?: (roomId: string) => Promise<void>;
  handleSettings?: (roomId: string) => void;
  unreadNotifications: number;
  isChatAdmin?: boolean;
}

export function ChatListItem({
  id,
  roomName,
  selectedRoomId,
  setSelectedRoomId,
  leaveRoom,
  communicationType,
  avatarUrl,
  presence,
  handleInvite,
  handleSettings,
  unreadNotifications,
  isChatAdmin,
}: Readonly<ChatListItemProps>) {
  const selected = selectedRoomId === id;

  return (
    <ListItem sx={{ position: "relative" }}>
      <ListItemButton
        onClick={() => {
          setSelectedRoomId(id);
        }}
        selected={selected}
        color="neutral"
        sx={{ py: 1, width: "100%" }}
      >
        <BadgeAvatar status={presence}>
          <ChatListItemAvatar
            avatarUrl={avatarUrl}
            communicationType={communicationType}
            sx={{
              width: { sm: "1rem", md: "2rem" },
              height: { sm: "1rem", md: "2rem" },
            }}
          />
        </BadgeAvatar>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            level="body-md"
            sx={{
              ...(unreadNotifications > 0 && {
                textShadow: (theme) =>
                  `0px 0px 1px ${theme.palette.text.primary}`,
              }),
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: { sm: "6rem", md: "10rem", lg: "16rem" },
              overflow: "hidden",
            }}
          >
            {roomName}
          </Typography>
          {unreadNotifications > 0 && (
            <Avatar
              variant="solid"
              color="danger"
              sx={{
                marginRight: "calc(var(--IconButton-size, 2rem) + 0.5rem)",
                width: "1.25rem",
                height: "1.25rem",
                fontSize: "0.625rem",
                ml: 1,
                fontWeight: "500",
              }}
            >
              {unreadNotifications}
            </Avatar>
          )}
        </Box>
      </ListItemButton>
      <Dropdown>
        <MenuButton
          slots={{ root: IconButton }}
          slotProps={{
            root: { variant: "plain", color: "neutral", size: "sm" },
          }}
          sx={{ position: "absolute", right: "var(--ListItem-paddingX)" }}
          aria-label="Chatroom-Optionen"
        >
          <MoreHorizRoundedIcon />
        </MenuButton>
        <Menu size="sm" sx={{ minWidth: 140 }}>
          {communicationType === CommunicationType.PublicRoom &&
            isChatAdmin && (
              <>
                <MenuItem onClick={() => handleInvite?.(id)}>Einladen</MenuItem>
                <Divider />
              </>
            )}
          {communicationType === CommunicationType.PublicRoom &&
            isChatAdmin && (
              <>
                <MenuItem onClick={() => handleSettings?.(id)}>
                  Chatroom-Einstellungen
                </MenuItem>
                <Divider />
              </>
            )}
          <MenuItem color="danger" onClick={() => leaveRoom(id)}>
            Verlassen
          </MenuItem>
        </Menu>
      </Dropdown>
    </ListItem>
  );
}
