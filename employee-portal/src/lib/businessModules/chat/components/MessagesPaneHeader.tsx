/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  Avatar,
  Dropdown,
  Menu,
  MenuButton,
  Stack,
  Typography,
} from "@mui/joy";
import { RoomMember } from "matrix-js-sdk/lib/matrix";
import { useState } from "react";

import { BadgeAvatar } from "@/lib/businessModules/chat/components/BadgeAvatar";
import { ChatListItemAvatar } from "@/lib/businessModules/chat/components/ChatListItemAvatar";
import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import { CommunicationType } from "@/lib/businessModules/chat/shared/enums";

interface MessagesPaneHeaderProps {
  name: string;
  avatarUrl?: string;
  userId?: string;
  communicationType: CommunicationType;
  roomMembers?: RoomMember[];
  getImageUrl: (url?: string) => string | null;
}

export function MessagesPaneHeader({
  name,
  avatarUrl,
  userId,
  communicationType,
  roomMembers,
  getImageUrl,
}: Readonly<MessagesPaneHeaderProps>) {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const {
    userSettings: { sharePresence },
  } = useChat();
  const clientContext = useChatClientContext();
  const usersPresence = clientContext.usersPresence;
  const presenceStatus = userId ? usersPresence[userId] : undefined;

  return (
    <Dropdown>
      <MenuButton
        onClick={() => setSnackbarOpen((prevState) => !prevState)}
        sx={{
          margin: 0,
          padding: 0,
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{
            borderColor: "divider",
            backgroundColor: "background.body",
            minHeight: "4rem",
            width: "100%",
            margin: 0,
          }}
          p={1}
        >
          <BadgeAvatar status={sharePresence ? presenceStatus : undefined}>
            <ChatListItemAvatar
              avatarUrl={avatarUrl}
              communicationType={communicationType}
            />
          </BadgeAvatar>
          <Stack>
            <Typography fontWeight="lg" fontSize="md" noWrap>
              {name}
            </Typography>
          </Stack>
        </Stack>
      </MenuButton>

      <Menu open={snackbarOpen} placement="bottom-start">
        <Stack
          direction="column"
          spacing={2}
          sx={{
            backgroundColor: "background.body",
            minHeight: "4rem",
            padding: 2,
          }}
          p={1}
        >
          {communicationType === CommunicationType.PublicRoom && (
            <Stack
              direction="column"
              spacing={1}
              sx={{ justifyContent: "flex-start" }}
            >
              <Typography>Teilnehmer im Chat</Typography>
              {roomMembers?.map((member) => (
                <Stack
                  key={member.userId}
                  direction="row"
                  sx={{ alignItems: "center" }}
                  spacing={1}
                >
                  <BadgeAvatar
                    status={
                      sharePresence ? usersPresence[member.userId] : undefined
                    }
                  >
                    <Avatar
                      src={
                        getImageUrl(member.user?.avatarUrl ?? undefined) ??
                        undefined
                      }
                      variant="outlined"
                      size={"sm"}
                    />
                  </BadgeAvatar>
                  <Typography
                    fontWeight="sm"
                    fontSize="sm"
                    noWrap
                    key={member.userId}
                  >
                    {member.name}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          )}
          {communicationType === CommunicationType.DirectMessage && (
            <Stack direction="column" spacing={1}>
              <Typography>User ID: </Typography>
              <Typography fontWeight="sm" fontSize="sm" noWrap>
                {userId}
              </Typography>
            </Stack>
          )}
        </Stack>
      </Menu>
    </Dropdown>
  );
}
