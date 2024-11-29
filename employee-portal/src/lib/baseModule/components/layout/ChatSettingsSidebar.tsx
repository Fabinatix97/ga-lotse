/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useNavigation } from "@eshg/lib-portal/components/navigation/NavigationContext";
import { OpenInNew } from "@mui/icons-material";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import { Button, Divider, Stack, Switch, Typography } from "@mui/joy";
import { useContext } from "react";

import { routes } from "@/lib/baseModule/shared/routes";
import { ChatUserId } from "@/lib/businessModules/chat/components/ChatUserId";
import { ChatClientContext } from "@/lib/businessModules/chat/shared/ChatClientProvider";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import { useUserSettings } from "@/lib/businessModules/chat/shared/hooks/useUserSettings";
import { DrawerProps } from "@/lib/shared/components/drawer/drawerContext";
import {
  UseSidebarResult,
  useSidebar,
} from "@/lib/shared/components/drawer/useSidebar";
import { sidebarPadding } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

export function useChatUserSidebar(): UseSidebarResult {
  return useSidebar({
    component: ChatSettingsSidebar,
  });
}

function ChatSettingsSidebar({ onClose }: DrawerProps) {
  const { matrixClient } = useContext(ChatClientContext) ?? {};
  const { tryNavigate } = useNavigation();

  const chatUserId = matrixClient?.getUserId();

  const {
    userSettings: {
      sharePresence,
      showReadConfirmation,
      showTypingNotification,
    },
  } = useChat();
  const {
    togglePresenceStatus,
    toggleReadConfirmation,
    toggleTypingNotifications,
  } = useUserSettings();

  return (
    <>
      <SidebarContent
        title="Chat Einstellungen"
        header={
          <Stack spacing={2} sx={{ paddingRight: sidebarPadding }}>
            <ChatUserId userId={chatUserId} />
            <Divider orientation="horizontal" sx={{ mt: 2 }} />
          </Stack>
        }
      >
        <Stack gap={2} height="100%" sx={{ mt: 1 }}>
          <Typography
            component="label"
            startDecorator={
              <Switch
                checked={sharePresence}
                onChange={() => togglePresenceStatus(sharePresence)}
              />
            }
          >
            Online-Status sichtbar
          </Typography>
          <Typography
            component="label"
            startDecorator={
              <Switch
                checked={showReadConfirmation}
                onChange={() => toggleReadConfirmation(showReadConfirmation)}
              />
            }
          >
            Lesebestätigungen aktivieren
          </Typography>
          <Typography
            component="label"
            startDecorator={
              <Switch
                checked={showTypingNotification}
                onChange={() =>
                  toggleTypingNotifications(showTypingNotification)
                }
              />
            }
          >
            Schreibanzeige aktivieren
          </Typography>
        </Stack>
      </SidebarContent>

      <SidebarActions>
        <Button
          sx={{ alignSelf: "end" }}
          onClick={() => {
            onClose();
            tryNavigate(routes.chat as string);
          }}
          endDecorator={<OpenInNew />}
        >
          Chatbereich
        </Button>
      </SidebarActions>
    </>
  );
}

export function ChatSettingsButton() {
  const chatSidebar = useChatUserSidebar();
  return (
    <Button
      variant={"plain"}
      size={"md"}
      startDecorator={<ChatOutlinedIcon />}
      onClick={chatSidebar.open}
      sx={{
        paddingInline: 1,
        justifyContent: "flex-start",
      }}
    >
      Chat Einstellungen
    </Button>
  );
}
