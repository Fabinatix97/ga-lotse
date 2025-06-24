/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ChatOutlined } from "@mui/icons-material";

import { ApiUserRole } from "@eshg/base-api";
import { SideNavigationItem, hasUserRole } from "@eshg/lib-employee-portal";

import { ChatMessageCounter } from "@/lib/businessModules/chat/components/ChatMessageCounter";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";

import { routes } from "./routes";

const sideNavigationItem: SideNavigationItem = {
  type: "SideNavigationLinkItem",
  name: "Chat",
  href: routes.index,
  decorator: <ChatOutlined />,
  accessCheck: hasUserRole(ApiUserRole.ChatUser),
  chip: <ChatMessageCounter />,
};

export function useSideNavigationItems(): SideNavigationItem[] {
  const { canAccessChat, userSettings } = useChat();

  return canAccessChat && !userSettings.accountDeactivated
    ? [sideNavigationItem]
    : [];
}
