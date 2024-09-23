/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { EventType, MsgType } from "matrix-js-sdk/lib/matrix";
import { useCallback, useContext } from "react";

import { ChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import { markAllMessagesAsRead } from "@/lib/businessModules/chat/shared/utils";

export function useSendMessage() {
  const { canAccessChat, userSettings } = useChat();
  const chatContext = useContext(ChatClientContext);
  const snackbar = useSnackbar();

  const isChatEnabled =
    canAccessChat && userSettings.chatUsageEnabled && chatContext?.matrixClient;

  const sendMessage = useCallback(
    async (text: string, roomId: string) => {
      if (isChatEnabled) {
        const currentMatrixClient = chatContext.matrixClient;
        try {
          await currentMatrixClient.sendEvent(roomId, EventType.RoomMessage, {
            body: text,
            msgtype: MsgType.Text,
            format: "org.matrix.custom.html",
          });
          await markAllMessagesAsRead({
            matrixClient: currentMatrixClient,
            roomId,
          });
          // snackbar.confirmation("Nachricht gesendet");
        } catch {
          snackbar.error("Die Nachricht konnte nicht gesendet werden");
        }
      }
    },
    [chatContext?.matrixClient, isChatEnabled, snackbar],
  );

  return { sendMessage };
}
