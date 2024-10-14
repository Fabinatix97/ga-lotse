/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { MatrixEvent, Room, RoomEvent } from "matrix-js-sdk/lib/matrix";
import { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import {
  Membership,
  MessageTypeEnum,
} from "@/lib/businessModules/chat/shared/enums";
import { useChatSearchParams } from "@/lib/businessModules/chat/shared/hooks/useChatSearchParams";
import { ChatSystemMessage } from "@/lib/businessModules/chat/shared/types";
import { sortMessages } from "@/lib/businessModules/chat/shared/utils";

export function useChatSystemMessages() {
  const [systemMessages, setSystemMessages] = useState<
    Record<string, ChatSystemMessage[]>
  >({});
  const { matrixClient } = useChatClientContext();
  const { selectedRoomId } = useChatSearchParams();

  const onSystemMessage = useCallback(
    (event: MatrixEvent, room: Room | undefined) => {
      const eventType = event.getType();
      const eventContent = event.getContent();
      const roomId = room?.roomId;
      if (!roomId) return;

      const newSystemMessage = {
        type: event.getType(),
        timestamp: event.getDate(),
        messageType: MessageTypeEnum.SystemMessage,
        id: event.getId() ?? uuidv4(),
      };

      switch (eventType) {
        case "m.room.member": {
          const selfLeave =
            eventContent.membership === Membership.Leave &&
            (room.getMyMembership() as Membership) === Membership.Leave;

          return {
            ...newSystemMessage,
            membership: selfLeave
              ? Membership.SelfLeave
              : (eventContent.membership as Membership),
            userName: eventContent.displayname,
            avatarUrl: eventContent.avatar_url,
          };
        }
        case "m.room.name": {
          return { ...newSystemMessage, roomName: eventContent.name as string };
        }
        case "m.room.create": {
          return {
            ...newSystemMessage,
            creator: eventContent.creator as string,
          };
        }
        case "m.room.power_levels": {
          const adminName =
            typeof eventContent.creator === "string" &&
            matrixClient.getUser(eventContent.creator || "");
          const newAdminIds = Object.entries(
            (eventContent.users || {}) as Record<string, number>,
          )
            ?.filter(([_, powerLevel]) => powerLevel === 100)
            ?.map(([userId]) => userId);
          const newAdmins = newAdminIds
            ?.map((newAdminId) => matrixClient.getUser(newAdminId)?.displayName)
            .filter((item) => !!item) as string[];

          return {
            ...newSystemMessage,
            admin: newAdmins ?? [adminName],
          };
        }
        default: {
          return;
        }
      }
    },
    [matrixClient],
  );

  const handleSystemMessage = useCallback(
    (event: MatrixEvent, room: Room | undefined) => {
      const newSystemMessage = onSystemMessage(event, room);
      if (!newSystemMessage) return;
      const roomId = room?.roomId;
      if (!roomId) return;

      setSystemMessages((prevState) => {
        const currentMessages = prevState[roomId];
        if (!currentMessages) {
          return { ...prevState, [roomId]: [newSystemMessage] };
        }

        const newRoomMessages = sortMessages([
          ...currentMessages,
          newSystemMessage,
        ]);

        return {
          ...prevState,
          [room.roomId]: newRoomMessages,
        };
      });
    },
    [onSystemMessage],
  );

  const onRoomTimeline = useCallback(
    (event: MatrixEvent, room: Room | undefined, _: boolean | undefined) => {
      return handleSystemMessage(event, room);
    },
    [handleSystemMessage],
  );

  // listen for new messages
  useEffect(() => {
    matrixClient.on(RoomEvent.Timeline, onRoomTimeline);

    return () => {
      matrixClient.removeListener(RoomEvent.Timeline, onRoomTimeline);
    };
  }, [matrixClient, onRoomTimeline]);

  useEffect(() => {
    // get historical system messages for all rooms
    const rooms = matrixClient.getRooms();
    const joinedRooms = rooms.filter(
      (room) => room.getMyMembership() === "join",
    );
    const initialSystemMessages = joinedRooms.reduce<
      Record<string, ChatSystemMessage[]>
    >((acc, room) => {
      const timeline = room.getLiveTimeline();
      const events = timeline.getEvents();
      const historicalSystemMessages = events
        .map((event: MatrixEvent) => {
          return onSystemMessage(event, room);
        })
        .filter((item) => !!item);
      return { ...acc, [room.roomId]: historicalSystemMessages };
    }, {});

    setSystemMessages(initialSystemMessages);
  }, [matrixClient, onSystemMessage]);

  return {
    roomSystemMessages: systemMessages[selectedRoomId] ?? [],
  };
}
