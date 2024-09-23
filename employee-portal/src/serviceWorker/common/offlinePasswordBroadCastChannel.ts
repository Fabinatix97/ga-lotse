/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
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
export const GET_PASSWORD_FAILED = "get-password-failed";

export interface PasswordMessage {
  type: "password";
  password: string;
  salt: ArrayBufferLike;
}

export function createPasswordMessage(
  password: string,
  salt: ArrayBufferLike,
): PasswordMessage {
  return {
    type: "password",
    password,
    salt,
  };
}

export function isPasswordMessage(
  message: unknown,
): message is PasswordMessage {
  return (
    typeof message === "object" &&
    message !== null &&
    "type" in message &&
    message.type === "password" &&
    "password" in message &&
    isString(message.password) &&
    "salt" in message &&
    isArrayBufferLike(message.salt)
  );
}

function isArrayBufferLike(value: unknown): value is ArrayBufferLike {
  return value instanceof ArrayBuffer || ArrayBuffer.isView(value);
}
