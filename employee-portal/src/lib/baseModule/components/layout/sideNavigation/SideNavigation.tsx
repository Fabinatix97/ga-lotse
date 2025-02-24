/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useHeaderHeights } from "@eshg/lib-employee-portal/hooks/useHeaderHeights";
import { Box, Drawer } from "@mui/joy";
import { Dispatch, SetStateAction } from "react";

import { CollapsedNavigationList } from "@/lib/baseModule/components/layout/sideNavigation/lists/CollapsedNavigationList";
import { ExpandedNavigationList } from "@/lib/baseModule/components/layout/sideNavigation/lists/ExpandedNavigationList";
import { sideNavigationWidth } from "@/lib/baseModule/components/layout/sizes";
import { useResolveSideNavigationItems } from "@/lib/baseModule/moduleRegister/sideNavigationItemsResolver";
import { useSidenav } from "@/lib/shared/components/drawer/useSidenav";

export function SideNavigation({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
}) {
  const sidenav = useSidenav();
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
        {!collapsed ? (
          <ExpandedNavigationList
            showCollapseButton
            onCollapse={() => setCollapsed(true)}
            itemGroups={itemGroups}
          />
        ) : (
          <CollapsedNavigationList
            onExpand={() => setCollapsed(false)}
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
          <ExpandedNavigationList
            showCollapseButton={false}
            itemGroups={itemGroups}
          />
        </Box>
      </Drawer>
    </>
  );
}
