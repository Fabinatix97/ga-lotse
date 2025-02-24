/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUserRole } from "@eshg/base-api";
import { hasUserRole } from "@eshg/lib-employee-portal/helpers/accessControl";
import {
  SideNavigationItem,
  UseSideNavigationItemsResult,
} from "@eshg/lib-employee-portal/types/sideNavigation";
import { ChatOutlined } from "@mui/icons-material";

import { ChatMessageCounter } from "@/lib/businessModules/chat/components/ChatMessageCounter";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";

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
