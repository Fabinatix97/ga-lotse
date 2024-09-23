/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Drawer, Stack } from "@mui/joy";

import { headerHeightMobile } from "@/lib/baseModule/components/layout/sizes";
import { NavigationProps } from "@/lib/baseModule/components/layout/types";

import { NavigationList } from "./NavigationList";

export function SideNavigation(props: NavigationProps) {
  return (
    <Drawer
      open={props.navigationState.type !== "closed"}
      onClose={() => {
        props.setNavigationState({ type: "closed" });
      }}
      sx={{
        display: { xxs: "block", md: "none" },
        zIndex: "sideNavigation",
      }}
      slotProps={{
        content: {
          sx: {
            boxShadow: "none",
            width: "100vw",
            top: headerHeightMobile,
          },
        },
      }}
    >
      <Stack overflow="auto" height={`calc(100vh - ${headerHeightMobile})`}>
        <NavigationList {...props} />
      </Stack>
    </Drawer>
  );
}
