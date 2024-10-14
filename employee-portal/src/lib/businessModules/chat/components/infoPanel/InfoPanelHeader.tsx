/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import CloseIcon from "@mui/icons-material/Close";
import { IconButton, Stack } from "@mui/joy";

import { ChatColumnHeaderWrapper } from "@/lib/businessModules/chat/components/ChatColumnHeaderWrapper";
import {
  ChatHeader,
  ChatHeaderProps,
} from "@/lib/businessModules/chat/components/ChatHeader";

interface InfoPanelHeaderProps {
  data: ChatHeaderProps;
  close: () => void;
}

export function InfoPanelHeader({ data, close }: InfoPanelHeaderProps) {
  return (
    <ChatColumnHeaderWrapper>
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: "center",
        }}
      >
        <ChatHeader {...data} variant="settings" />
        <IconButton
          variant="outlined"
          aria-label="close sidebar"
          onClick={close}
          sx={{
            borderColor: "primary.outlinedBorder",
          }}
        >
          <CloseIcon color="primary" />
        </IconButton>
      </Stack>
    </ChatColumnHeaderWrapper>
  );
}
