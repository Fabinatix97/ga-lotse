/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { IconButton, Stack, Typography } from "@mui/joy";
import { visuallyHidden } from "@mui/utils";
import { RoomMember } from "matrix-js-sdk";
import { useState } from "react";

import { BaseModal, ButtonLink, DetailsList } from "@eshg/lib-portal";

import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { getMemberAvatarUrl } from "@/lib/businessModules/chat/shared/utils";

import { ChatAvatar } from "./ChatAvatar";

interface GroupChatMemberProps {
  member: RoomMember;
  isRoomCreator: boolean;
  isAdmin: boolean;
  handleKick: () => void;
}

export function GroupChatMember({
  member,
  isAdmin,
  handleKick,
}: Readonly<GroupChatMemberProps>) {
  const { matrixClient, departmentInfo } = useChatClientContext();
  const avatarUrl = getMemberAvatarUrl(matrixClient, member);
  const [open, setOpen] = useState(false);

  return (
    <Stack
      direction="row"
      sx={{
        alignItems: "center",
        width: "100%",
      }}
      data-testid={member.name}
      role="listitem"
    >
      <DetailsList>
        <ChatAvatar
          name={member.name}
          userId={member.userId}
          avatarUrl={avatarUrl}
          size="lg"
        />
        <Stack sx={{ flex: 1, overflow: "hidden", marginLeft: 2 }}>
          <Typography sx={visuallyHidden} role="term">
            Name
          </Typography>
          <Typography noWrap level="title-sm" role="definition">
            {member.name}
          </Typography>
          {isAdmin && (
            <>
              <Typography sx={visuallyHidden} role="term">
                Rolle
              </Typography>
              <Typography noWrap level="body-sm" role="definition">
                Admin
              </Typography>
            </>
          )}
          <Typography sx={visuallyHidden} role="term">
            Abteilung
          </Typography>
          <Typography
            noWrap
            level="body-sm"
            textColor="text.secondary"
            role="definition"
          >
            {departmentInfo?.name}
          </Typography>
          <ButtonLink
            level="body-sm"
            sx={{ textTransform: "capitalize" }}
            onClick={() => {
              setOpen(true);
            }}
          >
            Chat-ID anzeigen
          </ButtonLink>
        </Stack>
        {!isAdmin && (
          <IconButton
            color="primary"
            data-testid="remove-from-room"
            aria-label="Aus dem Chat entfernen"
            onClick={handleKick}
          >
            <CloseOutlinedIcon />
          </IconButton>
        )}
        {open && (
          <BaseModal
            modalTitle="User-Informationen"
            open={open}
            onClose={() => setOpen(false)}
          >
            <Typography>{`${member.name} | ${departmentInfo?.name}`}</Typography>
            <Typography>{`Chat-ID: ${member.userId}`}</Typography>
          </BaseModal>
        )}
      </DetailsList>
    </Stack>
  );
}
