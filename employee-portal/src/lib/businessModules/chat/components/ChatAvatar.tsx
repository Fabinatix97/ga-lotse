/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import { Avatar, Badge } from "@mui/joy";

import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import { CommunicationType } from "@/lib/businessModules/chat/shared/enums";
import { Presence } from "@/lib/businessModules/chat/shared/types";
import {
  getInitials,
  getStatusColor,
  stringToColor,
} from "@/lib/businessModules/chat/shared/utils";

interface ChatAvatarProps {
  name?: string;
  avatarUrl?: string;
  presence?: Presence;
  communicationType?: CommunicationType;
  size?: "sm" | "md" | "lg";
}

export function ChatAvatar({
  communicationType = CommunicationType.DirectMessage,
  size = "md",
  ...props
}: ChatAvatarProps) {
  return communicationType === CommunicationType.PublicRoom ? (
    <Avatar variant="solid" color="warning" size={size}>
      <GroupOutlinedIcon size="md" sx={{ color: "white" }} />
    </Avatar>
  ) : (
    <BadgeAvatar size={size} {...props} />
  );
}

function BadgeAvatar({
  presence,
  avatarUrl,
  name,
  size,
}: Omit<ChatAvatarProps, "communicationType">) {
  const {
    userSettings: { sharePresence },
  } = useChat();

  const content = getInitials(name);
  const invisiblePresence = !sharePresence || !presence;

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
        src={avatarUrl}
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
