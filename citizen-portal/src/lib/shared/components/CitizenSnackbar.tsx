/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { SnackbarComponentProps } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { Check, Info, SvgIconComponent, Warning } from "@mui/icons-material";
import { Snackbar, Theme, styled } from "@mui/joy";

import {
  ContentMargin,
  contentMarginDesktop,
  contentMarginMobile,
  headerHeightDesktop,
  headerHeightMobile,
} from "@/lib/baseModule/components/layout/sizes";
import { responsiveContent } from "@/lib/shared/components/layout/PageContent";

const ICONS: Record<SnackbarComponentProps["color"], SvgIconComponent> = {
  primary: Info,
  success: Check,
  danger: Warning,
};

const StyledSnackbar = styled(Snackbar)<SnackbarComponentProps>(
  ({ theme, color, position }) => ({
    "&.MuiSnackbar-root": {
      "--Snackbar-padding": theme.spacing(2),
      "--Snackbar-inset": calculatedSnackbarOffset(
        headerHeightDesktop,
        contentMarginDesktop,
        position,
        theme,
      ),
      border: `1px solid ${theme.palette[color].softColor}`,
      ...responsiveContent(theme, {
        md: {
          "--Snackbar-inset": calculatedSnackbarOffset(
            headerHeightMobile,
            contentMarginMobile,
            position,
            theme,
          ),
          width: calculatedMobileWidth(contentMarginDesktop, theme),
        },
        sm: {
          width: calculatedMobileWidth(contentMarginMobile, theme),
        },
      }),
    },
  }),
);

export function CitizenSnackbar(props: SnackbarComponentProps) {
  const IconComponent = ICONS[props.color];
  return (
    <StyledSnackbar
      variant="soft"
      size="lg"
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      startDecorator={<IconComponent />}
      {...props}
    />
  );
}

function calculatedMobileWidth(
  contentMargin: ContentMargin,
  theme: Theme,
): string {
  return `calc(100% - 2*${theme.spacing(contentMargin.leftRight)})`;
}

function calculatedSnackbarOffset(
  headerHeight: string,
  contentMargin: ContentMargin,
  position: number,
  theme: Theme,
) {
  const contentOffset = theme.spacing(contentMargin.topBottom);
  const baseOffset = theme.spacing(9);
  return `calc(${headerHeight} + ${contentOffset} + ${position}*${baseOffset})`;
}
