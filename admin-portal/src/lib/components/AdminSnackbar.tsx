/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { SnackbarComponentProps } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";
import { Check, Info, SvgIconComponent, Warning } from "@mui/icons-material";
import { Snackbar, Theme, styled } from "@mui/joy";

import {
  headerHeightDesktop,
  headerHeightMobile,
} from "@/lib/components/layout/theme/sizes";

const ICONS: Record<SnackbarComponentProps["color"], SvgIconComponent> = {
  primary: Info,
  success: Check,
  danger: Warning,
};

const StyledSnackbar = styled(Snackbar)<SnackbarComponentProps>(
  ({ theme, position }) => ({
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
  const IconComponent = ICONS[props.color];
  return (
    <StyledSnackbar
      variant="soft"
      size="lg"
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
