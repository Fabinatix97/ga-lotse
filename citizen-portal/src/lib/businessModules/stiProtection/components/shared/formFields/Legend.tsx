/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useIsFormDisabled } from "@eshg/lib-portal/components/form/DisabledFormContext";
import { FormLabel, getFormLabelUtilityClass, useTheme } from "@mui/joy";
import { TypographySystem } from "@mui/joy/styles/types";
import { PropsWithChildren } from "react";

interface LegendProps extends PropsWithChildren {
  level?: keyof TypographySystem;
}

export function Legend({ children, level }: LegendProps) {
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
    >
      {children}
    </FormLabel>
  );
}
