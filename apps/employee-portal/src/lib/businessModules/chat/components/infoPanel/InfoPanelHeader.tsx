/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CloseIcon from "@mui/icons-material/Close";
import { IconButton, Stack, Typography } from "@mui/joy";
import { useEffect, useRef } from "react";

import { useIsBreakpointDown } from "@eshg/lib-portal";

import { ChatAvatar } from "@/lib/businessModules/chat/components/ChatAvatar";
import { ChatColumnHeaderWrapper } from "@/lib/businessModules/chat/components/ChatColumnHeaderWrapper";
import { CommunicationType } from "@/lib/businessModules/chat/shared/enums";
import { useRoomInfo } from "@/lib/businessModules/chat/shared/hooks/useRoomInfo";
import { useRoomStateEventUpdate } from "@/lib/businessModules/chat/shared/hooks/useRoomStateEventUpdate";
import { UserFromDirectory } from "@/lib/businessModules/chat/shared/types";

interface InfoPanelHeaderProps {
  roomId?: string;
  user?: UserFromDirectory;
  close: () => void;
  onBackIconClick: () => void;
  type?: "roomInfo" | "memberInfo";
}

export function InfoPanelHeader({
  roomId,
  user,
  close,
  onBackIconClick,
  type = "roomInfo",
}: Readonly<InfoPanelHeaderProps>) {
  const { communicationType, getAvatarUrl, getDMRoomMember, room } =
    useRoomInfo(roomId);

  useRoomStateEventUpdate(roomId);

  const isMobile = useIsBreakpointDown("sm");
  const focusRef = useRef<HTMLElement>(null);
  const focusRefMobile = useRef<HTMLElement>(null);
  useEffect(() => {
    if (focusRef.current && !isMobile) {
      focusRef.current.focus();
    }
    if (focusRefMobile.current && isMobile) {
      focusRefMobile.current.focus();
    }
  }, [isMobile]);

  const name = type === "memberInfo" ? user?.display_name : room?.name;

  const avatarType =
    type === "memberInfo" ? CommunicationType.DirectMessage : communicationType;

  const currentUserId =
    type === "memberInfo" ? user?.user_id : getDMRoomMember()?.userId;

  function getAvatar() {
    if (type === "memberInfo" && user?.avatar_url) return user?.avatar_url;
    if (type === "roomInfo" && getAvatarUrl) return getAvatarUrl();
    return null;
  }

  return (
    <ChatColumnHeaderWrapper>
      <Stack
        direction="row"
        sx={{
          alignItems: "center",
          height: "100%",
        }}
      >
        <Stack
          direction="row"
          spacing={{ xxs: 1, sm: 2 }}
          sx={{
            alignItems: "center",
            width: "100%",
            minWidth: 0,
            height: "100%",
          }}
        >
          <IconButton
            ref={(el) => {
              focusRefMobile.current = el;
            }}
            sx={{
              display: { xxs: "flex", sm: "none" },
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "3.25rem",
            }}
            aria-label="Zurück zum Chat"
            onClick={onBackIconClick}
          >
            <ArrowBackIosIcon color="primary" size="lg" />
          </IconButton>
          <ChatAvatar
            name={name}
            communicationType={avatarType}
            avatarUrl={getAvatar()}
            size="lg"
            userId={currentUserId}
          />
          <Typography
            noWrap
            level="title-md"
            component="h2"
            sx={{ minWidth: "5ch" }}
          >
            {name}
          </Typography>
        </Stack>
        <IconButton
          ref={(el) => {
            focusRef.current = el;
          }}
          variant="outlined"
          aria-label="Schließen"
          sx={{
            borderColor: "primary.outlinedBorder",
            display: { xxs: "none", sm: "flex" },
          }}
          onClick={close}
        >
          <CloseIcon color="primary" />
        </IconButton>
      </Stack>
    </ChatColumnHeaderWrapper>
  );
}
