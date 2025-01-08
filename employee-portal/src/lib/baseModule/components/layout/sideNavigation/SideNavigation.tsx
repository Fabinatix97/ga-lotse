/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box, Drawer } from "@mui/joy";
import { Dispatch, SetStateAction } from "react";

import { NavigationListCollapsed } from "@/lib/baseModule/components/layout/sideNavigation/NavigationListCollapsed";
import { sideNavigationWidth } from "@/lib/baseModule/components/layout/sizes";
import { useHeaderHeights } from "@/lib/baseModule/components/layout/useHeaderHeights";
import { useSidenav } from "@/lib/shared/components/drawer/useSidenav";

import { NavigationListExpanded } from "./NavigationListExpanded";
import { useNavigationItems } from "./useNavigationItems";

export function SideNavigation({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
}) {
  const sidenav = useSidenav();
  const { isLoading, itemGroups } = useNavigationItems();
  const { headerHeightMobile, headerHeightDesktop } = useHeaderHeights();

  return (
    <>
      {/* In desktop mode, the side navigation is either rendered expanded or collapsed (icons only) */}
      <Box
        sx={{
          display: { xxs: "none", lg: "flex" },
          position: "fixed",
          height: `calc(100dvh - ${headerHeightDesktop})`,
          zIndex: "sideNavigation",
          borderRight: 1,
          borderColor: "divider",
        }}
      >
        {!collapsed ? (
          <NavigationListExpanded
            showCollapseButton
            setCollapsed={setCollapsed}
            itemGroups={itemGroups}
            isLoading={isLoading}
          />
        ) : (
          <NavigationListCollapsed
            setCollapsed={setCollapsed}
            itemGroups={itemGroups}
          />
        )}
      </Box>

      {/* In mobile mode, the side navigation is always expanded and is rendered inside a drawer */}
      <Drawer
        open={sidenav.isOpen}
        onClose={sidenav.close}
        sx={{
          display: { xxs: "block", lg: "none" },
          zIndex: "sideNavigation",
        }}
        slotProps={{
          content: {
            sx: {
              boxShadow: "none",
              width: { xxs: "100vw", sm: sideNavigationWidth },
              top: headerHeightMobile,
            },
          },
        }}
      >
        <Box
          sx={{
            height: `calc(100dvh - ${headerHeightMobile})`,
            overflow: "auto",
            display: "flex",
          }}
        >
          <NavigationListExpanded
            showCollapseButton={false}
            itemGroups={itemGroups}
            isLoading={isLoading}
          />
        </Box>
      </Drawer>
    </>
  );
}
