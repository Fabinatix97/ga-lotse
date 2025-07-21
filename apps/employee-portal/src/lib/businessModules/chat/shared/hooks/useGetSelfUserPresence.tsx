/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useContext, useMemo } from "react";

import { ChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import { usePresence } from "@/lib/businessModules/chat/shared/hooks/usePresence";
import { Presence } from "@/lib/businessModules/chat/shared/types";

export function useGetSelfUserPresence() {
  const { userSettings, canAccessChat } = useChat();
  const { matrixClient, isClientPrepared } =
    useContext(ChatClientContext) ?? {};
  const loggedInUserId = matrixClient?.getUserId();
  const { usersPresence } = usePresence(loggedInUserId ?? undefined);

  const isChatEnabled =
    canAccessChat &&
    userSettings.chatUsageEnabled &&
    !userSettings.accountDeactivated;

  return useMemo(() => {
    let presence: Presence | undefined;
    if (!isClientPrepared) {
      presence = "offline";
    } else if (!userSettings.sharePresence) {
      presence = "disabled";
    } else {
      presence = usersPresence[loggedInUserId ?? ""] ?? "offline";
    }

    return {
      userPresence: presence,
      isChatEnabled,
    };
  }, [
    loggedInUserId,
    userSettings.sharePresence,
    usersPresence,
    isChatEnabled,
    isClientPrepared,
  ]);
}
