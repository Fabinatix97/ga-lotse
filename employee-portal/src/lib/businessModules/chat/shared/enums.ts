/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export enum ClientState {
  RegisterMatrixUser = "REGISTER_MATRIX_USER",
  CreateMatrixClient = "CREATE_MATRIX_CLIENT",
  StartMatrixClient = "START_MATRIX_CLIENT",
  WaitUntilClientPrepared = "WAIT_UNTIL_CLIENT_PREPARED",
  InitEncryption = "INIT_ENCRYPTION",
  CreateKeyBackup = "CREATE_KEY_BACKUP",
  RestoreKeyBackup = "RESTORE_KEY_BACKUP",
  Ready = "READY",
  Restart = "REFRESH_CHAT",
  HardReset = "HARD_RESET",
  FactoryReset = "FACTORY_RESET",
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

export enum ChatTabTakeoverView {
  LockClaimedByAnotherTab = "LOCK_CLAIMED_BY_ANOTHER_TAB",
  ClaimTabLock = "CLAIM_TAB_LOCK",
  ActiveChatTab = "ACTIVE_CHAT_TAB",
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
  Remove = "remove",
}

export enum InfoPanelView {
  RoomInfo = "ROOM_INFO",
  UserInfo = "USER_INFO",
  AddChatMember = "ADD_CHAT_MEMBER",
  AssignAdminLevel = "ASSIGN_ADMIN_LEVEL",
  RenameGroupChat = "RENAME_GROUP_CHAT",
  AdminSettings = "ADMIN_SETTINGS",
}
