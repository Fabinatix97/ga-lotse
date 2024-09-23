/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Box, Stack } from "@mui/joy";

import { MainMenu } from "@/lib/baseModule/components/layout/navigationMenu/header/MainMenu";
import { NavMenu } from "@/lib/baseModule/components/layout/navigationMenu/header/NavMenu";
import {
  contentMarginDesktop,
  headerHeightDesktop,
  headerHeightMobile,
  maxContentWidthDesktop,
} from "@/lib/baseModule/components/layout/sizes";
import { NavigationProps } from "@/lib/baseModule/components/layout/types";

import { HeaderLogo } from "./HeaderLogo";
import { MenuButton } from "./MenuButton";

export function Header(props: NavigationProps) {
  return (
    <Box
      component="header"
      position="sticky"
      top={0}
      zIndex="header"
      height={{ xxs: headerHeightMobile, md: headerHeightDesktop }}
      display="flex"
      justifyContent="center"
      boxSizing="content-box"
      sx={(theme) => ({
        background: {
          xxs: theme.palette.common.white,
          md: `linear-gradient(180deg, ${theme.palette.background.body} 50%, ${theme.palette.background.surface} 50%)`,
        },
      })}
    >
      <Stack
        display={{ xxs: "none", md: "flex" }}
        width={maxContentWidthDesktop}
        paddingInline={contentMarginDesktop.leftRight}
        flexDirection="row"
        gap={3}
        alignItems="center"
      >
        <HeaderLogo />
        <Stack flex={1} height={headerHeightDesktop}>
          <MainMenu userType={props.userType} />
          <NavMenu navigationItems={props.navigationItems} />
        </Stack>
      </Stack>
      <Stack
        flex={1}
        flexDirection="row"
        justifyContent="space-between"
        padding={2}
        display={{ xxs: "flex", md: "none" }}
      >
        <HeaderLogo />
        <Stack flexDirection="row" gap={1}>
          <MenuButton {...props} />
        </Stack>
      </Stack>
    </Box>
  );
}
