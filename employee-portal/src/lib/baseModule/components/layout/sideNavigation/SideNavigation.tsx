/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Box, Drawer } from "@mui/joy";
import { Dispatch, SetStateAction } from "react";

import { NavigationListCollapsed } from "@/lib/baseModule/components/layout/sideNavigation/NavigationListCollapsed";
import {
  headerHeightDesktop,
  headerHeightMobile,
} from "@/lib/baseModule/components/layout/sizes";

import { NavigationListExpanded } from "./NavigationListExpanded";
import { useNavigationItems } from "./useNavigationItems";

export function SideNavigation({
  sideNavigationDrawerOpen,
  setSideNavigationDrawerOpen,
  collapsed,
  setCollapsed,
}: {
  sideNavigationDrawerOpen: boolean;
  setSideNavigationDrawerOpen: Dispatch<SetStateAction<boolean>>;
  collapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
}) {
  const items = useNavigationItems();

  return (
    <>
      {/* In desktop mode, the side navigation is either rendered expanded or collapsed (icons only) */}
      <Box
        sx={{
          display: { xxs: "none", sm: "flex" },
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
            items={items}
          />
        ) : (
          <NavigationListCollapsed setCollapsed={setCollapsed} items={items} />
        )}
      </Box>

      {/* In mobile mode, the side navigation is always expanded and is rendered inside a drawer */}
      <Drawer
        open={sideNavigationDrawerOpen}
        onClose={() => setSideNavigationDrawerOpen(false)}
        sx={{
          display: { xxs: "block", sm: "none" },
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
        <Box
          sx={{
            height: `calc(100dvh - ${headerHeightMobile})`,
            overflow: "auto",
            display: "flex",
          }}
        >
          <NavigationListExpanded showCollapseButton={false} items={items} />
        </Box>
      </Drawer>
    </>
  );
}
