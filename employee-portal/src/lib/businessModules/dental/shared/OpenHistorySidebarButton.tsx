/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Button, Typography } from "@mui/joy";
import { MouseEventHandler } from "react";

export function OpenHistorySidebarButton(props: {
  onClick: MouseEventHandler;
  name: string;
}) {
  return (
    <Button onClick={props.onClick} variant="plain" sx={{ padding: 0 }}>
      <Typography component="span" color="primary">
        (
      </Typography>
      <Typography component="u" color="primary">
        {props.name}
      </Typography>
      <Typography component="span" color="primary">
        )
      </Typography>
    </Button>
  );
}
