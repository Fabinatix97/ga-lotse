/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Typography } from "@mui/joy";
import { ReactNode } from "react";

export interface DetailsFieldProps {
  icon: ReactNode;
  value: string;
}

export function DetailsField(props: Readonly<DetailsFieldProps>) {
  return (
    <Typography startDecorator={props.icon} sx={{ "--Typography-gap": "1rem" }}>
      {props.value}
    </Typography>
  );
}
