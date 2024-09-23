/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useNavigation } from "@eshg/lib-portal/components/navigation/NavigationContext";
import { Button } from "@mui/joy";

import { routes } from "@/lib/baseModule/shared/routes";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
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
      <SidebarContent title="Nachrichten">
        <MessagesSidebarContent />
      </SidebarContent>
      <SidebarActions>
        <Button
          onClick={() => {
            chatSidebar.close();
            tryNavigate(routes.chat as string);
          }}
          sx={{ alignSelf: "end" }}
        >
          Zum Chat
        </Button>
      </SidebarActions>
    </Sidebar>
  );
}
