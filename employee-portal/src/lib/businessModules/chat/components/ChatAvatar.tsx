/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import { Avatar, Badge } from "@mui/joy";

import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import { CommunicationType } from "@/lib/businessModules/chat/shared/enums";
import { Presence } from "@/lib/businessModules/chat/shared/types";
import {
  getInitials,
  getStatusColor,
  isGroupRoom,
  stringToColor,
} from "@/lib/businessModules/chat/shared/utils";

interface ChatAvatarProps {
  userId?: string;
  name?: string;
  avatarUrl: string | null;
  communicationType?: CommunicationType;
  size?: "sm" | "md" | "lg";
  disablePresence?: boolean;
}

type BadgeAvatarProps = {
  presence?: Presence;
} & Omit<ChatAvatarProps, "communicationType">;

export function ChatAvatar({
  communicationType = CommunicationType.DirectMessage,
  size = "md",
  userId,
  ...props
}: ChatAvatarProps) {
  const { usersPresence } = useChatClientContext();

  const {
    userSettings: { sharePresence },
  } = useChat();

  return isGroupRoom(communicationType) ? (
    <Avatar
      variant="solid"
      color="warning"
      size={size}
      src={props.avatarUrl ? props.avatarUrl : undefined}
    >
      <GroupOutlinedIcon size="md" sx={{ color: "white" }} />
    </Avatar>
  ) : (
    <BadgeAvatar
      size={size}
      presence={sharePresence ? usersPresence[userId ?? ""] : undefined}
      {...props}
    />
  );
}

function BadgeAvatar({
  avatarUrl,
  name,
  size,
  disablePresence = false,
  presence,
}: BadgeAvatarProps) {
  const content = getInitials(name);
  const invisiblePresence = disablePresence || !presence;

  return (
    <Badge
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      badgeInset="14%"
      invisible={invisiblePresence}
      variant="solid"
      size="sm"
      sx={{
        "& .MuiBadge-badge": {
          backgroundColor: getStatusColor(presence),
        },
      }}
    >
      <Avatar
        variant="solid"
        color={stringToColor(name)}
        src={avatarUrl ?? ""}
        size={size}
        sx={{
          fontWeight: 500,
          textTransform: "uppercase",
        }}
      >
        {content}
      </Avatar>
    </Badge>
  );
}
