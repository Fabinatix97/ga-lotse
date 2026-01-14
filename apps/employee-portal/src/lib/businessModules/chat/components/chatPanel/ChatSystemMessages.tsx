/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import PersonRemoveAlt1OutlinedIcon from "@mui/icons-material/PersonRemoveAlt1Outlined";
import { Box, Stack, Typography } from "@mui/joy";
import { SvgIconProps } from "@mui/joy/SvgIcon";

import { Membership } from "@/lib/businessModules/chat/shared/enums";
import { ChatSystemMessage as ChatSystemMessageType } from "@/lib/businessModules/chat/shared/types";

interface ChatSystemMessageProps {
  message: ChatSystemMessageType;
}
export function ChatSystemMessage({
  message,
}: Readonly<ChatSystemMessageProps>) {
  function displayIcon(systemMessage: ChatSystemMessageType) {
    if (!systemMessage) return;
    const iconProps = {
      fontSize: "xl2",
      sx: { color: "neutral.400" },
    } as SvgIconProps;

    switch (systemMessage.type) {
      case "m.room.member": {
        if (systemMessage.avatarUrl) {
          return <CameraAltOutlinedIcon />;
        }
        switch (systemMessage.membership) {
          case Membership.Join: {
            return <PersonOutlinedIcon {...iconProps} />;
          }
          case Membership.Leave: {
            return <PersonRemoveAlt1OutlinedIcon {...iconProps} />;
          }
          case Membership.Invite: {
            return <PersonOutlinedIcon {...iconProps} />;
          }
          case Membership.SelfLeave: {
            return <LogoutOutlinedIcon {...iconProps} />;
          }
          case Membership.Remove: {
            return <PersonRemoveAlt1OutlinedIcon {...iconProps} />;
          }
          default: {
            return null;
          }
        }
      }
      case "m.room.name": {
        return <ModeEditOutlinedIcon {...iconProps} />;
      }
      case "m.room.create": {
        return <PersonOutlinedIcon {...iconProps} />;
      }
      case "m.room.avatar": {
        return <CameraAltOutlinedIcon {...iconProps} />;
      }
      case "m.room.power_levels": {
        return <PersonOutlinedIcon {...iconProps} />;
      }
      default: {
        return null;
      }
    }
  }
  function displayText(systemMessage: ChatSystemMessageType) {
    if (!systemMessage) return;
    switch (systemMessage.type) {
      case "m.room.member": {
        if (systemMessage.avatarUrl) {
          return `${systemMessage.userName} hat das Profilbild geändert.`;
        }
        switch (systemMessage.membership) {
          case Membership.Join: {
            return `${systemMessage.userName} ist dem Chat beigetreten.`;
          }
          case Membership.Leave: {
            return `${systemMessage.userName} hat die Unterhaltung verlassen.`;
          }
          case Membership.Invite: {
            return `Sie haben ${systemMessage.userName} eine Beitrittseinladung gesendet.`;
          }
          case Membership.SelfLeave: {
            return `Sie haben die Gruppe verlassen und können keine weiteren Nachrichten senden.`;
          }
          case Membership.Remove: {
            return `${systemMessage.sender} hat ${systemMessage.userName} gelöscht.`;
          }
          default: {
            return null;
          }
        }
      }
      case "m.room.name": {
        return `Sie haben den Gruppennamen umbenannt zu „${systemMessage.roomName}”.`;
      }
      case "m.room.create": {
        return `${systemMessage.creator} hat den Raum erstellt und konfiguriert.`;
      }
      case "m.room.avatar": {
        return `Sie haben das Profilbild geändert.`;
      }
      case "m.room.power_levels": {
        const admins = systemMessage.admin ?? [];
        const moreThanOne = admins?.length > 1;
        return `${admins.join(", ")} ${moreThanOne ? "sind jetzt Admins" : "ist jetzt Admin"}.`;
      }
      default: {
        return null;
      }
    }
  }

  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      gap={1}
      width="100%"
      textAlign="center"
    >
      <Box sx={{ display: { xxs: "none", sm: "flex" } }}>
        {displayIcon(message)}
      </Box>
      <Typography level="title-sm" textColor="neutral.500" fontWeight="500">
        {displayText(message)}
      </Typography>
    </Stack>
  );
}
