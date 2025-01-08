/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiUserRole } from "@eshg/employee-portal-api/base";
import { ApiChatFeature } from "@eshg/employee-portal-api/chatManagement";
import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { createContext, useContext, useMemo } from "react";
import { doNothing, isNullish, omit } from "remeda";

import { useGetSelfUser } from "@/lib/baseModule/api/queries/users";
import { useMessagesSidebar } from "@/lib/baseModule/components/layout/messagesSidebar/MessagesSidebar";
import { useIsNewFeatureEnabledUnsuspended } from "@/lib/businessModules/chat/api/queries/featureTogglesApi";
import { useGetUserSettings } from "@/lib/businessModules/chat/api/queries/userSettingsApi";
import { MessageTeaserProvider } from "@/lib/businessModules/chat/components/messageTeaser/MessageTeaserProvider";
import { ChatClientProvider } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { NotificationProvider } from "@/lib/businessModules/chat/shared/NotificationProvider";
import { ChatConfiguration } from "@/lib/businessModules/chat/shared/config";
import { ChatUserSettings } from "@/lib/businessModules/chat/shared/types";
import { useHasUserRoleCheck } from "@/lib/shared/hooks/useAccessControl";
import { useIsOffline } from "@/lib/shared/hooks/useIsOffline";

export interface ChatProviderContextType {
  configuration: ChatConfiguration;
  userSettings: ChatUserSettings;
  canAccessChat: boolean;
  isSettingsLoading: boolean;
  isFeatureToggleLoading: boolean;
  isFeatureToggleSuccess: boolean;
  messagesSidebar: { isOpen: boolean; open: () => void; close: () => void };
}

const ChatContext = createContext<ChatProviderContextType | undefined>(
  undefined,
);

export interface ChatProviderProps extends RequiresChildren {
  configuration: ChatConfiguration;
}

export function ChatProvider(props: ChatProviderProps) {
  const isOffline = useIsOffline();

  return isOffline ? (
    <InnerChatProviderMock {...props} />
  ) : (
    <InnerChatProvider {...props} />
  );
}

function InnerChatProvider({ children, configuration }: ChatProviderProps) {
  const {
    data: featureToggleChatEnabled,
    isLoading: featureToggleChatEnabledLoading,
    isSuccess: featureToggleChatEnabledSuccess,
  } = useIsNewFeatureEnabledUnsuspended(ApiChatFeature.ChatBase);

  const { data: selfUser } = useGetSelfUser();
  const canAccessChat =
    useHasUserRoleCheck(ApiUserRole.ChatManagementWrite) &&
    !!featureToggleChatEnabled;
  const messagesSidebar = useMessagesSidebar();
  const { data: userSettingsData, isLoading } = useGetUserSettings(
    selfUser.userId,
    canAccessChat,
  );

  // Chat user settings
  const userSettings = useMemo<ChatUserSettings>(
    () => ({
      accountDeactivated: true,
      chatConsentAsked: undefined,
      chatUsageEnabled: false,
      sharePresence: false,
      showReadConfirmation: false,
      showTypingNotification: false,
      ...(userSettingsData && omit(userSettingsData, ["userId"])),
    }),
    [userSettingsData],
  );

  return (
    <ChatContext.Provider
      value={{
        configuration,
        userSettings,
        canAccessChat,
        isSettingsLoading: isLoading,
        isFeatureToggleLoading: featureToggleChatEnabledLoading,
        isFeatureToggleSuccess: featureToggleChatEnabledSuccess,
        messagesSidebar,
      }}
    >
      {userSettings.chatUsageEnabled && !userSettings.accountDeactivated ? (
        <MessageTeaserProvider>
          <ChatClientProvider>
            <NotificationProvider>{children}</NotificationProvider>
          </ChatClientProvider>
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

function InnerChatProviderMock({ children, configuration }: ChatProviderProps) {
  return (
    <ChatContext.Provider
      value={{
        configuration,
        userSettings: {
          accountDeactivated: false,
          chatConsentAsked: undefined,
          chatUsageEnabled: false,
          sharePresence: false,
          showReadConfirmation: false,
          showTypingNotification: false,
        },
        canAccessChat: false,
        isSettingsLoading: false,
        isFeatureToggleLoading: false,
        isFeatureToggleSuccess: true,
        messagesSidebar: {
          isOpen: false,
          open: doNothing(),
          close: doNothing(),
        },
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
