/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { Check, Info, SvgIconComponent, Warning } from "@mui/icons-material";
import { Snackbar, Theme, styled } from "@mui/joy";

import { SnackbarComponentProps } from "@eshg/lib-portal";

import { useHeaderHeights } from "@/lib/components/layout/useHeaderHeights";

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
  ({ theme, position, headerHeightDesktop, headerHeightMobile }) => ({
    "&.MuiSnackbar-root": {
      "--Snackbar-padding": theme.spacing(1),
      "--Snackbar-inset": calculatedSnackbarOffset(
        headerHeightDesktop,
        position,
        theme,
      ),
      left: theme.spacing(3),
      right: "50vw",
      minHeight: "2.5rem",
      minWidth: "0",
      [theme.breakpoints.down("sm")]: {
        "--Snackbar-inset": calculatedSnackbarOffset(
          headerHeightMobile,
          position,
          theme,
        ),
      },
    },
  }),
);

export function AdminSnackbar(props: SnackbarComponentProps) {
  const { headerHeightMobile, headerHeightDesktop } = useHeaderHeights();
  const IconComponent = ICONS[props.color];
  return (
    <StyledSnackbar
      variant="soft"
      size="lg"
      headerHeightMobile={headerHeightMobile}
      headerHeightDesktop={headerHeightDesktop}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      startDecorator={<IconComponent />}
      {...props}
    />
  );
}

function calculatedSnackbarOffset(
  headerHeight: string,
  position: number,
  theme: Theme,
): string {
  const contentOffset = theme.spacing(1);
  const baseOffset = theme.spacing(7);
  return `calc(${headerHeight} + ${contentOffset} + ${position}*${baseOffset})`;
}
