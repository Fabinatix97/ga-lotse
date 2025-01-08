/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { RequiresChildren } from "@eshg/lib-portal/types/react";
import { Typography } from "@mui/joy";

export function DataElementHeading(props: Readonly<RequiresChildren>) {
  return (
    <Typography sx={{ fontSize: 14, fontWeight: "bold", marginBottom: 2 }}>
      {props.children}
    </Typography>
  );
}
