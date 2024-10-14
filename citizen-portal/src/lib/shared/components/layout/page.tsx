/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import {
  ScopedAlert,
  useAlert,
} from "@eshg/lib-portal/errorHandling/AlertContext";
import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { Sheet, Stack, Typography, styled } from "@mui/joy";
import { ReactNode } from "react";
import { isDefined } from "remeda";

import { theme } from "@/lib/baseModule/theme/theme";
import { MobileBreakpoint } from "@/lib/shared/breakpoints";

import { BannerType, PageBanner } from "./PageBanner";
import { PageContent } from "./PageContent";

const MainContents = styled("main")({
  display: "contents",
});

interface PageLayoutProps extends RequiresChildren {
  banner?: BannerType;
}

export function PageLayout(props: PageLayoutProps) {
  const alert = useAlert();

  return (
    <>
      {isDefined(props.banner) && <PageBanner type={props.banner} />}
      <MainContents>
        {alert !== null && (
          <PageContent>
            <ScopedAlert />
          </PageContent>
        )}
        {props.children}
      </MainContents>
    </>
  );
}

interface PageTitleProps extends RequiresChildren {
  toolbar?: ReactNode;
}

export function PageTitle(props: PageTitleProps) {
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
      }}
    >
      <Typography
        level="h2"
        flexGrow={1}
        sx={{ hyphens: "auto", overflowWrap: "break-word" }}
      >
        {props.children}
      </Typography>
      {props.toolbar}
    </Sheet>
  );
}
