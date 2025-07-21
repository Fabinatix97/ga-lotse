/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import NotificationsIcon from "@mui/icons-material/Notifications";
import UserIcon from "@mui/icons-material/Person";
import { Badge, Box } from "@mui/joy";
import { useRef } from "react";

import { useGetUnreadNotifications } from "@/lib/baseModule/api/queries/notifications";
import { useSelfUserSidebar } from "@/lib/baseModule/components/layout/SelfUserSidebar";
import { HeaderIconButton } from "@/lib/baseModule/components/layout/header/HeaderIconButton";
import { useNotificationsSidebar } from "@/lib/baseModule/components/layout/notificationsSidebar/NotificationsSidebar";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import { useGetSelfUserPresence } from "@/lib/businessModules/chat/shared/hooks/useGetSelfUserPresence";
import {
  getPresenceLabel,
  getStatusColor,
} from "@/lib/businessModules/chat/shared/utils";

import { HeaderMessagesButton } from "./HeaderMessagesButton";

export function HeaderButtons() {
  const nodeRef = useRef(null);
  const { canAccessChat, userSettings } = useChat();
  const userSidebar = useSelfUserSidebar();
  const { data: notificationResponse } = useGetUnreadNotifications();
  const notificationsSidebar = useNotificationsSidebar();
  const { userPresence, isChatEnabled } = useGetSelfUserPresence();

  const notificationsCount = notificationResponse
    ? notificationResponse.notifications.length
    : 0;

  function toggleNotificationsSidebar(): void {
    if (notificationsSidebar.isOpen) {
      notificationsSidebar.close();
    } else {
      notificationsSidebar.open({ notificationResponse });
    }
  }

  function toggleUserSidebar(): void {
    if (userSidebar.isOpen) {
      userSidebar.close();
    } else {
      userSidebar.open();
    }
  }

  return (
    <Box
      ref={nodeRef}
      sx={{
        marginLeft: "auto",
        display: "flex",
        gap: { xxs: 1, sm: 2 },
      }}
    >
      <HeaderIconButton
        aria-label={`${notificationsCount} Benachrichtigungen`}
        onClick={toggleNotificationsSidebar}
      >
        <Badge
          color="danger"
          sx={{ "--Badge-ring": "none" }}
          badgeContent={notificationsCount}
        >
          <NotificationsIcon sx={{ color: "background.body" }} />
        </Badge>
      </HeaderIconButton>

      {canAccessChat && !userSettings.accountDeactivated && (
        <HeaderMessagesButton />
      )}

      <HeaderIconButton
        aria-label={`Benutzer (${getPresenceLabel(userPresence)})`}
        sx={{
          backgroundColor: "transparent",
        }}
        onClick={toggleUserSidebar}
      >
        <Badge
          invisible={!isChatEnabled}
          size="sm"
          badgeInset="18%"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          sx={{
            "& .MuiBadge-badge": {
              backgroundColor: getStatusColor(userPresence),
              boxShadow: "0 0 0 1px",
            },
          }}
        >
          <UserIcon sx={{ color: "background.body" }} />
        </Badge>
      </HeaderIconButton>
    </Box>
  );
}
