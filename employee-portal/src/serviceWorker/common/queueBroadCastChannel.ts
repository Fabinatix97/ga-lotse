/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export function createQueueBroadCastChannelEndpoint() {
  return new BroadcastChannel("inspection-request-queue");
}

export const CLEAR = "clear";
export const CLEAR_DONE = "clear-done";
export const CLEAR_FAILED = "clear-failed";
export const SYNC = "sync";

export const GET_QUEUE = "get-queue";
export const GET_QUEUE_EMPTY = "get-queue-empty";
export const GET_QUEUE_SOME = "get-queue-some";
export const GET_QUEUE_FAILED = "get-queue-failed";
