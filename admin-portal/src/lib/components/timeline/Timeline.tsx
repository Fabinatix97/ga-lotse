/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stepper, StepperProps } from "@mui/joy";

export function Timeline(props: StepperProps) {
  return (
    <Stepper
      orientation="vertical"
      size={"sm"}
      sx={{
        "--StepIndicator-size": "2rem",
        "--Step-connectorThickness": "2px",
        "--Step-connectorInset": "-0.25rem",
        "--Stepper-verticalGap": "1.5rem",
      }}
      {...props}
    >
      {props.children}
    </Stepper>
  );
}
