/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useNavigation } from "@eshg/lib-portal/components/navigation/NavigationContext";
import OpenInNew from "@mui/icons-material/OpenInNew";
import { Button } from "@mui/joy";

import { MessagesSidebarContent } from "@/lib/baseModule/components/layout/messagesSidebar/MessagesSidebarContent";
import { routes } from "@/lib/baseModule/shared/routes";
import { DrawerProps } from "@/lib/shared/components/drawer/drawerContext";
import {
  UseSidebarResult,
  useSidebar,
} from "@/lib/shared/components/drawer/useSidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";

export function useMessagesSidebar(): UseSidebarResult {
  return useSidebar({
    component: MessagesSidebar,
  });
}

function MessagesSidebar({ onClose }: DrawerProps) {
  const { tryNavigate } = useNavigation();
  return (
    <>
      <MessagesSidebarContent />
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
