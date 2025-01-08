/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  format,
  isSameDay,
  isSameWeek,
  isSameYear,
  isThisWeek,
  isThisYear,
  isToday,
  isYesterday,
  startOfDay,
} from "date-fns";
import { de } from "date-fns/locale";
import {
  Direction,
  EventType,
  MatrixClient,
  MatrixEvent,
  ReceiptType,
  Room,
  RoomMember,
  User,
} from "matrix-js-sdk";
import {
  forEach,
  isEmpty,
  isNonNullish,
  isStrictEqual,
  isString,
  keys,
  pickBy,
  pipe,
} from "remeda";

import { CommunicationType } from "@/lib/businessModules/chat/shared/enums";
import {
  ChatSystemMessage,
  Message,
  Presence,
  RoomWithCommunicationType,
  UserDirectoryResponse,
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
  return {
    room,
    communicationType: getRoomCommunicationType(undefined, undefined, room),
  };
}

export function getRoomCommunicationType(
  matrixClient?: MatrixClient,
  roomId?: string,
  room?: Room,
) {
  let currentRoom: Room | null = room ?? null;
  let communicationType = CommunicationType.PublicRoom;

  if (!room && matrixClient) {
    currentRoom = matrixClient.getRoom(roomId);
  }

  if (currentRoom) {
    const type = currentRoom.getDMInviter() ? "directMessage" : "room";

    if (type === "directMessage") {
      communicationType = CommunicationType.DirectMessage;
    }

    const allMembers = currentRoom.getMembers();

    if (type === "room" && allMembers.length <= 2) {
      const someDMInviter = allMembers.some((m) => m.getDMInviter());

      if (someDMInviter) {
        communicationType = CommunicationType.DirectMessage;
      } else {
        const otherMember = allMembers.find(
          (m) => !isStrictEqual(m.userId, currentRoom.myUserId),
        );
        const isRoomNameAndOtherMemberEqual = isStrictEqual(
          otherMember?.name,
          currentRoom.name,
        );
        if (isRoomNameAndOtherMemberEqual) {
          communicationType = CommunicationType.DirectMessage;
        }
      }
    }
  }
  if (matrixClient && roomId) {
    const directMessageRooms = getDMRooms(
      matrixClient,
      matrixClient.getUserId(),
    );
    if (directMessageRooms?.includes(roomId)) {
      communicationType = CommunicationType.DirectMessage;
    }
  }

  return communicationType;
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
    const latestEvent = room.getLastLiveEvent();
    const eventId = latestEvent?.getId();
    if (!eventId) {
      return;
    }
    await matrixClient.setRoomReadMarkersHttpRequest(
      roomId!,
      eventId,
      undefined,
      eventId,
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

    const latestEvent = room.getLastLiveEvent();
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
      return "warning.400";
    case "deactivated":
      return "danger.plainDisabledColor";
    default:
      return "danger.plainColor";
  }
}

export function getPresenseLabel(status: Presence | undefined) {
  switch (status) {
    case "online":
      return "Online";
    case "offline":
      return "Inaktiv";
    case "unavailable":
      return "Unischtbar";
    default:
      return "";
  }
}

export function formatChatDate(timestamp?: Date | null) {
  if (!timestamp) return "";

  if (isToday(timestamp)) {
    return format(timestamp, "HH:mm");
  }

  return formatDateForChat(timestamp);
}

export function getDayLabel(date: Date): string {
  const localDate = startOfDay(date);
  if (isToday(localDate)) {
    return "Heute";
  }
  if (isYesterday(localDate)) {
    return "Gestern";
  }
  if (isThisWeek(localDate, { weekStartsOn: 1 })) {
    return format(localDate, "EEEE", { locale: de });
  }
  if (isThisYear(localDate)) {
    return format(localDate, "MMMM d");
  }
  return format(localDate, "MMMM d, yyyy");
}

export function formatDateForChat(date: Date): string {
  const currentTime = new Date();
  if (isSameDay(currentTime, date)) {
    return format(date, "HH:mm");
  }
  if (isYesterday(date)) {
    return `Gestern ${format(date, "HH:mm", { locale: de })}`;
  }
  if (isSameWeek(currentTime, date, { weekStartsOn: 1 })) {
    return format(date, "EEEE HH:mm", { locale: de });
  }
  if (isSameYear(currentTime, date)) {
    return format(date, "dd.MM HH:mm");
  }
  return format(date, "dd.MM.YY HH:mm");
}

export function isGroupRoom(communicationType?: CommunicationType) {
  return communicationType === CommunicationType.PublicRoom;
}

export function isDMRoom(communicationType?: CommunicationType) {
  return communicationType === CommunicationType.DirectMessage;
}

export function delayed<T>(fn: () => T, delay: number): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(fn());
    }, delay);
  });
}

function getImageUrl(matrixClient: MatrixClient, url: string | null) {
  if (!url) return null;

  const isMxc = new URL(url).protocol === "mxc:";
  return isMxc ? matrixClient.mxcUrlToHttp(url) : url;
}

export function getRoomAvatarUrl(
  matrixClient: MatrixClient,
  room: Room | null,
) {
  if (!room) return null;
  const homeserverUrl = matrixClient.getHomeserverUrl();
  const roomAvatarUrl = room.getAvatarUrl(homeserverUrl, 40, 40, "scale", true);

  return getImageUrl(matrixClient, roomAvatarUrl);
}

export function getMemberAvatarUrl(
  matrixClient: MatrixClient,
  member?: RoomMember,
) {
  if (!member) return null;
  const homeserverUrl = matrixClient.getHomeserverUrl();
  const memberAvatarUrl = member.getAvatarUrl(
    homeserverUrl,
    40,
    40,
    "scale",
    true,
    false,
  );

  const imageUrl = getImageUrl(matrixClient, memberAvatarUrl);
  return imageUrl;
}

export async function leaveRoom(matrixClient: MatrixClient, roomId?: string) {
  if (!roomId) return;
  try {
    await matrixClient.leave(roomId);
  } catch {}
}

export function allMessagesRead(
  matrixClient: MatrixClient,
  newMessages: Message[],
) {
  newMessages.forEach((message) => {
    void markAllMessagesAsRead({
      roomId: message.roomId,
      matrixClient: matrixClient,
    });
  });
}

export async function reassignAdminRole(
  matrixClient: MatrixClient,
  room: Room,
  users: Record<string, number>,
) {
  const powerLevels = room
    ?.getLiveTimeline()
    .getState(Direction.Forward)
    ?.getStateEvents(EventType.RoomPowerLevels)?.[0]?.event.content;

  await matrixClient.sendStateEvent(room.roomId, EventType.RoomPowerLevels, {
    ...powerLevels,
    users,
  });
}

export function sortMessages<T extends ChatSystemMessage | Message>(
  messages: T[],
): T[] {
  return messages.sort((a, b) =>
    !a?.timestamp
      ? 1
      : !b?.timestamp
        ? -1
        : new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );
}

export function findLatestMessage(room: Room) {
  const timelineSet = room.getLiveTimeline();
  const events = timelineSet.getEvents();
  if (events.length <= 0) return;
  return events.findLast((event) => {
    const eventType = event.getType();
    return eventType === "m.room.message" || eventType === "m.room.encrypted";
  });
}

export function removeAtFromUsernames(str: string) {
  return str.replace(/\B@\w+/g, (match) => match.slice(1));
}

export async function getChatUserDirectory(
  matrixClient: MatrixClient,
): Promise<UserDirectoryResponse> {
  return matrixClient.searchUserDirectory({
    term: extractHomeserverNameFromUserMatrixID(matrixClient.getUserId()),
  });
}

export async function getChatUser(
  matrixClient: MatrixClient,
  userId: string,
): Promise<UserDirectoryResponse> {
  return matrixClient.searchUserDirectory({
    term: userId,
  });
}

export function getReadReceipts(
  event: MatrixEvent,
  room: Room,
  loggedInUserId?: string | null,
) {
  if (!loggedInUserId) return;
  const readReceipts = room.getReceiptsForEvent(event);
  const isRead = readReceipts?.find(({ userId }) => {
    if (userId !== loggedInUserId) return true;
  });
  return !!isRead;
}

export function clearSearchParams(...paramNames: string[]) {
  const url = new URL(window.location.href);
  forEach(paramNames, (paramName) => {
    const searchParam = url.searchParams.get(paramName);
    if (isNonNullish(searchParam)) {
      url.searchParams.delete(paramName);
    }
  });
  window.history.replaceState(null, "", url.href);
}

export function getRoomAdmins(room: Room | null) {
  const eventContent = room
    ?.getLiveTimeline()
    .getState(Direction.Forward)
    ?.getStateEvents(EventType.RoomPowerLevels)[0]
    ?.getContent<{
      users?: Record<string, number>;
    }>();

  return eventContent?.users
    ? pipe(
        eventContent.users,
        pickBy((value) => value === 100),
        keys(),
      )
    : [];
}

export function checkIfRoomIsInactive(
  loggedInUserId: string | null,
  room?: RoomWithCommunicationType,
) {
  if (!room) return false;
  if (room.communicationType === CommunicationType.PublicRoom) return false;
  const allMembers = room.room.getMembers();
  const roomMembers = allMembers.filter(
    (member) => member.userId !== loggedInUserId,
  );

  if (roomMembers.length > 2) {
    return false;
  } else {
    const oneLeft = roomMembers.find((member) => member.membership === "leave");
    if (oneLeft) return true;
  }

  return false;
}

export function getRoomCreator(room: Room | null) {
  const eventContent = room
    ?.getLiveTimeline()
    .getState(Direction.Forward)
    ?.getStateEvents(EventType.RoomCreate)[0]
    ?.getContent<{
      creator: string;
    }>();

  return eventContent?.creator;
}

export function getDMRooms(client: MatrixClient, userId: string | null) {
  if (!userId) return;
  const mDirectEvent = client.getAccountData(EventType.Direct);
  const currentContent = mDirectEvent?.getContent() ?? {};
  const dmRoomMap = new Map(Object.entries(currentContent)) as Map<
    string,
    string[]
  >;
  return dmRoomMap.get(userId) ?? [];
}

export async function setDMRoom(
  client: MatrixClient,
  roomId: string,
  userId: string | null,
): Promise<void> {
  const mDirectEvent = client.getAccountData(EventType.Direct);
  const currentContent = mDirectEvent?.getContent() ?? {};

  const dmRoomMap = new Map(Object.entries(currentContent)) as Map<
    string,
    string[]
  >;
  let modified = false;

  for (const thisUserId of dmRoomMap.keys()) {
    const roomList = dmRoomMap.get(thisUserId) ?? [];

    if (thisUserId != userId) {
      const indexOfRoom = roomList.indexOf(roomId);
      if (indexOfRoom > -1) {
        roomList.splice(indexOfRoom, 1);
        modified = true;
      }
    }
  }

  if (userId) {
    const roomList = dmRoomMap.get(userId) ?? [];
    if (!roomList.includes(roomId)) {
      roomList.push(roomId);
      modified = true;
    }
    dmRoomMap.set(userId, roomList);
  }

  if (!modified) return;

  await client.setAccountData(EventType.Direct, Object.fromEntries(dmRoomMap));
}
