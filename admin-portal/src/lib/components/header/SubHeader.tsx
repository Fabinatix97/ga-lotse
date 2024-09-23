/**
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Typography } from "@mui/joy";

export function SubHeader({ header }: Readonly<{ header: string }>) {
  return (
    <Typography level="h2" sx={{ paddingBottom: 2 }}>
      {header}
    </Typography>
  );
}
