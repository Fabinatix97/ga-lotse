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
  DeviceMap,
  DeviceVerification,
  Direction,
  EventType,
  MatrixClient,
  MatrixEvent,
  ReceiptType,
  Room,
  RoomMember,
  SetPresence,
  User,
} from "matrix-js-sdk";
import { CryptoApi } from "matrix-js-sdk/lib/crypto-api";
import {
  filter,
  isEmpty,
  isStrictEqual,
  isString,
  keys,
  pickBy,
  pipe,
} from "remeda";

import {
  fetchBackupInfo,
  getCryptoApi,
} from "@/lib/businessModules/chat/matrix/crypto";
import { CommunicationType } from "@/lib/businessModules/chat/shared/enums";
import { logger } from "@/lib/businessModules/chat/shared/helpers";
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
  matrixClient: MatrixClient,
  room: Room,
) {
  return {
    room,
    communicationType: getRoomCommunicationType(matrixClient, room),
  };
}

export function getRoomCommunicationType(
  matrixClient: MatrixClient,
  room: Room,
) {
  const type = room.getDMInviter() ? "directMessage" : "room";

  if (type === "directMessage") {
    return CommunicationType.DirectMessage;
  }

  const allMembers = room.getMembers();

  if (type === "room" && allMembers.length <= 2) {
    const someDMInviter = allMembers.some((m) => m.getDMInviter());

    if (someDMInviter) {
      return CommunicationType.DirectMessage;
    } else {
      const otherMember = allMembers.find(
        (m) => !isStrictEqual(m.userId, room.myUserId),
      );
      const isRoomNameAndOtherMemberEqual = isStrictEqual(
        otherMember?.name,
        room.name,
      );
      if (isRoomNameAndOtherMemberEqual) {
        return CommunicationType.DirectMessage;
      }
    }
  }

  const directMessageRooms = getDMRooms(matrixClient, matrixClient.getUserId());
  if (directMessageRooms?.includes(room.roomId)) {
    return CommunicationType.DirectMessage;
  }

  return CommunicationType.PublicRoom;
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

export function getPresenceLabel(status: Presence | undefined) {
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

export async function waitUntilCryptoApiIsInitialized(
  matrixClient: MatrixClient,
) {
  logger.info("Waiting crypto initialization to complete...");
  const cryptoApi = await retryOperation(
    () => matrixClient.getCrypto(),
    (cryptoApi) => cryptoApi !== undefined,
    30,
    1000,
  );
  if (!cryptoApi) {
    throw new Error(
      "Rust Crypto initialization failed: Crypto module not available.",
    );
  }
  logger.info("Waiting crypto initialization to complete... - DONE");
}

export async function fetchBackupInfoWithRetry(matrixClient: MatrixClient) {
  logger.info("Fetching backup info...");
  const backupInfo = await retryAsyncOperation(
    async () => await fetchBackupInfo(matrixClient),
    (backupInfo) =>
      !backupInfo.hasDefaultKey && backupInfo.keyBackupInfo ? false : true,
    3,
    1000,
    true,
  );
  logger.info("Fetching backup info... - DONE");
  return backupInfo;
}

export async function retryOperation<T>(
  operation: () => T, // The function to retry
  stopCondition: (result: T) => boolean, // A condition to stop retrying
  maxRetries: number,
  retryAfterMillis: number,
  errorAfterLastRetry = false,
  errorMessage = `Operation failed after ${maxRetries} retries`,
): Promise<T | undefined> {
  let result: T | undefined = undefined;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      result = operation();
      if (stopCondition(result)) {
        return result;
      }
      logger.info("Retrying operation... ");
    } catch (error) {
      if (attempt === maxRetries - 1) {
        throw error; // If it's the last retry, throw the error
      }
      logger.error("Retrying on operation error", error);
    }

    // Wait before the next retry
    await new Promise((resolve) => setTimeout(resolve, retryAfterMillis));
  }

  if (errorAfterLastRetry) {
    throw new Error(errorMessage);
  } else {
    return result;
  }
}

export async function retryAsyncOperation<T>(
  operation: () => Promise<T>, // The async function to retry
  stopCondition: (result: T) => boolean, // A condition to stop retrying
  maxRetries: number,
  retryAfterMillis: number,
  errorAfterLastRetry = false,
  errorMessage = `Operation failed after ${maxRetries} retries`,
): Promise<T | undefined> {
  let result: T | undefined = undefined;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      result = await operation();
      if (stopCondition(result)) {
        return result;
      }
      logger.info("Retrying operation... ");
    } catch (error) {
      if (attempt === maxRetries - 1) {
        throw error; // If it's the last retry, throw the error
      }
      logger.error("Retrying on operation error", error);
    }

    // Wait before the next retry
    await new Promise((resolve) => setTimeout(resolve, retryAfterMillis));
  }

  if (errorAfterLastRetry) {
    throw new Error(errorMessage);
  } else {
    return result;
  }
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

export function getDirectMessageRoomMember(room: Room) {
  const members = room?.getMembers();

  if (members?.length) {
    return filter(
      members,
      (m) => !isStrictEqual(m.userId, room?.myUserId),
    )?.[0];
  }
}

export async function leaveRoom(matrixClient: MatrixClient, roomId?: string) {
  if (!roomId) return;
  try {
    await matrixClient.leave(roomId);
  } catch (error) {
    logger.error("Failed to leaveAndForgetRoom", error);
  }
}

export async function leaveAndForgetRoom(
  matrixClient: MatrixClient,
  roomId?: string,
) {
  if (!roomId) return;
  try {
    await matrixClient.leave(roomId);
    await matrixClient.forget(roomId);
  } catch (error) {
    logger.error("Failed to leaveAndForgetRoom", error);
  }
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
  paramNames.forEach((paramName) => {
    url.searchParams.delete(paramName);
  });
  window.history.replaceState(null, "", url.toString());
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

export function isMembershipChanged(mEvent: MatrixEvent): boolean {
  return (
    mEvent.getContent().membership !== mEvent.getPrevContent().membership ||
    mEvent.getContent().reason !== mEvent.getPrevContent().reason
  );
}

export async function setPresenceOffline(matrixClient: MatrixClient) {
  try {
    await matrixClient.setSyncPresence(SetPresence.Offline);
    await matrixClient.setPresence({ presence: SetPresence.Offline });
  } catch (error) {
    logger.error("Failed to set user presence to offline", error);
  }
}

export async function setPresenceOnline(matrixClient: MatrixClient) {
  try {
    await matrixClient.setSyncPresence(SetPresence.Online);
    await matrixClient.setPresence({ presence: SetPresence.Online });
  } catch (error) {
    logger.error("Failed to set user presence to online", error);
  }
}

export async function setAllUserDevicesAsVerified(
  matrixClient: MatrixClient,
  userIds: string[],
) {
  try {
    const cryptoApi: CryptoApi = getCryptoApi(matrixClient);
    const usersDeviceMap: DeviceMap = await cryptoApi.getUserDeviceInfo(
      userIds,
      true,
    );
    for (const allUserDevices of usersDeviceMap.values()) {
      if (allUserDevices.size === 0) {
        logger.error(
          "One of users does not have any encryption-capable devices",
        );
        return false;
      }
      for (const device of allUserDevices.values()) {
        if (device.verified !== DeviceVerification.Verified) {
          logger.warn(
            `Setting User's ${device.userId} device ${device.deviceId} as verified`,
          );
          await cryptoApi.setDeviceVerified(
            device.userId,
            device.deviceId,
            true,
          );
        }
      }
    }
    return true;
  } catch (e) {
    logger.error("Error setAllUsersAsVerified", e);
    return false;
  }
}
