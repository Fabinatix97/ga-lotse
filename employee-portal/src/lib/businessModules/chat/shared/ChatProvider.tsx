/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/employee-portal-api/base";
import { ApiChatFeature } from "@eshg/employee-portal-api/chatManagement";
import { RequiresChildren } from "@eshg/lib-portal/types/react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { isNullish, omit } from "remeda";

import { useGetSelfUser } from "@/lib/baseModule/api/queries/users";
import { useIsNewFeatureEnabled } from "@/lib/businessModules/chat/api/queries/featureTogglesApi";
import { useGetUserSettings } from "@/lib/businessModules/chat/api/queries/userSettingsApi";
import { ChatClientProvider } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { ChatConfiguration } from "@/lib/businessModules/chat/shared/config";
import { MessageTeaserProvider } from "@/lib/shared/components/chat/MessageTeaserProvider";
import { useHasUserRoleCheck } from "@/lib/shared/hooks/useAccessControl";

import { ChatUserSettings } from "./types";

export interface ChatProviderContextType {
  configuration: ChatConfiguration;
  userSettings: ChatUserSettings;
  chatSidebar: {
    isOpen: boolean;
    toggle: () => void;
    close: () => void;
  };
  canAccessChat: boolean;
  isSettingsLoading: boolean;
  isFeatureToggleLoading: boolean;
}

const ChatContext = createContext<ChatProviderContextType | undefined>(
  undefined,
);

export interface ChatProviderProps extends RequiresChildren {
  configuration: ChatConfiguration;
}

export function ChatProvider({ children, configuration }: ChatProviderProps) {
  const {
    data: featureToggleChatEnabled,
    isLoading: featureToggleChatEnabledLoading,
  } = useIsNewFeatureEnabled(ApiChatFeature.ChatBase);

  const canAccessChat =
    useHasUserRoleCheck(ApiUserRole.ChatManagementWrite) &&
    !!featureToggleChatEnabled;
  const { data: selfUser } = useGetSelfUser();
  const { data: userSettingsData, isLoading } = useGetUserSettings(
    selfUser.userId,
    canAccessChat,
  );

  // Chat user settings
  const userSettings = useMemo<ChatUserSettings>(
    () => ({
      chatConsentAsked: undefined,
      chatUsageEnabled: false,
      sharePresence: false,
      showReadConfirmation: false,
      showTypingNotification: false,
      ...(userSettingsData && omit(userSettingsData, ["userId"])),
    }),
    [userSettingsData],
  );

  // Chat sidebar
  const [chatSidebarOpen, setChatSidebarOpen] = useState(false);

  const toggleChatSidebar = useCallback(() => {
    if (canAccessChat && userSettings.chatUsageEnabled) {
      setChatSidebarOpen((prev) => !prev);
    }
  }, [canAccessChat, userSettings.chatUsageEnabled]);

  const closeChatSidebar = useCallback(() => setChatSidebarOpen(false), []);

  return (
    <ChatContext.Provider
      value={{
        configuration,
        userSettings,
        chatSidebar: {
          close: closeChatSidebar,
          toggle: toggleChatSidebar,
          isOpen: chatSidebarOpen,
        },
        canAccessChat,
        isSettingsLoading: isLoading,
        isFeatureToggleLoading: featureToggleChatEnabledLoading,
      }}
    >
      {userSettings.chatUsageEnabled ? (
        <MessageTeaserProvider>
          <ChatClientProvider>{children}</ChatClientProvider>
        </MessageTeaserProvider>
      ) : (
        children
      )}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);

  if (isNullish(context)) {
    throw new Error("useChat was called outside ChatContextProvider");
  }

  return context;
}
