/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Drawer, Stack } from "@mui/joy";

import { NavigationProps } from "@/lib/baseModule/components/layout/types";
import { byBreakpoint } from "@/lib/shared/breakpoints";
import { useHeaderHeights } from "@/lib/shared/components/layout/useHeaderHeights";

import { NavigationList } from "./NavigationList";

export function SideNavigation(props: NavigationProps) {
  const { headerHeightMobile } = useHeaderHeights();
  return (
    <Drawer
      open={props.navigationState.type !== "closed"}
      sx={{
        display: byBreakpoint({
          mobile: "block",
          desktop: "none",
        }),
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
      onClose={() => {
        props.setNavigationState({ type: "closed" });
      }}
    >
      <Stack overflow="auto" height={`calc(100vh - ${headerHeightMobile})`}>
        <NavigationList {...props} />
      </Stack>
    </Drawer>
  );
}
