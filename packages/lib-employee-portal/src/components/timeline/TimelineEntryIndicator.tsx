/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { StepIndicator } from "@mui/joy";
import { StepIndicatorProps } from "@mui/joy/StepIndicator/StepIndicatorProps";

export function TimelineEntryIndicator(props: StepIndicatorProps) {
  return (
    <StepIndicator
      {...props}
      variant="plain"
      sx={{
        borderWidth: "1px",
        borderStyle: "solid",
        borderRadius: "100px",
      }}
    >
      {props.children}
    </StepIndicator>
  );
}
