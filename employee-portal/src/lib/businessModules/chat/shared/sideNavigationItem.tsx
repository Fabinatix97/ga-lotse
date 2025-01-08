/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUserRole } from "@eshg/employee-portal-api/base";
import { ChatOutlined } from "@mui/icons-material";

import {
  SideNavigationItem,
  UseSideNavigationItemsResult,
} from "@/lib/baseModule/components/layout/sideNavigation/types";
import { ChatMessageCounter } from "@/lib/businessModules/chat/components/ChatMessageCounter";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import { hasUserRole } from "@/lib/shared/helpers/accessControl";

import { routes } from "./routes";

export const sideNavigationItem: SideNavigationItem = {
  name: "Chat",
  href: routes.index,
  decorator: <ChatOutlined />,
  accessCheck: hasUserRole(ApiUserRole.ChatManagementWrite),
  chip: <ChatMessageCounter />,
};

export function useSideNavigationItems(): UseSideNavigationItemsResult {
  const { canAccessChat, userSettings } = useChat();

  return {
    isLoading: false,
    items:
      canAccessChat && !userSettings.accountDeactivated
        ? [sideNavigationItem]
        : [],
  };
}
