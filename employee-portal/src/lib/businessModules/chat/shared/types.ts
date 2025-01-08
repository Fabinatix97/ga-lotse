/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { AlertProps } from "@eshg/lib-portal/components/Alert";
import { BaseModalProps } from "@eshg/lib-portal/components/BaseModal";
import { FormikErrors } from "formik";
import {
  IPresenceOpts,
  MatrixEvent,
  Room,
  RoomMember,
  User,
} from "matrix-js-sdk";
import { isEmpty, isObjectType, isString } from "remeda";

import {
  CommunicationType,
  Membership,
  MessageTypeEnum,
} from "@/lib/businessModules/chat/shared/enums";

export interface RoomData extends RoomWithCommunicationType {
  latestMessage?: Message;
}

export interface RoomWithCommunicationType {
  room: Room;
  communicationType: CommunicationType;
}

export interface Message {
  id: string;
  content: string;
  timestamp: Date | null;
  sender: User | null;
  roomId: string;
  mentions?: string[];
  // readReceipts?: ReadConfirmationsPerUser;
  messageType: MessageTypeEnum;
  sent: boolean;
  removed: boolean;
  decrypted?: boolean;
  isRead?: boolean;
}

export function isChatMessageType(data: unknown): data is Message {
  if (!isObjectType(data)) return false;
  return (
    "messageType" in data && data.messageType === MessageTypeEnum.ChatMessage
  );
}
export interface RoomEventDetails {
  event: MatrixEvent;
  room: Room;
  toStartOfTimeline?: boolean;
  removed?: boolean;
  isSent?: boolean;
}

export interface CreateRoomOptions {
  name?: string;
  invite: string[];
}

export type Presence = IPresenceOpts["presence"] | "deactivated";
export type UsersPresence = Record<string, Presence>;

export type ReadConfirmationsPerUser = Record<
  string,
  { eventId: string; timestamp: number }
>;
export type ReadConfirmationsPerRoom = Record<string, ReadConfirmationsPerUser>;
export interface ReceiptData {
  ts: number;
}
export function isReceiptType(data: unknown): data is ReceiptData {
  if (!isObjectType(data)) return false;
  return "ts" in data && typeof data.ts === "number";
}
interface MessageType {
  body: string;
  format: string;
  formatted_body: string;
  "m.mentions": { user_ids: string[] };
}
export function isMessageType(
  messageContent: unknown,
): messageContent is MessageType {
  return isObjectType(messageContent) && "body" in messageContent;
}

export function isMessageTypeWithBody(
  messageContent: unknown,
): messageContent is MessageType {
  return (
    isMessageType(messageContent) &&
    isString(messageContent.body) &&
    !isEmpty(messageContent.body)
  );
}

export interface ApiUser {
  user_id: string;
  display_name?: string | undefined;
  avatar_url?: string | undefined;
}

export interface ChatBaseModal<T>
  extends Pick<BaseModalProps, "open" | "onClose"> {
  onSubmit: (data: T) => Promise<void>;
  validateForm: (values: T) => FormikErrors<T>;
  alertProps?: AlertProps;
}

export interface ChatUserSettings {
  accountDeactivated?: boolean;
  chatConsentAsked?: boolean;
  chatUsageEnabled: boolean;
  sharePresence: boolean;
  showReadConfirmation: boolean;
  showTypingNotification: boolean;
}

export interface IStoredCredentials {
  accessToken: string;
  userId: string;
  deviceId: string;
  pickleKey: string | null;
}

export interface RoomLastMessage {
  sender: User | null;
  content: string;
  timestamp: Date | null;
  id: string;
  roomId: string;
  mentions: string[];
}

export interface ChatRoomMember {
  member: RoomMember;
  isRoomCreator: boolean;
}

export interface ChatSystemMessage {
  type: string;
  messageType: MessageTypeEnum;
  userId?: string;
  userName?: string;
  membership?: Membership;
  left?: boolean;
  roomName?: string;
  timestamp: Date | null;
  admin?: string[];
  creator?: string;
  id: string;
  avatarUrl?: string;
  sender?: string;
}

export function isChatMessage(data: unknown): data is Message {
  if (!isObjectType(data)) return false;
  return (
    "messageType" in data && data.messageType === MessageTypeEnum.ChatMessage
  );
}

export function isSystemMessage(data: unknown): data is ChatSystemMessage {
  if (!isObjectType(data)) return false;
  return (
    "messageType" in data && data.messageType === MessageTypeEnum.SystemMessage
  );
}

export interface MentionedMember {
  name: string;
  userId: string;
}

export interface UserFromDirectory {
  user_id: string;
  display_name?: string;
  avatar_url?: string;
}

export interface UserDirectoryResponse {
  results: UserFromDirectory[];
  limited: boolean;
}

export interface UserToInvite extends UserFromDirectory {
  department?: string;
}
