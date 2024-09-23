/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { IconButton as JoyIconButton } from "@mui/joy";
import { CSSProperties, PropsWithChildren } from "react";

export function IconButton(
  props: PropsWithChildren<{
    disabled: boolean;
    label: string;
    onClick: () => void;
    style?: CSSProperties;
  }>,
) {
  return (
    <JoyIconButton
      aria-label={props.label}
      disabled={props.disabled}
      color="primary"
      variant="soft"
      size="sm"
      onClick={props.onClick}
      style={props.style}
    >
      {props.children}
    </JoyIconButton>
  );
}
