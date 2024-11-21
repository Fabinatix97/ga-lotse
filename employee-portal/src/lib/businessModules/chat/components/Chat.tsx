/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { LoadingIndicator } from "@eshg/lib-portal/components/LoadingIndicator";
import { Stack, useTheme } from "@mui/joy";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { ChatPanel } from "@/lib/businessModules/chat/components/chatPanel/ChatPanel";
import { InfoPanel } from "@/lib/businessModules/chat/components/infoPanel/InfoPanel";
import { RoomsPanel } from "@/lib/businessModules/chat/components/roomsPanel/RoomsPanel";
import { BackupSetupView } from "@/lib/businessModules/chat/components/secureBackup/BackupSetupView";
import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { useInfoPanelContext } from "@/lib/businessModules/chat/shared/InfoPanelProvider";
import { chatSearchParamNames } from "@/lib/businessModules/chat/shared/constants";
import {
  ChatPanelView,
  ClientState,
} from "@/lib/businessModules/chat/shared/enums";
import { useCreateNewChat } from "@/lib/businessModules/chat/shared/hooks/useCreateNewChat";
import {
  clearSearchParams,
  getChatUser,
} from "@/lib/businessModules/chat/shared/utils";

export function Chat() {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId");
  const userIdForChatStart = searchParams.get("userId");
  const lastUserIdForChatStart = useRef("");
  const theme = useTheme();
  const { clientState, matrixClient } = useChatClientContext();
  const { infoPanelState } = useInfoPanelContext();
  const { createNewChat } = useCreateNewChat();
  const [chatPanelView, setChatPanelView] = useState<ChatPanelView>(
    roomId ? ChatPanelView.ChatMessages : ChatPanelView.NoChatSelected,
  );

  function changeChatPanelView(newView: ChatPanelView) {
    setChatPanelView(newView);
  }

  // If userId is passed in the search params, it means that the application
  // should either create a new chat with the user identified by that ID,
  // or open an existing chat with that user if one exists.
  useEffect(() => {
    async function createDMChat(dmUserId: string) {
      const user = await getChatUser(matrixClient, dmUserId);
      const isUserExist = user.results.length;

      if (!isUserExist) {
        clearSearchParams(chatSearchParamNames.userId);
        return;
      }
      void createNewChat({ invite: [dmUserId], is_direct: true });
    }

    if (
      userIdForChatStart &&
      clientState === ClientState.Prepared &&
      lastUserIdForChatStart.current !== userIdForChatStart
    ) {
      void createDMChat(userIdForChatStart);
      lastUserIdForChatStart.current = userIdForChatStart;
    }
  }, [clientState, userIdForChatStart, matrixClient, createNewChat]);

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
      border={1}
      sx={{
        height: "100%",
        justifyContent: "space-between",
        backgroundColor: theme.palette.background.body,
        borderColor: theme.palette.neutral.outlinedBorder,
        borderRadius: theme.radius.lg,
        overflow: "hidden",
      }}
    >
      <Stack
        sx={{
          flex: 1,
          minWidth: "12.5rem",
          maxWidth: "27rem",
          height: "100%",
          overflow: "auto",
        }}
      >
        <RoomsPanel setChatPanelView={changeChatPanelView} />
      </Stack>
      <Stack
        sx={{
          flex: 1.5,
          minWidth: 0,
          borderLeft: "1px solid",
          borderColor: theme.palette.neutral.outlinedBorder,
          overflow: "auto",
        }}
      >
        <ChatPanel
          roomId={roomId}
          chatPanelView={chatPanelView}
          setChatPanelView={changeChatPanelView}
        />
      </Stack>
      {infoPanelState.isOpen && (
        <Stack
          sx={{
            flex: 1,
            minWidth: 0,
            maxWidth: "22rem",
            borderLeft: "1px solid",
            borderColor: "neutral.outlinedBorder",
          }}
        >
          <InfoPanel />
        </Stack>
      )}
    </Stack>
  );
}
