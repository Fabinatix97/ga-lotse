/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ButtonProps, IconButton as JoyIconButton } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { CSSProperties, PropsWithChildren } from "react";

export function IconButton(
  props: PropsWithChildren<{
    disabled: boolean;
    label: string;
    onClick: () => void;
    style?: CSSProperties;
    sx?: SxProps;
    variant?: ButtonProps["variant"];
  }>,
) {
  return (
    <JoyIconButton
      aria-label={props.label}
      disabled={props.disabled}
      color="primary"
      variant={props.variant ?? "soft"}
      size="sm"
      onClick={props.onClick}
      style={props.style}
      sx={props.sx}
    >
      {props.children}
    </JoyIconButton>
  );
}
