/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

const basePath = "/chat";

export const routes = {
  index: basePath,
  userRoom: (userId: string) =>
    `${basePath}?userId=${encodeURIComponent(userId)}`,
  chatRoom: (roomId: string) =>
    `${basePath}?roomId=${encodeURIComponent(roomId)}`,
} as const;
