/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  EventType,
  MatrixEvent,
  RoomState,
  RoomStateEvent,
} from "matrix-js-sdk";
import { useEffect, useState } from "react";
import { isStrictEqual } from "remeda";

import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";

export function useRoomStateEventUpdate(roomId?: string) {
  const { matrixClient } = useChatClientContext();
  const [timestamp, setTimestamp] = useState<number>();

  useEffect(() => {
    function onEvent(event: MatrixEvent, state: RoomState) {
      if (isStrictEqual(state.roomId, roomId)) {
        const acceptedEvents = [
          EventType.RoomAvatar,
          EventType.RoomName,
          EventType.RoomPowerLevels,
        ];
        const eventType = event.getType() as EventType;
        if (acceptedEvents.includes(eventType)) {
          const time = state.getLastModifiedTime();
          setTimestamp(time);
        }
      }
    }
    matrixClient.on(RoomStateEvent.Events, onEvent);

    return () => {
      matrixClient.off(RoomStateEvent.Events, onEvent);
    };
  }, [matrixClient, roomId]);

  return timestamp;
}
