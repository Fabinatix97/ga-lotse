/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { SnackbarComponentProps } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { Snackbar, Theme, styled } from "@mui/joy";

import { useHeaderHeights } from "@/lib/baseModule/components/layout/useHeaderHeights";

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
      right: theme.spacing(3),
      minHeight: "2.5rem",
      minWidth: "16rem",
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

export function EmployeeSnackbar(props: SnackbarComponentProps) {
  const { headerHeightMobile, headerHeightDesktop } = useHeaderHeights();
  return (
    <StyledSnackbar
      variant="soft"
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      headerHeightMobile={headerHeightMobile}
      headerHeightDesktop={headerHeightDesktop}
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
