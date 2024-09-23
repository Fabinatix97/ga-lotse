/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Chip } from "@mui/joy";

export function ChatMessageCounter() {
  // Using dummy fixed chatContext until ChatContext is not extracted from ChatProvider to be accessible from the root level
  const chatContext = {
    newMessageCount: 0,
  };

  if (chatContext.newMessageCount > 0) {
    return <Chip color="primary">{chatContext.newMessageCount}</Chip>;
  }
  return null;
}
