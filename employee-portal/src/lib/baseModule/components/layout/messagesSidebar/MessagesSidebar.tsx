/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useNavigation } from "@eshg/lib-portal/components/navigation/NavigationContext";
import OpenInNew from "@mui/icons-material/OpenInNew";
import { Button, Divider, Stack } from "@mui/joy";

import { routes } from "@/lib/baseModule/shared/routes";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

import { MessagesSidebarContent } from "./MessagesSidebarContent";

export function MessagesSidebar() {
  const { chatSidebar } = useChat();
  const { tryNavigate } = useNavigation();

  return (
    <Sidebar
      open={chatSidebar.isOpen}
      onClose={chatSidebar.close}
      zIndex={"headerSidebar"}
    >
      <SidebarContent title="Ungelesene Chats">
        <MessagesSidebarContent />
      </SidebarContent>
      <Stack sx={{ paddingTop: 3 }} data-testid="sidebarActions">
        <Divider sx={{ marginBottom: 3, marginInline: -3, marginTop: -3 }} />
        <Button
          sx={{ alignSelf: "end" }}
          onClick={() => {
            chatSidebar.close();
            tryNavigate(routes.chat as string);
          }}
          endDecorator={<OpenInNew />}
        >
          Chatbereich
        </Button>
      </Stack>
    </Sidebar>
  );
}
