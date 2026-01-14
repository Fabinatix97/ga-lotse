/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import OpenInNew from "@mui/icons-material/OpenInNew";
import { Button } from "@mui/joy";

import {
  DrawerProps,
  SidebarActions,
  UseSidebarResult,
  useSidebar,
} from "@eshg/lib-employee-portal";
import { useNavigation } from "@eshg/lib-portal";

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
          endDecorator={<OpenInNew />}
          onClick={() => {
            onClose();
            tryNavigate(routes.chat);
          }}
        >
          Chatbereich
        </Button>
      </SidebarActions>
    </>
  );
}
