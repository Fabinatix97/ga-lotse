/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { EventType, MsgType } from "matrix-js-sdk";
import { RelationType } from "matrix-js-sdk/lib/types";
import { useCallback } from "react";

import { useSnackbar } from "@eshg/lib-portal";

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

  const editMessage = useCallback(
    async ({
      eventId,
      text,
      roomId,
      mentionedUsers,
    }: {
      eventId: string;
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
          "m.new_content": {
            body: text,
            msgtype: MsgType.Text,
          },
          "m.relates_to": {
            rel_type: "m.replace" as RelationType.Replace,
            event_id: eventId,
          },
        });
        await matrixClient.sendTyping(roomId, false, 3000);
      } catch (e) {
        snackbar.error("Die Nachricht konnte nicht gesendet werden");
        logger.warn(e);
      }
    },
    [matrixClient, snackbar],
  );

  return { sendMessage, editMessage };
}
