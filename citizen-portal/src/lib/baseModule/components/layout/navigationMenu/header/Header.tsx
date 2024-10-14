/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Box, Stack, styled } from "@mui/joy";

import { MainMenu } from "@/lib/baseModule/components/layout/navigationMenu/header/MainMenu";
import { NavMenu } from "@/lib/baseModule/components/layout/navigationMenu/header/NavMenu";
import {
  contentMarginMobile,
  headerHeightDesktop,
  headerHeightMobile,
} from "@/lib/baseModule/components/layout/sizes";
import { NavigationProps } from "@/lib/baseModule/components/layout/types";
import { byBreakpoint } from "@/lib/shared/breakpoints";
import { responsiveContent } from "@/lib/shared/components/layout/PageContent";

import { HeaderLogo } from "./HeaderLogo";
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
      height={byBreakpoint({
        mobile: headerHeightMobile,
        desktop: headerHeightDesktop,
      })}
      display="flex"
      justifyContent="center"
      boxSizing="content-box"
      sx={(theme) => ({
        background: byBreakpoint({
          mobile: theme.palette.common.white,
          desktop: `linear-gradient(180deg, ${theme.palette.background.body} 50%, ${theme.palette.background.surface} 50%)`,
        }),
      })}
    >
      <ResponsiveContainer
        display={byBreakpoint({ mobile: "none", desktop: "flex" })}
        flexDirection="row"
        gap={3}
        alignItems="center"
      >
        <HeaderLogo />
        <Stack flex={1} height={headerHeightDesktop}>
          <MainMenu userType={props.userType} />
          <NavMenu navigationItems={props.navigationItems} />
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
  );
}
