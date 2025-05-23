/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { FormLabel, getFormLabelUtilityClass, useTheme } from "@mui/joy";
import { TypographySystem } from "@mui/joy/styles/types";
import { PropsWithChildren } from "react";

import { useIsFormDisabled } from "../form/DisabledFormContext";

interface LegendProps extends PropsWithChildren {
  level?: keyof TypographySystem;
  id?: string;
}

export function Legend({ children, level, id }: LegendProps) {
  const theme = useTheme();
  const disabled = useIsFormDisabled();

  if (children == null) {
    return null;
  }
  if (typeof children !== "string") {
    return children;
  }
  return (
    <FormLabel
      component="legend"
      className={getFormLabelUtilityClass("root")}
      sx={{
        padding: 0,
        margin: "0 0 0.375rem 0",
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.md,
        color: disabled ? theme.palette.text.secondary : "inherit",
        ...(level && {
          font: theme.typography[level],
        }),
      }}
      id={id}
    >
      {children}
    </FormLabel>
  );
}
