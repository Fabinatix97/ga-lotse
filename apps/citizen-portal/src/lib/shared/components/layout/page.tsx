/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { Sheet, Stack, Typography, styled } from "@mui/joy";
import { ReactNode } from "react";
import { isDefined } from "remeda";

import {
  AlertSlot,
  RequiresChildren,
  useAutoTitleFocus,
} from "@eshg/lib-portal";

import { theme } from "@/lib/baseModule/theme/theme";
import { MobileBreakpoint } from "@/lib/shared/breakpoints";

import { BannerType, PageBanner } from "./PageBanner";
import { PageContent } from "./PageContent";

const MainContents = styled("main")({
  display: "contents",
});

const AlertContainer = styled(PageContent)(({ theme }) => ({
  paddingBlockEnd: 0,
  gap: theme.spacing(2),
}));

interface PageLayoutProps extends RequiresChildren {
  banner?: BannerType;
}

export function PageLayout(props: PageLayoutProps) {
  return (
    <>
      {isDefined(props.banner) && <PageBanner type={props.banner} />}
      <MainContents>
        <AlertSlot container={AlertContainer} />
        {props.children}
      </MainContents>
    </>
  );
}

interface PageTitleProps extends RequiresChildren {
  toolbar?: ReactNode;
  titleId?: string;
}

export function PageTitle(props: PageTitleProps) {
  const titleRef = useAutoTitleFocus();

  return (
    <Sheet
      component={Stack}
      direction="row"
      gap={3}
      alignItems="center"
      sx={{
        [theme.breakpoints.down(MobileBreakpoint.Down)]: {
          borderRadius: 0,
        },
        backgroundColor: theme.palette.background.body,
      }}
    >
      <Typography
        ref={titleRef}
        level="h1"
        flexGrow={1}
        sx={{ hyphens: "auto", overflowWrap: "break-word" }}
        tabIndex={-1}
        id={props.titleId}
      >
        {props.children}
      </Typography>
      {props.toolbar}
    </Sheet>
  );
}
