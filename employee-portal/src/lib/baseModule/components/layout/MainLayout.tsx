/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Box } from "@mui/joy";
import { ReactNode, useState } from "react";

import { Header } from "@/lib/baseModule/components/layout/header/Header";
import { SideNavigation } from "@/lib/baseModule/components/layout/sideNavigation/SideNavigation";
import {
  headerHeightDesktop,
  headerHeightMobile,
  sideNavigationCollapsedWidth,
  sideNavigationWidth,
} from "@/lib/baseModule/components/layout/sizes";
import { SidebarSlot } from "@/lib/shared/components/drawer/SidebarSlot";
import { useIsOffline } from "@/lib/shared/hooks/useIsOffline";

export function MainLayout({ children }: { children: ReactNode }) {
  const isOffline = useIsOffline();
  const [collapsed, setCollapsed] = useState(false);
  const drawerTransitionTime = "0.3s";

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
                xxs: `translateX(-${collapsed ? sideNavigationCollapsedWidth : sideNavigationWidth})`,
                sm: "none",
              },
              // Controls the horizontal offset of the main content.
              width: {
                xxs: "0",
                lg: collapsed
                  ? sideNavigationCollapsedWidth
                  : sideNavigationWidth,
              },
            }}
          >
            <SideNavigation collapsed={collapsed} setCollapsed={setCollapsed} />
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
