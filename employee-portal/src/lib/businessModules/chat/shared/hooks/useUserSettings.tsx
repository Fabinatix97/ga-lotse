/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useGetSelfUser } from "@/lib/baseModule/api/queries/users";
import {
  useCreateOrUpdateUserSettings,
  useUpdateConsentUserSettings,
} from "@/lib/businessModules/chat/api/mutations/userSettingsApi";

export function useUserSettings() {
  const { data: selfUser } = useGetSelfUser();
  const userId = selfUser.userId;
  const createOrUpdateUserSettings = useCreateOrUpdateUserSettings();
  const updateConsentUserSettings = useUpdateConsentUserSettings();

  function togglePresenceStatus(sharePresence: boolean) {
    if (!userId) {
      return;
    }
    createOrUpdateUserSettings.mutate({
      userId: userId,
      sharePresence: !sharePresence,
    });
  }

  function toggleReadConfirmation(showReadConfirmation: boolean) {
    if (!userId) {
      return;
    }
    createOrUpdateUserSettings.mutate({
      userId: userId,
      showReadConfirmation: !showReadConfirmation,
    });
  }

  function toggleTypingNotifications(showTypingNotifications: boolean) {
    if (!userId) {
      return;
    }
    createOrUpdateUserSettings.mutate({
      userId: userId,
      showTypingNotification: !showTypingNotifications,
    });
  }

  function updateChatUserConsents(payload: {
    isChatConsentAsked: boolean;
    isChatUsageEnabled?: boolean;
  }) {
    if (!userId) return;

    updateConsentUserSettings.mutate({
      userId: userId,
      chatConsentAsked: payload.isChatConsentAsked,
      chatUsageEnabled: payload.isChatUsageEnabled,
    });
  }

  return {
    togglePresenceStatus,
    toggleReadConfirmation,
    toggleTypingNotifications,
    updateChatUserConsents,
  };
}
