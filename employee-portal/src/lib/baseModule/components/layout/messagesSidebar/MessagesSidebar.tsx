/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useNavigation } from "@eshg/lib-portal/components/navigation/NavigationContext";
import OpenInNew from "@mui/icons-material/OpenInNew";
import { Button, Divider, Stack } from "@mui/joy";

import { MessagesSidebarContent } from "@/lib/baseModule/components/layout/messagesSidebar/MessagesSidebarContent";
import { routes } from "@/lib/baseModule/shared/routes";
import { DrawerProps } from "@/lib/shared/components/drawer/drawerContext";
import {
  UseSidebarResult,
  useSidebar,
} from "@/lib/shared/components/drawer/useSidebar";

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
      <Stack sx={{ paddingTop: 3 }} data-testid="sidebarActions">
        <Divider sx={{ marginBottom: 3, marginInline: -3, marginTop: -3 }} />
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
      </Stack>
    </>
  );
}
