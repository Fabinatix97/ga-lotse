/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, Typography } from "@mui/joy";

import {
  OfflineIndicator,
  useIsOffline,
  useLayoutConfig,
  useSidenavDrawer,
} from "@eshg/lib-employee-portal";
import { EnvironmentIndicator } from "@eshg/lib-portal";

import { HeaderButtons } from "@/lib/baseModule/components/layout/header/HeaderButtons";
import { HeaderIconButton } from "@/lib/baseModule/components/layout/header/HeaderIconButton";

export function Header() {
  const sidenavDrawer = useSidenavDrawer();
  const isOffline = useIsOffline();
  const { appBarHeightMobile, appBarHeightDesktop } = useLayoutConfig();

  function toggleSidenav(): void {
    if (sidenavDrawer.isOpen) {
      sidenavDrawer.close();
    } else {
      sidenavDrawer.open();
    }
  }

  return (
    <Box
      component="header"
      display="flex"
      position="fixed"
      flexDirection="column"
      top={0}
      sx={{
        left: 0,
        right: 0,
      }}
      zIndex="header"
    >
      <EnvironmentIndicator />
      <OfflineIndicator />
      <Box
        display="flex"
        sx={{
          background: (theme) =>
            `linear-gradient(90deg, ${theme.palette.primary[700]} 0%, ${theme.palette.primary[500]} 100%)`,
          boxShadow: "xl",
          paddingInline: 3,
          paddingBlock: 1,
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1,
          height: {
            xxs: appBarHeightMobile,
            sm: appBarHeightDesktop,
          },
        }}
      >
        {!isOffline && (
          <HeaderIconButton
            aria-label={
              sidenavDrawer.isOpen ? "navigation-close" : "navigation-open"
            }
            sx={{
              display: { xxs: "flex", lg: "none" },
            }}
            onClick={toggleSidenav}
          >
            {sidenavDrawer.isOpen ? (
              <CloseIcon sx={{ color: "background.body" }} />
            ) : (
              <MenuIcon sx={{ color: "background.body" }} />
            )}
          </HeaderIconButton>
        )}
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
        {!isOffline && <HeaderButtons />}
      </Box>
    </Box>
  );
}
