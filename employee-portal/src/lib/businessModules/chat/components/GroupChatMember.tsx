/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { IconButton, Stack, Typography } from "@mui/joy";
import { RoomMember } from "matrix-js-sdk";

import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import {
  getDepartmentNameFromUserId,
  getMemberAvatarUrl,
} from "@/lib/businessModules/chat/shared/utils";

import { ChatAvatar } from "./ChatAvatar";

interface GroupChatMemberProps {
  member: RoomMember;
  isRoomCreator: boolean;
  isAdmin: boolean;
  handleKick: () => void;
}

export function GroupChatMember({
  member,
  isRoomCreator,
  isAdmin,
  handleKick,
}: Readonly<GroupChatMemberProps>) {
  const usernameAndOrganisation = getDepartmentNameFromUserId(member.userId);
  const { matrixClient } = useChatClientContext();
  const avatarUrl = getMemberAvatarUrl(matrixClient, member);
  const canRemove = isAdmin && matrixClient.getUserId() !== member.userId;

  return (
    <Stack
      direction="row"
      sx={{
        alignItems: "center",
        width: "100%",
      }}
    >
      <ChatAvatar
        name={member.name}
        userId={member.userId}
        avatarUrl={avatarUrl}
        size="lg"
      />
      <Stack sx={{ flex: 1, overflow: "hidden", marginLeft: 2 }}>
        <Typography noWrap level="title-sm">
          {member.name}
        </Typography>
        {isRoomCreator && (
          <Typography noWrap level="body-sm">
            Admin
          </Typography>
        )}
        <Typography
          noWrap
          level="body-sm"
          textColor="text.secondary"
          sx={{ textTransform: "capitalize" }}
        >
          {usernameAndOrganisation?.organisationName}
        </Typography>
      </Stack>
      {canRemove && (
        <IconButton color="primary" onClick={handleKick}>
          <CloseOutlinedIcon />
        </IconButton>
      )}
    </Stack>
  );
}
