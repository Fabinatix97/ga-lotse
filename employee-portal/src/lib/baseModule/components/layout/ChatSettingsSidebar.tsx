/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useNavigation } from "@eshg/lib-portal/components/navigation/NavigationContext";
import { OpenInNew } from "@mui/icons-material";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import { Button, Divider, Stack, Switch, Typography } from "@mui/joy";

import { routes } from "@/lib/baseModule/shared/routes";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import { useMatrixClient } from "@/lib/businessModules/chat/shared/hooks/useMatrixClient";
import { useUserSettings } from "@/lib/businessModules/chat/shared/hooks/useUserSettings";
import { getDepartmentNameFromUserId } from "@/lib/businessModules/chat/shared/utils";
import { DrawerProps } from "@/lib/shared/components/drawer/drawerContext";
import {
  UseSidebarResult,
  useSidebar,
} from "@/lib/shared/components/drawer/useSidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

export function useChatUserSidebar(): UseSidebarResult {
  return useSidebar({
    component: ChatSettingsSidebar,
  });
}

function ChatSettingsSidebar({ onClose }: DrawerProps) {
  const matrix = useMatrixClient();
  const { tryNavigate } = useNavigation();

  const chatUsername = getDepartmentNameFromUserId(matrix?.client.getUserId());

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
          <Stack>
            <Typography
              level="body-sm"
              textColor="text.secondary"
              sx={{ mb: 1 }}
            >
              Chat
            </Typography>
            <Typography level="title-md" textColor="primary.plainColor">
              {chatUsername?.username}
            </Typography>
            <Divider orientation="horizontal" sx={{ mt: 3 }} />
          </Stack>
        }
      >
        <Stack gap={2} height="100%">
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
