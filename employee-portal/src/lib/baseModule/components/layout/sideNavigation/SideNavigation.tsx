/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box, Drawer } from "@mui/joy";

import {
  useHeaderHeights,
  useSidenav,
  useSidenavDrawer,
} from "@eshg/lib-employee-portal";

import { CollapsedNavigationList } from "@/lib/baseModule/components/layout/sideNavigation/lists/CollapsedNavigationList";
import { ExpandedNavigationList } from "@/lib/baseModule/components/layout/sideNavigation/lists/ExpandedNavigationList";
import { sideNavigationWidth } from "@/lib/baseModule/components/layout/sizes";
import { useResolveSideNavigationItems } from "@/lib/baseModule/moduleRegister/sideNavigationItemsResolver";

export function SideNavigation() {
  const sidenav = useSidenav();
  const sidenavDrawer = useSidenavDrawer();
  const itemGroups = useResolveSideNavigationItems();
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
        {!sidenav.isCollapsed ? (
          <ExpandedNavigationList
            showCollapseButton
            itemGroups={itemGroups}
            onCollapse={sidenav.collapse}
          />
        ) : (
          <CollapsedNavigationList
            itemGroups={itemGroups}
            onExpand={sidenav.expand}
          />
        )}
      </Box>

      {/* In mobile mode, the side navigation is always expanded and is rendered inside a drawer */}
      <Drawer
        open={sidenavDrawer.isOpen}
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
        onClose={sidenavDrawer.close}
      >
        <Box
          sx={{
            height: `calc(100dvh - ${headerHeightMobile})`,
            overflow: "auto",
            display: "flex",
          }}
        >
          <ExpandedNavigationList
            showCollapseButton={false}
            itemGroups={itemGroups}
          />
        </Box>
      </Drawer>
    </>
  );
}
