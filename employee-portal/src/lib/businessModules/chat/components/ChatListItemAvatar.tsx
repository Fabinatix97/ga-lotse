/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import Groups2Icon from "@mui/icons-material/Groups2";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { Avatar, AvatarProps } from "@mui/joy";

import { CommunicationType } from "@/lib/businessModules/chat/shared/enums";

interface ChatListItemAvatarProps extends AvatarProps {
  avatarUrl: string | undefined;
  communicationType: CommunicationType;
}

export function ChatListItemAvatar({
  avatarUrl,
  communicationType,
  ...props
}: Readonly<ChatListItemAvatarProps>) {
  if (avatarUrl) {
    return <Avatar src={avatarUrl} variant="outlined" {...props} />;
  }
  return (
    <Avatar {...props}>
      {communicationType === CommunicationType.PublicRoom ? (
        <Groups2Icon />
      ) : (
        <PersonOutlineIcon />
      )}
    </Avatar>
  );
}
