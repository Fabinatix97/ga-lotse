/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { StepIndicator } from "@mui/joy";
import { StepIndicatorProps } from "@mui/joy/StepIndicator/StepIndicatorProps";

export function TimelineEntryIndicator(props: StepIndicatorProps) {
  return (
    <StepIndicator
      {...props}
      variant={"plain"}
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
