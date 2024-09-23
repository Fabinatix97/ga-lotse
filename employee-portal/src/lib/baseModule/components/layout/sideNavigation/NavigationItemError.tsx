/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Warning } from "@mui/icons-material";
import { Tooltip } from "@mui/joy";

export function NavigationItemError(props: { error: string }) {
  return (
    <Tooltip placement="right" title={props.error}>
      <Warning
        color="danger"
        size="sm"
        sx={{
          position: "absolute",
          zIndex: 1,
          left: -5,
          top: -5,
        }}
      />
    </Tooltip>
  );
}
