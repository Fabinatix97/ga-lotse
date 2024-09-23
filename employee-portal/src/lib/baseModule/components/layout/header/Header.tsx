/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, Typography } from "@mui/joy";
import { Dispatch, SetStateAction } from "react";

import { HeaderButtons } from "@/lib/baseModule/components/layout/header/HeaderButtons";
import { HeaderIconButton } from "@/lib/baseModule/components/layout/header/HeaderIconButton";
import {
  headerHeightDesktop,
  headerHeightMobile,
} from "@/lib/baseModule/components/layout/sizes";
import { useIsOffline } from "@/lib/shared/hooks/useIsOffline";

export interface HeaderProps {
  sideNavigationDrawerOpen: boolean;
  setSideNavigationDrawerOpen: Dispatch<SetStateAction<boolean>>;
  setUserSidebarOpen: Dispatch<SetStateAction<boolean>>;
  notificationsSidebarOpen: boolean;
  setNotificationsSidebarOpen: Dispatch<SetStateAction<boolean>>;
  notificationsCount: number;
}

export function Header({
  sideNavigationDrawerOpen,
  setSideNavigationDrawerOpen,
  setUserSidebarOpen,
  notificationsSidebarOpen,
  setNotificationsSidebarOpen,
  notificationsCount,
}: HeaderProps) {
  const isOffline = useIsOffline();

  return (
    <Box
      component="header"
      sx={{
        background: (theme) =>
          `linear-gradient(90deg, ${theme.palette.primary[700]} 0%, ${theme.palette.primary[500]} 100%)`,
        boxShadow: "xl",
        paddingInline: 3,
        paddingBlock: 1,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 1,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: { xxs: headerHeightMobile, sm: headerHeightDesktop },
        zIndex: "header",
      }}
    >
      <HeaderIconButton
        aria-label={
          sideNavigationDrawerOpen ? "navigation-close" : "navigation-open"
        }
        sx={{
          display: { xxs: "flex", sm: "none" },
        }}
        onClick={() => {
          setSideNavigationDrawerOpen((prev) => !prev);
        }}
      >
        {sideNavigationDrawerOpen ? (
          <CloseIcon sx={{ color: "background.body" }} />
        ) : (
          <MenuIcon sx={{ color: "background.body" }} />
        )}
      </HeaderIconButton>
      <Typography
        level="h2"
        textColor="background.body"
        component="p"
        sx={{
          fontSize: {
            xs: "xl2",
            xxs: "xl",
          },
        }}
      >
        GA-Lotse
      </Typography>
      {isOffline ? (
        <Typography level="h3" component="p" textColor="background.body">
          Offline
        </Typography>
      ) : (
        <HeaderButtons
          setUserSidebarOpen={setUserSidebarOpen}
          notificationsSidebarOpen={notificationsSidebarOpen}
          setNotificationsSidebarOpen={setNotificationsSidebarOpen}
          notificationsCount={notificationsCount}
        />
      )}
    </Box>
  );
}
