/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { Check, Info, SvgIconComponent, Warning } from "@mui/icons-material";
import { Snackbar, Theme, styled } from "@mui/joy";

import { SnackbarComponentProps } from "@eshg/lib-portal";

import {
  ContentMargin,
  contentMarginDesktop,
  contentMarginMobile,
} from "@/lib/baseModule/components/layout/sizes";
import { responsiveContent } from "@/lib/shared/components/layout/PageContent";
import { useHeaderHeights } from "@/lib/shared/components/layout/useHeaderHeights";

const ICONS: Record<SnackbarComponentProps["color"], SvgIconComponent> = {
  primary: Info,
  success: Check,
  danger: Warning,
};

interface StyledSnackbarProps extends SnackbarComponentProps {
  headerHeightDesktop: string;
  headerHeightMobile: string;
}

function excludeHeaderHeightProps(
  prop: PropertyKey,
): prop is keyof StyledSnackbarProps {
  return prop !== "headerHeightDesktop" && prop !== "headerHeightMobile";
}

const StyledSnackbar = styled(Snackbar, {
  shouldForwardProp: excludeHeaderHeightProps,
})<StyledSnackbarProps>(
  ({ theme, color, position, headerHeightDesktop, headerHeightMobile }) => ({
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
  const { headerHeightDesktop, headerHeightMobile } = useHeaderHeights();
  const IconComponent = ICONS[props.color];
  return (
    <StyledSnackbar
      variant="soft"
      size="lg"
      headerHeightDesktop={headerHeightDesktop}
      headerHeightMobile={headerHeightMobile}
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
