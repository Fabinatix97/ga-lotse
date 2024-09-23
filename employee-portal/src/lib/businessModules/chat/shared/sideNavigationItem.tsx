/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiUserRole } from "@eshg/employee-portal-api/base";
import { Chat } from "@mui/icons-material";

import { SideNavigationItem } from "@/lib/baseModule/components/layout/sideNavigation/types";
import { ChatMessageCounter } from "@/lib/businessModules/chat/components/ChatMessageCounter";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import { hasUserRole } from "@/lib/shared/helpers/accessControl";

import { routes } from "./routes";

export const sideNavigationItem: SideNavigationItem = {
  name: "Chat",
  href: routes.index,
  decorator: <Chat />,
  accessCheck: hasUserRole(ApiUserRole.ChatManagementWrite),
  chip: <ChatMessageCounter />,
};

export function useSideNavigationItems(): SideNavigationItem[] {
  const { canAccessChat } = useChat();

  if (!canAccessChat) {
    return [];
  }

  return [sideNavigationItem];
}
