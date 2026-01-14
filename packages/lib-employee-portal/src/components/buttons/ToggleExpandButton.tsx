/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

"use client";

import { Button, ButtonProps, styled } from "@mui/joy";
import { ReactNode } from "react";

const ActiveStateText = styled("span")(({ theme }) => ({
  color: theme.palette.primary.outlinedColor,
}));

export interface ToggleExpandButtonProps
  extends Omit<ButtonProps, "variant" | "color"> {
  expanded: boolean;
  "aria-controls"?: string;
  activeStateText?: ReactNode;
}

export function ToggleExpandButton(props: ToggleExpandButtonProps) {
  const {
    expanded,
    activeStateText,
    children,
    "aria-controls": controls,
    ...buttonProps
  } = props;

  return (
    <Button
      variant="outlined"
      color={expanded ? "primary" : "neutral"}
      aria-expanded={expanded}
      aria-controls={controls}
      {...buttonProps}
    >
      {renderButtonText(children, activeStateText)}
    </Button>
  );
}

function renderButtonText(
  children: ReactNode,
  stateText: ReactNode | undefined,
) {
  if (stateText === undefined) {
    return children;
  }

  return (
    <span>
      {children} <ActiveStateText>({stateText})</ActiveStateText>
    </span>
  );
}
