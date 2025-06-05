/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { createContext, useContext, useMemo } from "react";
import { isNullish, omit } from "remeda";

import { ApiUserRole } from "@eshg/base-api";
import { ApiChatFeature } from "@eshg/chat-management-api";
import {
  useGetSelfUser,
  useHasUserRoleCheck,
  useIsOffline,
} from "@eshg/lib-employee-portal";
import { RequiresChildren } from "@eshg/lib-portal";

import { useIsNewFeatureEnabledUnsuspended } from "@/lib/businessModules/chat/api/queries/featureTogglesApi";
import { useGetUserSettings } from "@/lib/businessModules/chat/api/queries/userSettingsApi";
import { MessageTeaserProvider } from "@/lib/businessModules/chat/components/messageTeaser/MessageTeaserProvider";
import { ChatClientProvider } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { UnreadNotificationsPerRoomProvider } from "@/lib/businessModules/chat/shared/UnreadNotificationsPerRoomProvider";
import { ChatConfiguration } from "@/lib/businessModules/chat/shared/config";
import { ChatUserSettings } from "@/lib/businessModules/chat/shared/types";

interface ChatProviderContextType {
  configuration: ChatConfiguration;
  userSettings: ChatUserSettings;
  canAccessChat: boolean;
  isSettingsLoading: boolean;
  isFeatureToggleLoading: boolean;
  isFeatureToggleSuccess: boolean;
}

const ChatContext = createContext<ChatProviderContextType | undefined>(
  undefined,
);

interface ChatProviderProps extends RequiresChildren {
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
      accountRegistered: false,
      ...(userSettingsData && omit(userSettingsData, ["userId"])),
    }),
    [userSettingsData],
  );

  const contextValue = useMemo(
    () => ({
      configuration,
      userSettings,
      canAccessChat,
      isSettingsLoading: isLoading,
      isFeatureToggleLoading: featureToggleChatEnabledLoading,
      isFeatureToggleSuccess: featureToggleChatEnabledSuccess,
    }),
    [
      configuration,
      userSettings,
      canAccessChat,
      isLoading,
      featureToggleChatEnabledLoading,
      featureToggleChatEnabledSuccess,
    ],
  );

  return (
    <ChatContext value={contextValue}>
      {userSettings.chatUsageEnabled && !userSettings.accountDeactivated ? (
        <MessageTeaserProvider>
          <ChatClientProvider>
            <UnreadNotificationsPerRoomProvider>
              {children}
            </UnreadNotificationsPerRoomProvider>
          </ChatClientProvider>
        </MessageTeaserProvider>
      ) : (
        children
      )}
    </ChatContext>
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
  const contextValue = useMemo<ChatProviderContextType>(
    () => ({
      configuration,
      userSettings: {
        accountDeactivated: false,
        chatConsentAsked: undefined,
        chatUsageEnabled: false,
        sharePresence: false,
        showReadConfirmation: false,
        showTypingNotification: false,
        accountRegistered: false,
      },
      canAccessChat: false,
      isSettingsLoading: false,
      isFeatureToggleLoading: false,
      isFeatureToggleSuccess: true,
    }),
    [configuration],
  );

  return <ChatContext value={contextValue}>{children}</ChatContext>;
}
