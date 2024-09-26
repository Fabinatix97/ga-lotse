/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import CloseIcon from "@mui/icons-material/Close";
import { IconButton, Stack } from "@mui/joy";

import { ChatColumnHeaderWrapper } from "@/lib/businessModules/chat/components/ChatColumnHeaderWrapper";
import { ChatHeader } from "@/lib/businessModules/chat/components/ChatHeader";
import { SettingsPanelProps } from "@/lib/businessModules/chat/components/settingsPanel/SettingsPanel";
import { RoomInfo } from "@/lib/businessModules/chat/shared/hooks/useRoomInfo";

interface SettingsPanelHeaderProps extends SettingsPanelProps {
  roomInfo: RoomInfo;
}

export function SettingsPanelHeader({
  toggleChatSettingsView,
  roomInfo,
}: SettingsPanelHeaderProps) {
  return (
    <ChatColumnHeaderWrapper>
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: "center",
        }}
      >
        <ChatHeader {...roomInfo} variant="settings" />
        <IconButton
          variant="outlined"
          aria-label="close sidebar"
          onClick={toggleChatSettingsView}
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
