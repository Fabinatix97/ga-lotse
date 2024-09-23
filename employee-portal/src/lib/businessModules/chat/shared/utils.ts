/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { addMilliseconds, format, isToday } from "date-fns";
import {
  EventTimeline,
  MatrixClient,
  MatrixEvent,
  ReceiptType,
  Room,
  User,
} from "matrix-js-sdk/lib/matrix";
import { isEmpty, isString, last } from "remeda";

import { CommunicationType } from "@/lib/businessModules/chat/shared/enums";
import {
  Presence,
  ReadConfirmationsPerUser,
  RoomLastMessage,
  RoomWithCommunicationType,
  isMessageTypeWithBody,
} from "@/lib/businessModules/chat/shared/types";

export function findDirectChat({
  chatRooms,
  userId,
}: {
  chatRooms: RoomWithCommunicationType[];
  userId?: string;
}) {
  if (!userId) {
    return;
  }
  return chatRooms.find((room) => {
    if (room.communicationType !== CommunicationType.DirectMessage) {
      return false;
    }
    const members = room.room
      .getMembers()
      .filter((member) => member.membership !== "leave");
    return members.find((member) => member.userId === userId);
  });
}

// This is the 'official' method to distinguish direct messages from public rooms: https://github.com/matrix-org/matrix-js-sdk/issues/720#issuecomment-421578418
export function getRoomNameAndCommunicationType(
  room: Room,
): RoomWithCommunicationType {
  // These are direct chats where you were invited by someone:
  const type = room.getDMInviter() ? "directMessage" : "room";

  if (type === "directMessage") {
    return {
      room: Object.assign(room, {
        name: room.name.replace(/@(\w+):.+/, "$1"),
      }),
      communicationType: CommunicationType.DirectMessage,
    };
  }

  const allMembers = room
    .getLiveTimeline()
    .getState(EventTimeline.FORWARDS)
    ?.getMembers();

  // These are the direct chats that you invited someone to
  if (type === "room" && allMembers?.length && allMembers.length <= 2) {
    if (allMembers?.some((m) => m.getDMInviter())) {
      return { room, communicationType: CommunicationType.DirectMessage };
    }
  }
  return { room, communicationType: CommunicationType.PublicRoom };
}

export function getDirectMessageMember(room: RoomWithCommunicationType) {
  if (room.communicationType === CommunicationType.PublicRoom) {
    return;
  }
  return room.room.getAvatarFallbackMember();
}

export function formatUserReceipts(
  userReceipts: ReadConfirmationsPerUser | undefined,
): Record<string, string[]> | undefined {
  if (!userReceipts) return;

  return Object.entries(userReceipts).reduce(
    (acc, [userId, { eventId }]) => {
      const currentUserIds = acc[eventId] ?? [];
      return {
        ...acc,
        [eventId]: [...currentUserIds, userId],
      };
    },
    {} as Record<string, string[]>,
  );
}

export async function sendReceipt({
  event,
  matrixClient,
}: {
  matrixClient: MatrixClient;
  event: MatrixEvent;
}) {
  try {
    await matrixClient.sendReceipt(event, ReceiptType.Read);
    await matrixClient.sendReceipt(event, ReceiptType.FullyRead);
  } catch {}
}

export function shouldShowMessageTeaser({
  sender,
  loggedInUser,
  timestamp,
}: {
  timestamp: Date | null;
  sender: User | null;
  loggedInUser: string | undefined | null;
}) {
  if (!sender || !loggedInUser) {
    return false;
  }
  if (sender.userId === loggedInUser) {
    return false;
  }

  return (
    (timestamp?.getTime() ? timestamp?.getTime() + 5000 : 0) >=
    new Date().getTime()
  );
}

export async function setReadMarker({
  roomId,
  matrixClient,
}: {
  roomId?: string;
  matrixClient: MatrixClient;
}) {
  try {
    const room = matrixClient.getRoom(roomId);
    if (!room) {
      return;
    }

    const timelineSet = room.getLiveTimeline();
    const events = timelineSet.getEvents();
    const latestEvent = events.length > 0 && events[events.length - 1];
    if (!latestEvent || !latestEvent.event.event_id) {
      return;
    }
    await matrixClient.setRoomReadMarkersHttpRequest(
      roomId!,
      latestEvent.event.event_id,
      undefined,
      latestEvent.event.event_id,
    );
  } catch {}
}

export async function markAllMessagesAsRead({
  roomId,
  matrixClient,
}: {
  roomId?: string;
  matrixClient: MatrixClient;
}) {
  try {
    const room = matrixClient.getRoom(roomId);
    if (!room) {
      return;
    }

    // Use the most recent event in the timeline as a reference
    const timelineSet = room.getLiveTimeline();
    const events = timelineSet.getEvents();
    const latestEvent = events.length > 0 && events[events.length - 1];
    if (!latestEvent) {
      return;
    }

    // Sending read receipt and fully read marker for the latest event
    await matrixClient.sendReadReceipt(latestEvent, ReceiptType.Read);
    await matrixClient.sendReceipt(latestEvent, ReceiptType.FullyRead);
  } catch {}
}

export function validateChatUsername(chatUsername: unknown) {
  return (
    isString(chatUsername) &&
    !isEmpty(chatUsername) &&
    chatUsername.startsWith("@")
  );
}

export function extractHomeserverNameFromUserMatrixID(
  loggedInUserId: string | null,
) {
  return loggedInUserId?.split(":")[1] ?? "";
}

export function stringToColor(string?: string) {
  if (!string) return "primary";

  let sum = 0;

  for (let i = 0; i < string.length; i++) {
    sum += string.charCodeAt(i);
  }

  const group = sum % 5;

  switch (group) {
    case 0:
      return "warning";
    case 1:
      return "neutral";
    case 2:
      return "danger";
    case 3:
      return "success";
    default:
      return "primary";
  }
}

export function getInitials(name?: string) {
  if (!name) return;

  let splittedName = name.split(" ");
  if (splittedName.length < 2) {
    splittedName = name?.split("_");
  }

  if (splittedName.length < 2) {
    return name[0];
  }

  return `${splittedName[0]?.[0]}${splittedName[1]?.[0]}`;
}

export function getStatusColor(status: Presence | undefined) {
  switch (status) {
    case "online":
      return "success.400";
    case "offline":
      return "danger.plainColor";
    case "unavailable":
      return "danger.plainDisabledColor";
    default:
      return undefined;
  }
}

export async function getRoomLastMessage(
  matrixClient: MatrixClient,
  roomId: string,
): Promise<RoomLastMessage | undefined> {
  const timeline = matrixClient.getRoom(roomId)?.getLiveTimeline();
  if (timeline) {
    const events = timeline.getEvents();
    const lastEvent = last(events);
    if (lastEvent) {
      if (lastEvent.isEncrypted()) {
        await matrixClient.decryptEventIfNeeded(lastEvent);
      }
      const messageContent = lastEvent.getContent();

      if (!isMessageTypeWithBody(messageContent)) return;

      const sender = matrixClient.getUser(lastEvent.getSender() ?? "");
      const id =
        lastEvent.getId() ??
        format(addMilliseconds(new Date(), Math.random() * 1000), "T");

      return {
        sender,
        content: messageContent.body,
        timestamp: lastEvent.getDate(),
        id,
        roomId,
        mentions: messageContent["m.mentions"]?.user_ids,
      };
    }
  }
}

export function convertMessageTimestamp(timestamp?: Date | null) {
  if (!timestamp) return "";

  if (isToday(timestamp)) {
    return format(timestamp, "HH:MM");
  }

  return format(timestamp, "MM/dd");
}
