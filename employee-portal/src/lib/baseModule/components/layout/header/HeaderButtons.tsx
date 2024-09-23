/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import NotificationsIcon from "@mui/icons-material/Notifications";
import UserIcon from "@mui/icons-material/Person";
import { Badge, Box } from "@mui/joy";
import { Dispatch, SetStateAction, useLayoutEffect, useRef } from "react";

import { HeaderIconButton } from "@/lib/baseModule/components/layout/header/HeaderIconButton";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";

import { HeaderProps } from "./Header";
import { HeaderMessagesButton } from "./HeaderMessagesButton";

interface HeaderButtonsProps extends Pick<HeaderProps, "notificationsCount"> {
  setUserSidebarOpen: Dispatch<SetStateAction<boolean>>;
  notificationsSidebarOpen: boolean;
  setNotificationsSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

export function HeaderButtons({
  setUserSidebarOpen,
  notificationsSidebarOpen,
  setNotificationsSidebarOpen,
  notificationsCount,
}: HeaderButtonsProps) {
  const nodeRef = useRef(null);
  const { canAccessChat, chatSidebar } = useChat();

  useLayoutEffect(() => {
    if (chatSidebar.isOpen) {
      setUserSidebarOpen(false);
      setNotificationsSidebarOpen(false);
    }
  }, [chatSidebar.isOpen, setNotificationsSidebarOpen, setUserSidebarOpen]);

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
        onClick={() => {
          setUserSidebarOpen(false);
          chatSidebar.close();
          setNotificationsSidebarOpen(!notificationsSidebarOpen);
        }}
      >
        <Badge
          color="danger"
          sx={{ "--Badge-ring": "none" }}
          badgeContent={notificationsCount}
        >
          <NotificationsIcon sx={{ color: "background.body" }} />
        </Badge>
      </HeaderIconButton>
      {canAccessChat && <HeaderMessagesButton />}
      <HeaderIconButton
        aria-label="Benutzer"
        sx={{
          backgroundColor: "transparent",
        }}
        onClick={() => {
          setNotificationsSidebarOpen(false);
          chatSidebar.close();
          setUserSidebarOpen((prevState) => !prevState);
        }}
      >
        <UserIcon sx={{ color: "background.body" }} />
      </HeaderIconButton>
    </Box>
  );
}
