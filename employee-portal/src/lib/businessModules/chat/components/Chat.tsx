/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { LoadingIndicator } from "@eshg/lib-portal/components/LoadingIndicator";
import { Box, Stack, useTheme } from "@mui/joy";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { NewChatIllustration } from "@/lib/businessModules/chat/assets/NewChatIllustration";
import { ChatColumnHeaderWrapper } from "@/lib/businessModules/chat/components/ChatColumnHeaderWrapper";
import { ChatPanel } from "@/lib/businessModules/chat/components/chatPanel/ChatPanel";
import { RoomsPanel } from "@/lib/businessModules/chat/components/roomsPanel/RoomsPanel";
import { BackupSetupView } from "@/lib/businessModules/chat/components/secureBackup/BackupSetupView";
import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { ClientState } from "@/lib/businessModules/chat/shared/enums";
import { useCreateNewChat } from "@/lib/businessModules/chat/shared/hooks/useCreateNewChat";

export function Chat() {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId");
  const userIdForChatStart = searchParams.get("userId");

  const theme = useTheme();
  const { clientState } = useChatClientContext();
  const { createNewDirectMessage } = useCreateNewChat();
  const [openChatSettings, setOpenChatSettings] = useState(false);

  function toggleChatSettingsView() {
    setOpenChatSettings((prev) => !prev);
  }

  // If userId is passed in the search params, it means that the application
  // should either create a new chat with the user identified by that ID,
  // or open an existing chat with that user if one exists.
  useEffect(() => {
    if (!userIdForChatStart || clientState !== ClientState.Prepared) {
      return;
    }
    void createNewDirectMessage({ invite: [userIdForChatStart] });
  }, [clientState, userIdForChatStart, createNewDirectMessage]);

  if (clientState === ClientState.Error) {
    throw new Error("Chat error");
  }

  if (
    clientState === ClientState.CreateBackupKey ||
    clientState === ClientState.RestoreBackupKey
  ) {
    return <BackupSetupView />;
  }

  if (clientState !== ClientState.Prepared) {
    return <LoadingIndicator text="Seite wird geladen…" fullHeight />;
  }

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      border={1}
      sx={{
        height: "100%",
        backgroundColor: theme.palette.background.surface,
        borderColor: theme.palette.neutral.outlinedBorder,
        borderRadius: theme.radius.lg,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          maxWidth: "27rem",
          height: "100%",
        }}
      >
        <RoomsPanel />
      </Box>
      <Box
        sx={{
          flex: 2,
          borderLeft: "1px solid",
          borderColor: theme.palette.neutral.outlinedBorder,
          overflow: "hidden",
          minWidth: "50%",
        }}
      >
        {roomId ? (
          <ChatPanel
            roomId={roomId}
            isOpenChatSettings={openChatSettings}
            toggleChatSettingsView={toggleChatSettingsView}
          />
        ) : (
          <NewChatIllustration sx={{ width: "400px", height: "auto" }} />
        )}
      </Box>
      {openChatSettings && (
        <Box
          sx={{
            flex: 1,
            maxWidth: "22rem",
            borderLeft: "1px solid",
            borderColor: theme.palette.neutral.outlinedBorder,
          }}
        >
          <ChatColumnHeaderWrapper>Chat details</ChatColumnHeaderWrapper>
        </Box>
      )}
    </Stack>
  );
}
