/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Box, Stack, styled } from "@mui/joy";

import { EnvironmentIndicator } from "@eshg/lib-portal/components/EnvironmentIndicator";
import { useIsMobile } from "@eshg/lib-portal/hooks/theme";

import {
  MainMenu,
  MainMenuReduced,
} from "@/lib/baseModule/components/layout/navigationMenu/header/MainMenu";
import { NavMenu } from "@/lib/baseModule/components/layout/navigationMenu/header/NavMenu";
import {
  appBarHeightDesktop,
  appBarHeightDesktopReduced,
  appBarHeightMobile,
  contentMarginMobile,
} from "@/lib/baseModule/components/layout/sizes";
import { NavigationProps } from "@/lib/baseModule/components/layout/types";
import { byBreakpoint } from "@/lib/shared/breakpoints";
import { responsiveContent } from "@/lib/shared/components/layout/PageContent";

import { HeaderLogo, LogoImageReduced } from "./HeaderLogo";
import { MenuButton } from "./MenuButton";

const ResponsiveContainer = styled(Stack)(({ theme }) =>
  responsiveContent(theme),
);

export function Header(props: NavigationProps) {
  return (
    <Box
      component="header"
      position="sticky"
      top={0}
      zIndex="header"
      display="flex"
      flexDirection="column"
    >
      <EnvironmentIndicator />
      <Box
        height={byBreakpoint({
          mobile: appBarHeightMobile,
          desktop: appBarHeightDesktop,
        })}
        display="flex"
        justifyContent="center"
        boxSizing="content-box"
        sx={(theme) => ({
          background: byBreakpoint({
            mobile: theme.palette.common.white,
            desktop: `linear-gradient(180deg, ${theme.palette.background.level1} 50%, ${theme.palette.background.body} 50%)`,
          }),
        })}
      >
        <ResponsiveContainer
          display={byBreakpoint({ mobile: "none", desktop: "flex" })}
          flexDirection="row"
          gap={2}
          alignItems="center"
        >
          <HeaderLogo />
          <Stack flex={1} height={appBarHeightDesktop}>
            <Stack height="50%">
              <MainMenu userType={props.userType} />
            </Stack>
            <Stack height="50%">
              <NavMenu navigationItems={props.navigationItems} />
            </Stack>
          </Stack>
        </ResponsiveContainer>
        <ResponsiveContainer
          flex={1}
          flexDirection="row"
          justifyContent="space-between"
          paddingBlock={contentMarginMobile.topBottom}
          paddingInline={contentMarginMobile.leftRight}
          display={byBreakpoint({ mobile: "flex", desktop: "none" })}
        >
          <HeaderLogo />
          <Stack flexDirection="row" gap={1}>
            <MenuButton {...props} />
          </Stack>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}

export function ReducedHeader(props: NavigationProps) {
  const isMobile = useIsMobile();

  return (
    <Box
      component="header"
      position="sticky"
      top={0}
      zIndex="header"
      display="flex"
      flexDirection="column"
    >
      <EnvironmentIndicator />
      <Box
        height={byBreakpoint({
          mobile: appBarHeightMobile,
          desktop: appBarHeightDesktopReduced,
        })}
        display="flex"
        justifyContent="center"
        boxSizing="content-box"
        sx={(theme) => ({
          background: theme.palette.common.white,
        })}
      >
        {!isMobile ? (
          <ResponsiveContainer
            display="flex"
            flexDirection="row"
            gap={2}
            alignItems="center"
          >
            <Stack
              sx={{
                width: "192px",
              }}
            >
              <HeaderLogo
                slots={{ logoImage: LogoImageReduced }}
                slotProps={{
                  navLink: {
                    sx: {
                      width: byBreakpoint({
                        mobile: "90.2px",
                        desktop: "100px",
                      }),
                    },
                  },
                }}
              />
            </Stack>
            <Stack flex={1} height={appBarHeightDesktopReduced}>
              <MainMenuReduced userType={props.userType} />
            </Stack>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer
            display="flex"
            flexDirection="row"
            gap={2}
            alignItems="center"
            paddingBlock={contentMarginMobile.topBottom}
            paddingInline={contentMarginMobile.leftRight}
            justifyContent="space-between"
          >
            <Stack
              sx={{
                width: "164px",
              }}
            >
              <HeaderLogo
                slots={{ logoImage: LogoImageReduced }}
                slotProps={{
                  navLink: {
                    sx: {
                      width: byBreakpoint({
                        mobile: "90.2px",
                        desktop: "100px",
                      }),
                    },
                  },
                }}
              />
            </Stack>
            <Stack flexDirection="row" gap={1}>
              <MainMenuReduced userType={props.userType} />
            </Stack>
          </ResponsiveContainer>
        )}
      </Box>
    </Box>
  );
}
