/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Box } from "@mui/joy";
import { ReactNode } from "react";

import {
  SidebarSlot,
  useHeaderHeights,
  useIsOffline,
  useSidenav,
} from "@eshg/lib-employee-portal";

import { Header } from "@/lib/baseModule/components/layout/header/Header";
import { SideNavigation } from "@/lib/baseModule/components/layout/sideNavigation/SideNavigation";
import {
  sideNavigationCollapsedWidth,
  sideNavigationWidth,
} from "@/lib/baseModule/components/layout/sizes";

export function MainLayout({ children }: { children: ReactNode }) {
  const isOffline = useIsOffline();
  const sidenav = useSidenav();
  const drawerTransitionTime = "0.3s";
  const { headerHeightMobile, headerHeightDesktop } = useHeaderHeights();

  return (
    <>
      <Header />
      <Box
        sx={{
          display: "flex",
          marginTop: { xxs: headerHeightMobile, sm: headerHeightDesktop },
        }}
      >
        {!isOffline && (
          <Box
            component="aside"
            sx={{
              transition: `transform ${drawerTransitionTime}, width ${drawerTransitionTime}`,
              // Fades desktop side navigation in, when display width gets expanded.
              transform: {
                xxs: `translateX(-${sidenav.isCollapsed ? sideNavigationCollapsedWidth : sideNavigationWidth})`,
                sm: "none",
              },
              // Controls the horizontal offset of the main content.
              width: {
                xxs: "0",
                lg: sidenav.isCollapsed
                  ? sideNavigationCollapsedWidth
                  : sideNavigationWidth,
              },
            }}
          >
            <SideNavigation />
          </Box>
        )}

        <Box
          component="main"
          sx={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              // Height is set to the full viewport height (minus the header) to enable pages to limit their height to the viewport height.
              // This is useful for pages that have a scrollable component (app-like pages).
              // For regular flow pages, this height setting is ignored and the content will just overflow (and the scrollbar on body will appear).
              "&:has(.fullViewportHeight)": {
                height: {
                  xxs: `calc(100dvh - ${headerHeightMobile})`,
                  sm: `calc(100dvh - ${headerHeightDesktop})`,
                },
              },
              minHeight: {
                xxs: `calc(100dvh - ${headerHeightMobile})`,
                sm: `calc(100dvh - ${headerHeightDesktop})`,
              },
            }}
          >
            {children}
          </Box>
        </Box>

        <SidebarSlot />
      </Box>
    </>
  );
}
