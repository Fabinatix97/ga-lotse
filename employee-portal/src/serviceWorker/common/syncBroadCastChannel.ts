/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export function createSyncBroadCastChannelEndpoint() {
  return new BroadcastChannel("inspection-request-sync");
}

export const REPLAY_STARTED = "replace-started";
export const REPLAY_FAILED = "replay-failed";
export const REPLAY_DONE = "replay-done";
export const DELETE_FILE_FAILED_WITH_404 = "delete-file-failed-with-404";
