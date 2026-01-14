/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Button, Snackbar, Stack, Typography, useTheme } from "@mui/joy";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { LoadingIndicator } from "@eshg/lib-portal";

import { TabLockClaim } from "@/lib/businessModules/chat/components/TabLockClaim";
import { TabLockTakenByAnotherTab } from "@/lib/businessModules/chat/components/TabLockTakenByAnotherTab";
import { ChatPanel } from "@/lib/businessModules/chat/components/chatPanel/ChatPanel";
import { InfoPanel } from "@/lib/businessModules/chat/components/infoPanel/InfoPanel";
import { RoomsPanel } from "@/lib/businessModules/chat/components/roomsPanel/RoomsPanel";
import { BackupSetupView } from "@/lib/businessModules/chat/components/secureBackup/BackupSetupView";
import { claimTabLock } from "@/lib/businessModules/chat/matrix/chatTabLock";
import { useChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { useInfoPanelContext } from "@/lib/businessModules/chat/shared/InfoPanelProvider";
import { chatSearchParamNames } from "@/lib/businessModules/chat/shared/constants";
import {
  ChatPanelView,
  ChatTabTakeoverView,
  ClientState,
  InfoPanelView,
  MobileView,
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
  const {
    clientState,
    matrixClient,
    isClientPrepared,
    currentSessionView,
    setCurrentSessionView,
    refreshChatActivity,
    chatActivityCountdown,
  } = useChatClientContext();
  useChatClientContext();
  const { infoPanelState } = useInfoPanelContext();
  const { createNewChat } = useCreateNewChat();
  const [chatPanelView, setChatPanelView] = useState<ChatPanelView>(
    roomId ? ChatPanelView.ChatMessages : ChatPanelView.NoChatSelected,
  );
  const [visibleOnMobile, setVisibleOnMobile] = useState<MobileView>(
    MobileView.RoomList,
  );

  function changeChatPanelView(newView: ChatPanelView) {
    setChatPanelView(newView);
  }

  const onLockTakenByAnotherTab = useCallback(async () => {
    await new Promise<void>((resolve) => {
      setCurrentSessionView(ChatTabTakeoverView.LockClaimedByAnotherTab);
      resolve();
    });
    matrixClient.stopClient();
  }, [matrixClient, setCurrentSessionView]);

  const onConfirmClaimTabLock = useCallback(async () => {
    setCurrentSessionView(ChatTabTakeoverView.ActiveChatTab);
    await claimTabLock(() => onLockTakenByAnotherTab());
  }, [onLockTakenByAnotherTab, setCurrentSessionView]);

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
      isClientPrepared &&
      lastUserIdForChatStart.current !== userIdForChatStart
    ) {
      void createDMChat(userIdForChatStart);
      lastUserIdForChatStart.current = userIdForChatStart;
    }
  }, [userIdForChatStart, matrixClient, createNewChat, isClientPrepared]);

  if (currentSessionView === ChatTabTakeoverView.ClaimTabLock) {
    return <TabLockClaim onConfirm={onConfirmClaimTabLock} />;
  }
  if (currentSessionView === ChatTabTakeoverView.LockClaimedByAnotherTab) {
    return <TabLockTakenByAnotherTab />;
  }
  if (
    clientState === ClientState.CreateKeyBackup ||
    clientState === ClientState.RestoreKeyBackup
  ) {
    return <BackupSetupView />;
  }

  if (!isClientPrepared) {
    return <LoadingIndicator text="Seite wird geladen…" fullHeight />;
  }

  return (
    <>
      <Snackbar
        open={!!chatActivityCountdown}
        animationDuration={300}
        variant="outlined"
        color="primary"
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        invertedColors
      >
        <Stack padding={1} minWidth={{ sm: "42rem" }}>
          <Typography level="body-lg">
            Aufgrund von Inaktivität wird Ihre Chat-Sitzung in{" "}
            <strong>{chatActivityCountdown ?? 0}</strong> Sekunden beendet.
          </Typography>
          <Button
            sx={{ mt: 2, width: "auto" }}
            fullWidth={false}
            size="lg"
            variant="outlined"
            onClick={refreshChatActivity}
          >
            Sitzung fortsetzen
          </Button>
        </Stack>
      </Snackbar>
      {clientState === ClientState.Idle ? (
        <Stack height="100%" justifyContent="center" alignItems="center">
          <Typography level="body-lg" variant="soft" data-testid="title">
            Chat ist offline
          </Typography>
          <Button
            sx={{ mt: 2, width: "auto" }}
            fullWidth={false}
            size="lg"
            variant="outlined"
            onClick={refreshChatActivity}
          >
            Chat aktualisieren
          </Button>
        </Stack>
      ) : (
        <Stack
          direction="row"
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
              maxWidth: { xxs: "100%", sm: "27rem" },
              height: "100%",
              overflow: "auto",
              display: {
                xxs: visibleOnMobile === MobileView.RoomList ? "flex" : "none",
                sm: "flex",
              },
            }}
          >
            <RoomsPanel
              chatPanelView={chatPanelView}
              mobileView={visibleOnMobile}
              setChatPanelView={changeChatPanelView}
              setMobileView={setVisibleOnMobile}
            />
          </Stack>
          <Stack
            sx={{
              flex: 1.5,
              minWidth: 0,
              borderLeft: "1px solid",
              borderColor: theme.palette.neutral.outlinedBorder,
              overflow: "auto",
              display: {
                xxs:
                  visibleOnMobile === MobileView.ChatMessages ? "flex" : "none",
                sm: "flex",
              },
            }}
          >
            <ChatPanel
              key={roomId}
              roomId={roomId}
              chatPanelView={chatPanelView}
              setChatPanelView={changeChatPanelView}
              setMobileView={setVisibleOnMobile}
            />
          </Stack>
          {infoPanelState.isOpen && (
            <Stack
              sx={{
                flex: { sm: 1 },
                minWidth: 0,
                maxWidth: { xxs: "100%", sm: "22rem" },
                width: {
                  xxs: visibleOnMobile === MobileView.Settings ? "100%" : "0%",
                  sm: "auto",
                },
                borderLeft: "1px solid",
                borderColor: "neutral.outlinedBorder",
              }}
              role="dialog"
              aria-label={infoPanelAriaName(infoPanelState.view)}
            >
              <InfoPanel key={roomId} setMobileView={setVisibleOnMobile} />
            </Stack>
          )}
        </Stack>
      )}
    </>
  );
}

function infoPanelAriaName(infoPanelView?: InfoPanelView) {
  switch (infoPanelView) {
    case InfoPanelView.RoomInfo:
    case InfoPanelView.MobileView:
      return "Chat-Informationen";
    case InfoPanelView.AdminSettings:
      return "Chat-Einstellungen";
    case InfoPanelView.AddChatMember:
      return "Chat-Mitglied hinzufügen";
    case InfoPanelView.AssignAdminLevel:
      return "Admin bestimmen";
    case InfoPanelView.RenameGroupChat:
      return "Chat umbenennen";
    case InfoPanelView.UserInfo:
      return "Kontakt";
    default:
      return undefined;
  }
}
