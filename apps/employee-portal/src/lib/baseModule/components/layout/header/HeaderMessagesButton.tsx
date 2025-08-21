/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import ForumIcon from "@mui/icons-material/Forum";
import { Badge } from "@mui/joy";
import { useContext } from "react";

import { useNavigation } from "@eshg/lib-portal";

import { HeaderIconButton } from "@/lib/baseModule/components/layout/header/HeaderIconButton";
import { useMessagesSidebar } from "@/lib/baseModule/components/layout/messagesSidebar/MessagesSidebar";
import { routes } from "@/lib/baseModule/shared/routes";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import { UnreadNotificationsPerRoomContext } from "@/lib/businessModules/chat/shared/UnreadNotificationsPerRoomProvider";

export function HeaderMessagesButton() {
  const { tryNavigate } = useNavigation();
  const { canAccessChat, userSettings } = useChat();
  const messagesSidebar = useMessagesSidebar();
  const unreadNotificationsPerRoom =
    useContext(UnreadNotificationsPerRoomContext) ?? {};
  const unreadMessagesCount =
    Object.keys(unreadNotificationsPerRoom).length ?? 0;

  function toggleMessagesSidebar(): void {
    if (messagesSidebar.isOpen) {
      messagesSidebar.close();
    } else {
      messagesSidebar.open();
    }
  }

  function handleClick(): void {
    if (canAccessChat && userSettings.chatUsageEnabled) {
      toggleMessagesSidebar();
    } else {
      tryNavigate(routes.chat);
    }
  }

  return (
    <HeaderIconButton
      data-testid="header-messages-button"
      aria-label={`${unreadMessagesCount} Chat-Benachrichtigungen`}
      onClick={handleClick}
    >
      <Badge
        color="danger"
        sx={{
          "--Badge-ring": "none",
        }}
        badgeContent={unreadMessagesCount}
      >
        <ForumIcon sx={{ color: "background.body" }} />
      </Badge>
    </HeaderIconButton>
  );
}
