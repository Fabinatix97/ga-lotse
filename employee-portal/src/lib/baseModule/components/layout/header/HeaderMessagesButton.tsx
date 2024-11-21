/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useNavigation } from "@eshg/lib-portal/components/navigation/NavigationContext";
import ForumIcon from "@mui/icons-material/Forum";
import { Badge } from "@mui/joy";
import { useContext } from "react";

import { HeaderIconButton } from "@/lib/baseModule/components/layout/header/HeaderIconButton";
import { routes } from "@/lib/baseModule/shared/routes";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import { NotificationContext } from "@/lib/businessModules/chat/shared/NotificationProvider";

export function HeaderMessagesButton() {
  const { tryNavigate } = useNavigation();
  const { canAccessChat, userSettings, messagesSidebar } = useChat();
  const { unreadNotificationsPerRoom } = useContext(NotificationContext) ?? {};
  const unreadMessagesCount =
    Object.keys(unreadNotificationsPerRoom ?? {}).length ?? 0;

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
      tryNavigate(routes.chat as string);
    }
  }

  return (
    <HeaderIconButton
      aria-label={`${unreadMessagesCount} Benachrichtigungen`}
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
