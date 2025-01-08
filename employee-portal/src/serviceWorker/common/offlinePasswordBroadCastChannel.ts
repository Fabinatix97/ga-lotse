/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isString } from "remeda";

export function createOfflinePasswordBroadCastChannelEndpoint() {
  return new BroadcastChannel("offline-password");
}

export const REGISTER_CLIENT = "register-client";
export const GET_EXISTING_PASSWORD = "get-existing-password";
export const GET_PASSWORD = "get-password";
export const PASSWORD_ACCEPTED = "password-accepted";
export const GET_PASSWORD_ABORTED = "get-password-aborted";

enum MessageType {
  Password = "password",
  PreemptivePassword = "preemptive-password",
}

export interface PasswordMessage {
  type: MessageType.Password;
  password: string;
}

export function createPasswordMessage(password: string): PasswordMessage {
  return {
    type: MessageType.Password,
    password,
  };
}

export function isPasswordMessage(
  message: unknown,
): message is PasswordMessage {
  return (
    typeof message === "object" &&
    message !== null &&
    "type" in message &&
    message.type === MessageType.Password &&
    "password" in message &&
    isString(message.password)
  );
}

export interface PreemptivePasswordMessage {
  type: MessageType.PreemptivePassword;
  password: string;
}

export function createPreemptivePasswordMessage(
  password: string,
): PreemptivePasswordMessage {
  return {
    type: MessageType.PreemptivePassword,
    password,
  };
}

export function isPreemptivePasswordMessage(
  message: unknown,
): message is PreemptivePasswordMessage {
  return (
    typeof message === "object" &&
    message !== null &&
    "type" in message &&
    message.type === MessageType.PreemptivePassword &&
    "password" in message &&
    isString(message.password)
  );
}
