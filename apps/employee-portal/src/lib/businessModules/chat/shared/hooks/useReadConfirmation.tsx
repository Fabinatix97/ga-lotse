/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MatrixEvent, Room, RoomEvent } from "matrix-js-sdk";
import { useEffect, useState } from "react";
import { isObjectType } from "remeda";

import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import { isReceiptType } from "@/lib/businessModules/chat/shared/types";

export function useReadConfirmation() {
  const { matrixClient } = useChatClientContext();
  const {
    userSettings: { showReadConfirmation },
  } = useChat();

  const [messageReadsPerRoom, setMessageReadsPerRoom] = useState<
    Record<string, string[]>
  >({});

  useEffect(() => {
    function onRoomReceipt(event: MatrixEvent, room: Room) {
      const receiptContent = event.getContent();
      const loggedInUserId = matrixClient.getUserId() ?? "";

      // Map to keep track of the latest read event for each user
      Object.entries(receiptContent).forEach(([eventId, receiptTypes]) => {
        if (!isObjectType(receiptTypes)) return;
        Object.entries(receiptTypes).forEach(([_, receipts]) => {
          if (!isObjectType(receipts)) return;
          Object.entries(receipts).forEach(([eventUserId, receipt]) => {
            if (!isReceiptType(receipt)) return;
            if (eventUserId === loggedInUserId) {
              return;
            } else {
              const readMessagesInRoom = messageReadsPerRoom[room.roomId] ?? [];
              setMessageReadsPerRoom((prevState) => ({
                ...prevState,
                [room.roomId]: [...readMessagesInRoom, eventId],
              }));
            }
          });
        });
      });
    }
    matrixClient.on(RoomEvent.Receipt, onRoomReceipt);

    return () => {
      matrixClient.removeListener(RoomEvent.Receipt, onRoomReceipt);
    };
  }, [matrixClient, messageReadsPerRoom, showReadConfirmation]);

  return { messageReadsPerRoom };
}
