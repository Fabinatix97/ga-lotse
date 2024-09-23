/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import SearchIcon from "@mui/icons-material/Search";
import { IconButton, Input, Stack } from "@mui/joy";

import { ChatColumnHeaderWrapper } from "@/lib/businessModules/chat/components/ChatColumnHeaderWrapper";

export function RoomsPanelHeader() {
  return (
    <ChatColumnHeaderWrapper>
      <Stack direction="row" spacing={2}>
        <Input startDecorator={<SearchIcon />} />
        <IconButton
          aria-label="Open new chat window"
          variant="solid"
          color="primary"
        >
          <OpenInNewIcon size="sm" />
        </IconButton>
      </Stack>
    </ChatColumnHeaderWrapper>
  );
}
