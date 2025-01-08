/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Divider } from "@mui/joy";

import { theme } from "@/lib/baseModule/theme/theme";

export function TileDivider() {
  return (
    <Divider
      orientation="vertical"
      sx={{
        mr: "-1px",
        [theme.breakpoints.down("xs")]: {
          display: "none",
        },
      }}
    />
  );
}
