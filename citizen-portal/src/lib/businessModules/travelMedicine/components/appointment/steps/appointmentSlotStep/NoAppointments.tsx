/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DateRangeOutlined } from "@mui/icons-material";
import { Stack } from "@mui/joy";

import { RequiresChildren } from "@eshg/lib-portal/types/react";

export function NoAppointments(props: Readonly<RequiresChildren>) {
  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={2}
    >
      <DateRangeOutlined sx={{ fontSize: 70, color: "#94beff" }} />
      {props.children}
    </Stack>
  );
}
