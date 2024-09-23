/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Box } from "@mui/joy";
import { usePathname } from "next/navigation";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";

import { useGetUnreadNotifications } from "@/lib/baseModule/api/queries/notifications";
import { SelfUserSidebar } from "@/lib/baseModule/components/layout/SelfUserSidebar";
import { Header } from "@/lib/baseModule/components/layout/header/Header";
import { MessagesSidebar } from "@/lib/baseModule/components/layout/messagesSidebar/MessagesSidebar";
import { SideNavigation } from "@/lib/baseModule/components/layout/sideNavigation/SideNavigation";
import {
  headerHeightDesktop,
  headerHeightMobile,
  sideNavigationCollapsedWidth,
  sideNavigationWidth,
} from "@/lib/baseModule/components/layout/sizes";
import { useChat } from "@/lib/businessModules/chat/shared/ChatProvider";
import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { useIsOffline } from "@/lib/shared/hooks/useIsOffline";

import { NotificationsSidebar } from "./notificationsSidebar/NotificationsSidebar";

export function MainLayout({ children }: { children: ReactNode }) {
  const unreadNotifications = useGetUnreadNotifications().data;
  const { canAccessChat } = useChat();

  const isOffline = useIsOffline();

  const [sideNavigationDrawerOpen, setSideNavigationDrawerOpen] =
    useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [userSidebarOpen, setUserSidebarOpen] = useState(false);
  const [notificationsSidebarOpen, setNotificationsSidebarOpen] =
    useState(false);

  const closeUserSidebar = useCallback(
    () => setUserSidebarOpen(false),
    [setUserSidebarOpen],
  );

  const notificationsCount = unreadNotifications
    ? unreadNotifications.notifications.length
    : 0;

  const drawerTransitionTime = "0.3s";

  return (
    <>
      <NavigationEvents
        setSideNavigationDrawerOpen={setSideNavigationDrawerOpen}
      />
      <Header
        sideNavigationDrawerOpen={sideNavigationDrawerOpen}
        setSideNavigationDrawerOpen={setSideNavigationDrawerOpen}
        setUserSidebarOpen={setUserSidebarOpen}
        notificationsSidebarOpen={notificationsSidebarOpen}
        setNotificationsSidebarOpen={setNotificationsSidebarOpen}
        notificationsCount={notificationsCount}
      />
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
                sm: collapsed
                  ? sideNavigationCollapsedWidth
                  : sideNavigationWidth,
              },
            }}
          >
            <SideNavigation
              sideNavigationDrawerOpen={sideNavigationDrawerOpen}
              setSideNavigationDrawerOpen={setSideNavigationDrawerOpen}
              collapsed={collapsed}
              setCollapsed={setCollapsed}
            />
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

        <SelfUserSidebar open={userSidebarOpen} onClose={closeUserSidebar} />
        <OverlayBoundary>
          <NotificationsSidebar
            open={notificationsSidebarOpen}
            onClose={() => setNotificationsSidebarOpen(false)}
            notificationResponse={unreadNotifications}
          />
        </OverlayBoundary>
        {canAccessChat && <MessagesSidebar />}
      </Box>
    </>
  );
}

function NavigationEvents({
  setSideNavigationDrawerOpen,
}: {
  setSideNavigationDrawerOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const pathname = usePathname();

  useEffect(() => {
    setSideNavigationDrawerOpen(false);
  }, [pathname, setSideNavigationDrawerOpen]);

  return null;
}
