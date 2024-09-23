/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MatrixEvent, Room, RoomEvent } from "matrix-js-sdk/lib/matrix";
import { useEffect, useState } from "react";
import { isObjectType } from "remeda";

import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { useSelectedRoomId } from "@/lib/businessModules/chat/shared/hooks/useSelectedRoomId";
import {
  ReadConfirmationsPerRoom,
  ReadConfirmationsPerUser,
  isReceiptType,
} from "@/lib/businessModules/chat/shared/types";
import {
  markAllMessagesAsRead,
  setReadMarker,
} from "@/lib/businessModules/chat/shared/utils";
import { useWindowFocus } from "@/lib/shared/hooks/useWindowFocus";

export function useReadConfirmation(showReadConfirmation: boolean) {
  const [readConfirmationsPerRoom, setReadConfirmationsPerRoom] =
    useState<ReadConfirmationsPerRoom>({});
  const { matrixClient } = useChatClientContext();
  const isFocused = useWindowFocus();
  const { selectedRoomId } = useSelectedRoomId();

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

      // Map to keep track of the latest read event for each user
      const latestReadEvents: ReadConfirmationsPerUser = {};

      // First pass: Find the latest read event for each user
      Object.entries(receiptContent).forEach(([eventId, receiptTypes]) => {
        if (!isObjectType(receiptTypes)) return;
        Object.entries(receiptTypes).forEach(([_, receipts]) => {
          if (!isObjectType(receipts)) return;
          Object.entries(receipts).forEach(([eventUserId, receipt]) => {
            if (!isReceiptType(receipt)) return;
            const timestamp = receipt.ts || 0;
            // Update the latest event ID if the current timestamp is newer
            if (
              !latestReadEvents[eventUserId] ||
              timestamp > (latestReadEvents[eventUserId]?.timestamp ?? 0)
            ) {
              latestReadEvents[eventUserId] = { eventId, timestamp };
            }
          });
        });
      });

      // Update the state with the new read confirmations
      setReadConfirmationsPerRoom((prevState) => {
        const updatedRoomState = Object.entries(latestReadEvents).reduce(
          (acc, [userId, { eventId, timestamp }]) => {
            return { ...acc, [userId]: { eventId, timestamp } };
          },
          prevState[room.roomId] ?? {},
        );

        return {
          ...prevState,
          [room.roomId]: updatedRoomState,
        };
      });
    }
    matrixClient.on(RoomEvent.Receipt, onRoomReceipt);

    return () => {
      matrixClient.removeListener(RoomEvent.Receipt, onRoomReceipt);
    };
  }, [matrixClient]);

  return { readConfirmationsPerRoom };
}
