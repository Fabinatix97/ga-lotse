/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { EventType, MsgType } from "matrix-js-sdk";
import { useCallback } from "react";

import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { logger } from "@/lib/businessModules/chat/shared/helpers";

export function useSendMessage() {
  const { matrixClient } = useChatClientContext();
  const snackbar = useSnackbar();
  const sendMessage = useCallback(
    async ({
      text,
      roomId,
      mentionedUsers,
    }: {
      text: string;
      roomId: string;
      mentionedUsers?: string[];
    }) => {
      try {
        await matrixClient.sendEvent(roomId, EventType.RoomMessage, {
          body: text,
          msgtype: MsgType.Text,
          format: "org.matrix.custom.html",
          ...(mentionedUsers && {
            ["m.mentions"]: { ["user_ids"]: mentionedUsers },
          }),
        });
        await matrixClient.sendTyping(roomId, false, 3000);
      } catch (e) {
        snackbar.error("Die Nachricht konnte nicht gesendet werden");
        logger.warn(e);
      }
    },
    [matrixClient, snackbar],
  );

  return { sendMessage };
}
