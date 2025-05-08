/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ButtonProps, IconButton as JoyIconButton, useTheme } from "@mui/joy";
import { SxProps, Variants } from "@mui/joy/styles/types";
import { PropsWithChildren } from "react";

export function IconButton(
  props: PropsWithChildren<{
    disabled?: boolean;
    ariaDisabled?: boolean;
    label: string;
    onClick: () => void;
    sx?: SxProps;
    variant?: ButtonProps["variant"];
  }>,
) {
  const theme = useTheme();

  // Extract the disabled styles from JoyIconButton
  const variant = props.variant ?? "soft";
  const disabledStyles =
    theme.variants[`${variant}Disabled` satisfies keyof Variants].primary;

  return (
    <JoyIconButton
      aria-label={props.label}
      aria-disabled={props.ariaDisabled}
      disabled={props.disabled}
      color="primary"
      variant={variant}
      size="sm"
      sx={{
        '&[aria-disabled="true"]': disabledStyles,
        ...(props.sx ?? {}),
      }}
      onClick={props.onClick}
    >
      {props.children}
    </JoyIconButton>
  );
}
