/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MatrixEvent, Room, RoomEvent } from "matrix-js-sdk/lib/matrix";
import { useEffect, useState } from "react";
import { isObjectType } from "remeda";

import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { useChatSearchParams } from "@/lib/businessModules/chat/shared/hooks/useChatSearchParams";
import { isReceiptType } from "@/lib/businessModules/chat/shared/types";
import {
  markAllMessagesAsRead,
  setReadMarker,
} from "@/lib/businessModules/chat/shared/utils";
import { useWindowFocus } from "@/lib/shared/hooks/useWindowFocus";

export function useReadConfirmation(showReadConfirmation: boolean) {
  const { matrixClient } = useChatClientContext();
  const isFocused = useWindowFocus();
  const { selectedRoomId } = useChatSearchParams();
  const [messageReadsPerRoom, setMessageReadsPerRoom] = useState<
    Record<string, string[]>
  >({});

  useEffect(() => {
    if (!isFocused) return;
    if (!showReadConfirmation) {
      void setReadMarker({
        roomId: selectedRoomId,
        matrixClient,
      });
      return;
    }
    void markAllMessagesAsRead({
      roomId: selectedRoomId,
      matrixClient,
    });
  }, [isFocused, matrixClient, selectedRoomId, showReadConfirmation]);

  // Subscribe to room timeline
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
  }, [matrixClient, messageReadsPerRoom]);

  return { messageReadsPerRoom };
}
