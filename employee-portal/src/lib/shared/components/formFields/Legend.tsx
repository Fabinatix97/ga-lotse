/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { FormLabel, getFormLabelUtilityClass, useTheme } from "@mui/joy";
import { PropsWithChildren } from "react";

export function Legend({
  children,
  variant = "group",
}: PropsWithChildren<{ variant?: "group" | "single" }>) {
  const theme = useTheme();
  const groupLegendStyles = {
    fontWeight: 400,
    fontSize: theme.fontSize.md,
  };
  const singleLegendStyles = {
    fontWeight: theme.fontWeight.md,
  };
  const extraLegendStyles =
    variant === "group" ? groupLegendStyles : singleLegendStyles;

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
        ...extraLegendStyles,
      }}
    >
      {children}
    </FormLabel>
  );
}
