/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  DrawerProps,
  SidebarActions,
  UseSidebarResult,
  useSidebar,
} from "@eshg/lib-employee-portal";
import { useNavigation } from "@eshg/lib-portal/components/navigation/NavigationContext";
import OpenInNew from "@mui/icons-material/OpenInNew";
import { Button } from "@mui/joy";

import { MessagesSidebarContent } from "@/lib/baseModule/components/layout/messagesSidebar/MessagesSidebarContent";
import { routes } from "@/lib/baseModule/shared/routes";

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
            tryNavigate(routes.chat);
          }}
          endDecorator={<OpenInNew />}
        >
          Chatbereich
        </Button>
      </SidebarActions>
    </>
  );
}
