/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export enum ClientState {
  Idle = "Idle",
  Authorized = "AUTHORIZED",
  ClientCreated = "CLIENT_CREATED",
  ReadyForEncryption = "READY_FOR_ENCRYPTION",
  CreateBackupKey = "CREATE_BACKUP_KEY",
  RestoreBackupKey = "RESTORE_BACKUP_KEY",
  BackupSetupComplete = "BACKUP_SETUP_COMPLETE",
  Prepared = "PREPARED",
  Restart = "RESTART",
  Error = "ERROR",
}

export enum CommunicationType {
  DirectMessage = "DIRECT_MESSAGE",
  PublicRoom = "PUBLIC_ROOM",
}

export enum ChatPanelView {
  NoChatSelected = "NO_CHAT_SELECTED",
  NewDirectChat = "NEW_DIRECT_CHAT",
  NewGroupChat = "NEW_GROUP_CHAT",
  ChatMessages = "CHAT_MESSAGES",
}

export enum MessageTypeEnum {
  ChatMessage = "CHAT_MESSAGE",
  SystemMessage = "SYSTEM_MESSAGE",
}

export enum Membership {
  Join = "join",
  Leave = "leave",
  Invite = "invite",
  SelfLeave = "self_leave",
}

export enum InfoPanelView {
  RoomInfo = "ROOM_INFO",
  UserInfo = "USER_INFO",
}
