/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Stack, Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { ReactNode } from "react";

interface FacilityCardContentProps {
  name: string;
  address?: string;
  emailAddress?: string;
  phoneNumber?: string;
  sx?: SxProps;
  children?: ReactNode;
}

export function FacilityCardContent(props: FacilityCardContentProps) {
  return (
    <Stack gap={1} sx={props.sx}>
      <Typography sx={{ fontWeight: "bold" }}>{props.name}</Typography>
      {props.address && <Typography>{props.address}</Typography>}
      {props.emailAddress && <Typography>{props.emailAddress}</Typography>}
      {props.phoneNumber && <Typography>{props.phoneNumber}</Typography>}
      {props.children}
    </Stack>
  );
}
