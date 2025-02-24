/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useLayoutConfig } from "@eshg/lib-employee-portal/contexts/layoutConfig";
import { EnvironmentIndicator } from "@eshg/lib-portal/components/EnvironmentIndicator";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import { Box, Typography } from "@mui/joy";

import { HeaderButtons } from "@/lib/baseModule/components/layout/header/HeaderButtons";
import { HeaderIconButton } from "@/lib/baseModule/components/layout/header/HeaderIconButton";
import { useSidenav } from "@/lib/shared/components/drawer/useSidenav";
import { useIsOffline } from "@/lib/shared/hooks/useIsOffline";

export function Header() {
  const sidenav = useSidenav();
  const isOffline = useIsOffline();
  const { appBarHeightMobile, appBarHeightDesktop } = useLayoutConfig();

  function toggleSidenav(): void {
    if (sidenav.isOpen) {
      sidenav.close();
    } else {
      sidenav.open();
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
            aria-label={sidenav.isOpen ? "navigation-close" : "navigation-open"}
            sx={{
              display: { xxs: "flex", lg: "none" },
            }}
            onClick={toggleSidenav}
          >
            {sidenav.isOpen ? (
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
        {isOffline ? (
          <Typography level="h3" component="p" textColor="background.body">
            Offline
          </Typography>
        ) : (
          <HeaderButtons />
        )}
      </Box>
    </Box>
  );
}
