/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { FormLabel, getFormLabelUtilityClass, useTheme } from "@mui/joy";
import { PropsWithChildren } from "react";

export function Legend({ children }: PropsWithChildren) {
  const theme = useTheme();

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
      }}
    >
      {children}
    </FormLabel>
  );
}
